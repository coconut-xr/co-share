# Lockable Example

When building applications for concurrent usage, it is sometimes essential to prevent simultaneous editing of a single resource,
In this example, locking functionality is implemented to give only one user the ability to change to lock. 

In an actual application, the user does not want to wait for approval. The [**Optimistic Lockable**](https://cocoss-org.github.io/co-share/optimistic-lockable) Example shows how to improve this scenario.

# Source Code

[`lockable.ts`](https://github.com/cocoss-org/co-share/blob/master/examples/stores/lockable.ts)

```typescript
export class LockableStore extends Store {
    public state: StoreApi<{ value: number; owner: string }>

    public onUnlink(link: StoreLink): void {}

    public onLink(link: StoreLink): void {}

    public subscriber: Subscriber<LockableStore, [number, string]> = Subscriber.create(
        LockableStore,
        (connection, accept, deny) => {
            const s = this.state.getState()
            accept(s.value, s.owner)
        }
    )

    constructor(value: number, owner: string) {
        super()
        this.state = create(() => ({ value, owner }))
    }

    setSlider = Action.create(this, "setSlider", (origin, by: string, value: number) => {
        const { owner } = this.state.getState()
        if (owner != by) {
            return
        }

        this.state.setState({ value })

        this.setSlider.publishTo(origin == null ? { to: "all" } : { to: "all-except-one", except: origin }, by, value)
    })

    setSliderLock: Request<this, [string], boolean> = Request.create(this, "setSliderLock", (origin, owner: string) => {
        return (origin == null ? this.setSliderLock.publishTo(this.mainLink, owner) : of(true)).pipe(
            tap((approved) => {
                if (approved) {
                    this.forceSliderLock(owner)
                    if (origin != null) {
                        this.forceSliderLock.publishTo({ to: "all-except-one", except: origin }, owner)
                    }
                }
            })
        )
    })

    forceSliderLock = Action.create(this, "forceSliderLock", (origin, owner: string) => {
        this.state.setState({
            owner,
        })
    })
}
```

[`lockable.tsx`](https://github.com/cocoss-org/co-share/blob/master/examples/pages/lockable.tsx)

```typescript
export function LockableExamplePage({ rootStore }: { rootStore: RootStore }): JSX.Element {
    const store = useStoreSubscription(
        "lockable",
        1000,
        (value: number, owner: string) => new LockableStore(value, owner),
        undefined,
        rootStore
    )

    const id = useMemo(() => rootStore.mainLink.connection.userData.id, [rootStore])
    const inputRef = useRef<HTMLInputElement>(null)

    const useStoreState = useMemo(
        () =>
            create<{
                value: number
                owner: string
            }>(store.state),
        [store]
    )

    const { owner, value } = useStoreState()

    return (
        <div className="p-3">
            <button className="btn btn-outline-primary" onClick={() => store.setSliderLock(id).subscribe()}>
                lock
            </button>
            <button className="btn btn-outline-danger mx-3" onClick={() => store.setSliderLock("none").subscribe()}>
                release
            </button>
            <h2>Owner: {owner}</h2>
            <input
                className="w-100"
                onChange={() => inputRef.current && store.setSlider(id, inputRef.current.valueAsNumber)}
                type="range"
                min={0}
                max={10}
                value={value}
                ref={inputRef}></input>
        </div>
    )
}
```

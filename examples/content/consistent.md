# Consistent Example

We synchronize a ball that bounces off walls. All clients can invert the direction.  
This example is tricky because you can not lock the ball to one player.  
The simplest solution would let the server execute the inversion and confirm it to the client. However, this is slow, and we want **client-side prediction** and **lag-compensation**.  
We use the library [co-consistent](https://github.com/cocoss-org/co-consistent) and its concept of _extrapolatable states_ to assure consistent behaviour at all participants.  
After calculating a consistent state on all clients, we applied a **smoothing layer** to have a good UX even when lagging. Our example provides a button to disable this smoothing at each client.

You can test the correctness even when changing or randomizing the simulated **latency**.

# Source Code

[`consistent.ts`](https://github.com/cocoss-org/co-share/blob/master/examples/stores/consistent.ts)

```typescript
export class ConsistentStore extends Store {
    subscriber: Subscriber<Store, [time: number, value: number, directionInverted: boolean]> = Subscriber.create(
        ConsistentStore,
        (connection, accept) => {
            const time = this.clock.getCurrentTime()
            const entry = this.universe.history[this.universe.history.length - 1]
            this.universe.applyStateAt(this.realStateRef, entry, time)
            accept(time, this.realStateRef.value, this.realStateRef.directionInverted)
        }
    )

    private readonly universe: Universe<ContinousState>
    public readonly clock: Clock

    public readonly smoothedRef: { state: SmoothState | undefined; time: number | undefined } = {
        state: undefined,
        time: undefined,
    }
    private realStateRef = new ContinousState(0, false)

    constructor(private readonly onServer: boolean, time: number, value: number, directionInverted: boolean) {
        super()
        this.clock = new Clock(time, global.window == null ? () => 0 : () => window.performance.now())
        this.universe = new Universe(
            () => new ContinousState(0, false),
            (a1, a2) => a1.id - a2.id,
            2000
        )
        if (!onServer) {
            setTimeout(() => this.informTime())
        }

        this.universe.insert(
            {
                id: Math.random(),
                type: "init",
            },
            time,
            time,
            new ContinousState(value, directionInverted)
        )
    }

    changeTime = Action.create(this, "changeTime", (origin, by: number) => {
        if (this.onServer) {
            throw new Error("should not warp time on the server")
        }
        this.clock.change(by, 0.5)
        this.clock.wait(Math.max(500, by * 2)).then(() => this.informTime())
    })

    informTime = Action.create(this, "informTime", (origin, currentTime?: number) => {
        if (origin == null) {
            this.informTime.publishTo({ to: "one", one: this.mainLink }, this.clock.getCurrentTime())
        } else if (currentTime != null && this.onServer) {
            this.changeTime.publishTo({ to: "one", one: origin }, this.clock.getCurrentTime() - currentTime)
        }
    })

    invert = Action.create(this, "invert", async (origin, stateTime?: number, id?: number) => {
        let currentTime = this.clock.getCurrentTime()
        if (origin == null) {
            //local
            id = Math.random()
            stateTime = currentTime
        } else {
            if (stateTime == null || id == null) {
                return
            }
            if (stateTime > currentTime) {
                const jumpBy = stateTime - currentTime
                if (this.onServer) {
                    await this.clock.wait(jumpBy)
                } else {
                    this.clock.jump(jumpBy)
                }
                currentTime = this.clock.getCurrentTime()
            }
        }
        if (this.smoothedRef.state != null && this.smoothedRef.time != null) {
            const deltaTime = currentTime - this.smoothedRef.time
            this.smoothedRef.state.value += this.smoothedRef.state.velocity * deltaTime
            this.smoothedRef.state.velocity = -this.smoothedRef.state.velocity
            this.smoothedRef.time = currentTime
        }
        this.universe.insert(
            {
                type: "invert",
                id,
            },
            currentTime,
            stateTime
        )
        this.invert.publishTo(origin == null ? { to: "all" } : { to: "all-except-one", except: origin }, stateTime, id)
    })

    getCurrentValue(smoothed: boolean): number {
        const realStateTime = this.clock.getCurrentTime()
        const entry = this.universe.history[this.universe.history.length - 1]
        this.universe.applyStateAt(this.realStateRef, entry, realStateTime)
        let value: number
        if (this.smoothedRef.state == null || this.smoothedRef.time == null) {
            this.smoothedRef.state = {
                value: this.realStateRef.value,
                velocity: this.realStateRef.directionInverted ? -velocity : velocity,
            }
            value = this.realStateRef.value
        } else {
            applySmoothing(this.smoothedRef.state, this.smoothedRef.time, this.realStateRef, realStateTime)
            value = smoothed ? this.smoothedRef.state.value : this.realStateRef.value
        }
        this.smoothedRef.time = realStateTime
        const abs = Math.abs(value)
        const backwards = Math.floor(abs) % 2 === 1
        return backwards ? 1 - (abs % 1) : abs % 1
    }

    onUnlink(link: StoreLink): void {}
    onLink(link: StoreLink): void {}
}

const velocity = 0.0001

type StateAction = {
    type: "init" | "invert"
    id: number
}

type SmoothState = {
    value: number
    velocity: number
}

class ContinousState implements State<StateAction> {
    constructor(public value: number, public directionInverted: boolean) {}

    update(
        base: this | undefined,
        deltaTime: number,
        action: StateAction | undefined,
        prevDeltaTime: number | undefined,
        prevBase: this | undefined
    ): void {
        if (action?.type === "init" || base == null) {
            return
        }
        if (
            action?.type == "invert" &&
            base.directionInverted === prevBase?.directionInverted &&
            base.value === prevBase?.value &&
            prevDeltaTime === deltaTime
        ) {
            return
        }
        this.value = base.value + deltaTime * (base.directionInverted ? -velocity : velocity)
        this.directionInverted = action == null ? base.directionInverted : !base.directionInverted
    }

    copyFrom(ref: this): void {
        this.directionInverted = ref.directionInverted
        this.value = ref.value
    }
}

function applySmoothing(
    smoothState: SmoothState,
    smoothStateTime: number,
    realState: ContinousState,
    realStateTime: number
): void {
    const deltaTime = realStateTime - smoothStateTime
    const velocityReal = realState.directionInverted ? -velocity : velocity
    const valueReal = realState.value
    const valueSmoothed = smoothState.value

    const vd = (velocityReal + (0.05 * (valueReal - valueSmoothed)) / deltaTime) / 1.05
    smoothState.velocity += limitAbs(vd - smoothState.velocity, velocity * deltaTime * 0.1)

    smoothState.value += smoothState.velocity * deltaTime
}

function limitAbs(value: number, limit: number): number {
    return Math.max(-limit, Math.min(limit, value))
}
```

[`consistent.tsx`](https://github.com/cocoss-org/co-share/blob/master/examples/pages/consistent.tsx)

```typescript
function ConsistentExamplePage({ rootStore }: { rootStore: RootStore }) {
    const store = useStoreSubscription(
        "consistent",
        1000,
        (time: number, value: number, directionInverted: boolean) =>
            new ConsistentStore(false, time, value, directionInverted),
        undefined,
        rootStore
    )

    const [smoothing, setSmoothing] = useState(true)

    const [{ marginLeft, time }, setState] = useState(() => ({
        marginLeft: calculateMargin(store.getCurrentValue(smoothing)),
        time: store.clock.getCurrentTime() / 1000,
    }))

    useEffect(() => {
        const ref = window.setInterval(() => {
            setState({
                time: store.clock.getCurrentTime() / 1000,
                marginLeft: calculateMargin(store.getCurrentValue(smoothing)),
            })
        }, 30)
        return () => window.clearInterval(ref)
    }, [store, smoothing])

    return (
        <div className="d-flex flex-column m-3">
            <div style={{ border: "1px solid" }}>
                <span>time: {time.toFixed(0)}</span>
                <div style={{ width: "3rem", height: "3rem", marginLeft, background: "#f00", borderRadius: "100%" }} />
            </div>
            <button className="align-self-start mt-2 btn btn-outline-primary" onClick={() => store.invert()}>
                invert
            </button>
            <div className="d-flex flex-row mt-2">
                <input
                    checked={smoothing}
                    onChange={(e) => setSmoothing(e.target.checked)}
                    className="form-check-input me-2"
                    type="checkbox"
                />
                <label className="form-check-label">Smooting</label>
            </div>
        </div>
    )
}

function calculateMargin(value: number): string {
    return `calc(${(100 * value).toFixed(3)}% - ${(3 * value).toFixed(3)}rem)`
}
```

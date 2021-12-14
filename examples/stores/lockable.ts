import { Action, Request, Store, StoreLink, Subscriber } from "co-share"
import { of } from "rxjs"
import { tap } from "rxjs/operators"
import create, { StoreApi } from "zustand/vanilla"

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

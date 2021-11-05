import { Store, Request, StoreLink, Subscriber } from "co-share"
import { NEVER, of } from "rxjs"

export class RequestStore extends Store {
    public onUnlink(link: StoreLink): void {}

    public onLink(link: StoreLink): void {}

    public subscriber: Subscriber<RequestStore, []> = Subscriber.create(RequestStore, (connection, accept, deny) =>
        accept()
    )

    add: Request<this, [number, number], number> = Request.create(this, "add", (origin, v1: number, v2: number) => {
        if (origin == null) {
            return this.add.publishTo(this.mainLink, v1, v2)
        }
        return Math.random() > 0.5 ? NEVER : of(v1 + v2)
    })
}

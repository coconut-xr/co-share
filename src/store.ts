import { Subject } from "rxjs"
import { filter, tap, takeUntil, finalize } from "rxjs/operators"
import { Connection, StoreLink, StoreLinkId, StoreMap } from "."
import { ActionIdentifier, Action } from "./action"
import { Subscriber } from "./subscriber"

export type PathEntry = string | number

export const LogAction = Action.createUnbound("log", function (origin, log: any) {
    console.log(this, origin, log)
})

export const UnsubscribeAction = Action.createUnbound("unsubscribe", (origin) => {
    if (origin == null) {
        throw "can't execute unsubscribe locally"
    }
    origin.close()
})

export abstract class Store {
    get mainLink(): StoreLink {
        if (this.linkSet.size === 1) {
            return this.linkSet.values().next().value
        }
        throw "unable to find exact one store link in the root store. If you have mutliple connections simulatenously, there is no 'main' link"
    }

    public readonly actionMap = new Map<ActionIdentifier, Action<Store, Array<any>>>()

    public abstract readonly subscriber: Subscriber<Store, Array<any>>

    log = LogAction.bindTo(this)
    unsubscribe = UnsubscribeAction.bindTo(this)

    public readonly linkSet = new Set<StoreLink>()

    /**
     * executed right after the link was deleted from the store's linkSet
     */
    public abstract onUnlink(link: StoreLink): void

    /**
     * executed right after the link was inserted into the store's linkSet
     */
    public abstract onLink(link: StoreLink): void

    link(id: StoreLinkId, connection: Connection): StoreLink {
        const onDisconnect = new Subject<void>()
        const storeLink: StoreLink = {
            id,
            connection,
            close: () => onDisconnect.next(),
            publish: (actionName, ...params) => connection.publish(id, actionName, ...params),
        }

        this.linkSet.add(storeLink)
        this.onLink(storeLink)

        connection
            .receive()
            .pipe(
                takeUntil(onDisconnect),
                filter(([_id]) => id === _id),
                tap(([, actionName, ...params]) => {
                    const action = this.actionMap.get(actionName)
                    if (action != null) {
                        try {
                            action.forwardFrom(storeLink, ...params)
                        } catch (error) {
                            this.log.publishTo(
                                { to: "one", one: storeLink },
                                `error occured when executing ${actionName}: ${error}`
                            )
                        }
                    } else {
                        this.log.publishTo({ to: "one", one: storeLink }, `unkown action ${actionName}`)
                    }
                }),
                finalize(() => {
                    this.linkSet.delete(storeLink)
                    this.onUnlink(storeLink)
                })
            )
            .subscribe()

        return storeLink
    }
}

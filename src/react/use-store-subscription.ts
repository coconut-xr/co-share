import { useLayoutEffect } from "react"
import { retryWhen, delay, map, tap } from "rxjs/operators"
import { clear, suspend } from "suspend-react"
import { StoreFactory, Store, StoreLink, PathEntry, UnsubscribeAction, RootStore, rootStore } from ".."

const useStoreSubscriptionSymbol = Symbol()

export function useStoreSubscription<S extends Store>(
    path: PathEntry,
    retryAfter: number,
    storeFactory: StoreFactory<S>,
    factoryDepends?: Array<any>,
    providedRootStore: RootStore = rootStore,
    rootStoreLink: StoreLink = providedRootStore.mainLink
): S {
    const ref = suspend(
        () =>
            providedRootStore
                .subscribe<S>(path, rootStoreLink, storeFactory)
                .pipe(
                    retryWhen((error) => error.pipe(/**tap(console.error),*/ delay(retryAfter))),
                    map(([store, storeLink]) => ({
                        store,
                        storeLink,
                        referenceCount: 0,
                    }))
                )
                .toPromise(),
        [retryAfter, path, providedRootStore, rootStoreLink, ...(factoryDepends ?? []), useStoreSubscriptionSymbol]
    )

    useLayoutEffect(() => {
        ref.referenceCount += 1
        return () => {
            ref.referenceCount -= 1
            if (ref.referenceCount === 0) {
                UnsubscribeAction.publishTo([ref.storeLink])
                providedRootStore.destroyStore(ref.store, path)
                clear([
                    retryAfter,
                    path,
                    providedRootStore,
                    rootStoreLink,
                    ...(factoryDepends ?? []),
                    useStoreSubscriptionSymbol,
                ])
            }
        }
    }, [ref])

    return ref.store
}

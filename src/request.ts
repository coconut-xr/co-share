import { EMPTY, merge, MonoTypeOperatorFunction, Observable, Subject, Subscription, throwError } from "rxjs"
import { catchError, filter, take, takeUntil, tap } from "rxjs/operators"
import { Store, UnboundAction } from "."
import { Action } from "./action"
import { StoreLink } from "./store-link"

export type RequestFunction<S extends Store, Params extends Array<any>, Result> = (
    this: S,
    origin: StoreLink | undefined,
    ...params: Params
) => Observable<Result>

export type Request<S extends Store, Params extends Array<any>, Result> = ((
    this: S,
    ...params: Params
) => Observable<Result>) & {
    publishTo(target: StoreLink, ...params: Params): Observable<Result>
    forwardFrom(origin: StoreLink, ...params: Params): Observable<Result>
}

export type UnboundRequest<S extends Store, Params extends Array<any>, Result> = {
    publishTo(target: StoreLink, ...params: Params): Observable<Result>
    forwardFrom(store: Store, origin: StoreLink, ...params: Params): Observable<Result>
    execute: RequestFunction<S, Params, Result>
    bindTo(store: S, overwrite?: boolean): Request<S, Params, Result>
}

function createUnboundRequest<S extends Store, Params extends Array<any>, Result>(
    identifier: string,
    execute: RequestFunction<S, Params, Result>,
    multipleResponses = false
): UnboundRequest<S, Params, Result> {
    const responseNextSubject = new Subject<[number, Result]>()
    const responseCompleteSubject = new Subject<number>()
    const responseErrorSubject = new Subject<[number, any]>()
    const cancelSubject = new Subject<number>()

    const responseNextActionName = `next_${identifier}`
    const responseErrorActionName = `error_${identifier}`
    const responseCompleteActionName = `complete_${identifier}`
    const requestActionName = `request_${identifier}`
    const cancelActionName = `cancel_${identifier}`

    const responseNextAction = Action.createUnbound<S, [number, Result]>(responseNextActionName, (origin, ...params) =>
        responseNextSubject.next(params)
    )
    const responseErrorAction = Action.createUnbound<S, [number, any]>(responseErrorActionName, (origin, ...params) =>
        responseErrorSubject.next(params)
    )
    const responseCompleteAction = Action.createUnbound<S, [number]>(responseCompleteActionName, (origin, id) =>
        responseCompleteSubject.next(id)
    )

    const forwardFrom: UnboundRequest<S, Params, Result>["forwardFrom"] = (catchFunction as any).bind(
        undefined,
        execute
    )

    const requestAction = Action.createUnbound<S, [number, ...Params]>(
        requestActionName,
        function (origin, id, ...params) {
            if (origin != null) {
                forwardFrom(this, origin, ...params)
                    .pipe(
                        takeOneOptional(!multipleResponses),
                        tap(
                            (next) => responseNextAction.publishTo([origin], id, next),
                            (error) => responseErrorAction.publishTo([origin], id, error),
                            () => {
                                if (multipleResponses) {
                                    responseCompleteAction.publishTo([origin], id)
                                }
                            }
                        ),
                        catchError(() => EMPTY),
                        takeUntil(cancelSubject.pipe(filter((reqId) => reqId === id)))
                    )
                    .subscribe()
            }
        }
    )
    const cancelAction = Action.createUnbound(cancelActionName, (origin, id) => cancelSubject.next(id))

    const publishTo = (target: StoreLink, ...params: Params) =>
        new Observable<Result>((subscriber) => {
            const id = Math.round(Math.random() * Number.MAX_SAFE_INTEGER)
            const filterId = filter<[number, any]>(([observableId]) => observableId === id)
            let hasEnded = false
            const subscription = new Subscription()

            subscription.add(
                responseNextSubject
                    .pipe(
                        filterId,
                        tap(([observableId, next]) => {
                            if (multipleResponses) {
                                subscriber.next(next)
                            } else {
                                hasEnded = true
                                subscriber.next(next)
                                subscriber.complete()
                            }
                        }),
                        takeOneOptional(!multipleResponses)
                    )
                    .subscribe()
            )

            subscription.add(
                responseErrorSubject
                    .pipe(
                        filterId,
                        tap(([observableId, error]) => {
                            hasEnded = true
                            subscriber.error(error)
                        })
                    )
                    .subscribe()
            )

            subscription.add(
                responseCompleteSubject
                    .pipe(
                        filter((observableId) => observableId === id),
                        tap(() => {
                            hasEnded = true
                            subscriber.complete()
                        })
                    )
                    .subscribe()
            )
            requestAction.publishTo([target], id, ...params)
            return () => {
                subscription.unsubscribe()
                if (!hasEnded) {
                    cancelAction.publishTo([target], id)
                }
            }
        })

    return {
        execute,
        forwardFrom,
        publishTo,
        bindTo: (bindRequest as any).bind(
            undefined,
            execute,
            publishTo,
            forwardFrom,
            responseNextAction,
            responseErrorAction,
            responseCompleteAction,
            requestAction,
            cancelAction
        ),
    }
}

const createRequest = <S extends Store, Params extends Array<any>, Result>(
    store: S,
    identifier: string,
    execute: RequestFunction<S, Params, Result>,
    multipleResponses = false,
    overwrite = false
): Request<S, Params, Result> => createUnboundRequest(identifier, execute, multipleResponses).bindTo(store, overwrite)

function bindRequest<S extends Store, Params extends Array<any>, Result>(
    execute: RequestFunction<S, Params, Result>,
    publishTo: (target: StoreLink, ...params: Params) => Observable<Result>,
    forwardFrom: (store: Store, origin: StoreLink, ...params: Params) => Observable<Result>,
    responseNextAction: UnboundAction<S, [number, Result]>,
    responseErrorAction: UnboundAction<S, [number, any]>,
    responseCompleteAction: UnboundAction<S, [number]>,
    requestAction: UnboundAction<S, [number, ...Params]>,
    cancelAction: UnboundAction<Store, [number]>,
    store: S,
    overwrite = false
): Request<S, Params, Result> {
    responseNextAction.bindTo(store, overwrite)
    responseErrorAction.bindTo(store, overwrite)
    responseCompleteAction.bindTo(store, overwrite)
    requestAction.bindTo(store, overwrite)
    cancelAction.bindTo(store, overwrite)
    return Object.assign(execute.bind(store, undefined), {
        publishTo,
        forwardFrom: forwardFrom.bind(undefined, store),
    })
}

export const Request = {
    create: createRequest,
    createUnbound: createUnboundRequest,
}

export function catchFunction<S extends Store, Params extends Array<any>, Result>(
    fn: RequestFunction<S, Params, Result>,
    store: S,
    origin: StoreLink | undefined,
    ...params: Params
): Observable<Result> {
    try {
        return fn.apply(store, [origin, ...params])
    } catch (error) {
        return throwError(error)
    }
}

export function takeOneOptional<T>(takeOne: boolean): MonoTypeOperatorFunction<T> {
    if (takeOne) {
        return take(1)
    } else {
        return (val: Observable<T>) => val
    }
}

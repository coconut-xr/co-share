import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { Connection, createRootStore, RootStore, RootStoreDefaultLinkId } from "co-share"
import { ServerStub, SimulatedConnection } from "../server-stub"

const ids = ["Alice", "Bob"]

//TODO: add any ammount of users
//TODO: enable log viewing from the server perspective

export function Simulator({
    children,
    initStores,
    twoClients,
    defaultIncommingLatency,
    defaultOutgoingLatency,
    defaultNetworkSettingsCollapsed,
}: {
    initStores: (rootStore: RootStore) => void
    twoClients?: boolean
    defaultIncommingLatency?: number
    defaultOutgoingLatency?: number
    defaultNetworkSettingsCollapsed?: boolean
    children: (rootStore: RootStore) => JSX.Element
}): JSX.Element | null {
    const serverStub = useMemo(() => {
        const rootStore = createRootStore()
        initStores(rootStore)
        return new ServerStub(rootStore, false)
    }, [initStores, twoClients])

    if (!twoClients) {
        return <SimpleConnectionHandler children={children} id={"test"} serverStub={serverStub} />
    }

    return (
        <>
            {ids.map((id) => (
                <ConnectionHandler
                    defaultNetworkSettingsCollapsed={defaultNetworkSettingsCollapsed}
                    defaultOutgoingLatency={defaultOutgoingLatency}
                    defaultIncommingLatency={defaultIncommingLatency}
                    key={id}
                    children={children}
                    id={id}
                    serverStub={serverStub}
                />
            ))}
        </>
    )
}

function SimpleConnectionHandler({
    id,
    serverStub,
    children,
}: {
    id: string
    serverStub: ServerStub
    children: (rootStore: RootStore) => JSX.Element
}) {
    const [connection, setConnection] = useState<SimulatedConnection | undefined>(undefined)
    useEffect(() => {
        let cancelled = false
        serverStub.createConnection(id, 0, 0).then((establishedConnection) => {
            if (!cancelled) {
                setConnection(establishedConnection)
            }
        })
        return () => {
            cancelled = false
        }
    }, [serverStub, id])
    return (
        <div className="d-flex flex-column flex-grow-1 flex-basis-0 m-3 flex-shrink-1">
            <div className="flex-grow-1 flex-basis-0 border border-2 rounded-3">
                {connection == null ? "Not Conncted" : <View connection={connection} children={children} />}
            </div>
        </div>
    )
}

function ConnectionHandler({
    id,
    children,
    serverStub,
    defaultIncommingLatency,
    defaultOutgoingLatency,
    defaultNetworkSettingsCollapsed,
}: {
    defaultIncommingLatency?: number
    defaultOutgoingLatency?: number
    defaultNetworkSettingsCollapsed?: boolean
    serverStub: ServerStub
    id: string
    children: (rootStore: RootStore) => JSX.Element
}): JSX.Element {
    const [connection, setConnection] = useState<SimulatedConnection | undefined>(undefined)

    const [incommingLatency, setIncommingLatency] = useState(defaultIncommingLatency ?? 0)
    const [outgoingLatency, setOutgoingLatency] = useState(defaultOutgoingLatency ?? 0)
    const [randomizeIncommingLatency, setRandomizeIncommingLatency] = useState(false)
    const [randomizeOutgoingLatency, setRandomizeOutgoingLatency] = useState(false)
    const [networkSettingsCollapsed, setNetworkSettingsCollapsed] = useState(defaultNetworkSettingsCollapsed ?? true)

    useEffect(() => {
        if (randomizeIncommingLatency) {
            const ref = setInterval(() => setIncommingLatency(Math.floor(Math.random() * 500)), 200)
            return () => clearInterval(ref)
        }
    }, [randomizeIncommingLatency])

    useEffect(() => {
        if (randomizeOutgoingLatency) {
            const ref = setInterval(() => setOutgoingLatency(Math.floor(Math.random() * 500)), 200)
            return () => clearInterval(ref)
        }
    }, [randomizeOutgoingLatency])

    useEffect(() => {
        if (connection != null) {
            connection.incommingLatency = incommingLatency
            connection.outgoingLatency = outgoingLatency
        }
    }, [connection, incommingLatency, outgoingLatency])

    const [connected, setConnected] = useState(true)

    const toggleConnected = useCallback(() => setConnected((connected) => !connected), [])

    useEffect(
        () => () => {
            if (connection != null) {
                connection.disconnect()
            }
        },
        [connection]
    )

    useEffect(() => {
        if (connected) {
            let cancelled = false
            serverStub.createConnection(id, incommingLatency, outgoingLatency).then((establishedConnection) => {
                if (!cancelled) {
                    setConnection(establishedConnection)
                }
            })
            return () => {
                cancelled = true
            }
        } else {
            setConnection(undefined)
        }
    }, [id, serverStub, connected])

    return (
        <div className="d-flex flex-column flex-grow-1 flex-basis-0 m-3 flex-shrink-1">
            <div className="d-flex flex-row my-3 align-items-center">
                <h6 className="mb-0">{id}</h6>
                <button onClick={toggleConnected} className="ms-3 btn btn-sm btn-outline-secondary">
                    {connected ? "disconnect" : "connect"}
                </button>
            </div>
            <button
                onClick={() => setNetworkSettingsCollapsed(!networkSettingsCollapsed)}
                className={`border accordion-button mb-3 ${networkSettingsCollapsed ? "collapsed" : ""}`}
                type="button">
                Network Settings
            </button>
            <div className={`accordion-collapse ${networkSettingsCollapsed ? "collapse" : ""}`}>
                <div className="mb-3 d-flex flex-row align-items-start">
                    <label className="col-sm-4 col-form-label me-2 text-nowrap">Incomming Latency</label>
                    <div className="d-flex flex-column flex-grow-1">
                        <input
                            className="form-control"
                            type="number"
                            disabled={randomizeIncommingLatency}
                            onChange={(e) => setIncommingLatency(e.target.valueAsNumber)}
                            value={incommingLatency}
                        />
                        <div className="d-flex flex-row mt-2">
                            <input
                                checked={randomizeIncommingLatency}
                                onChange={(e) => setRandomizeIncommingLatency(e.target.checked)}
                                className="form-check-input me-2"
                                type="checkbox"
                            />
                            <label className="form-check-label">Randomize</label>
                        </div>
                    </div>
                </div>
                <div className="mb-3 d-flex flex-row align-items-start">
                    <label className="col-sm-4 col-form-label me-2 text-nowrap">Outgoing Latency</label>
                    <div className="d-flex flex-column flex-grow-1">
                        <input
                            className="form-control"
                            type="number"
                            disabled={randomizeOutgoingLatency}
                            onChange={(e) => setOutgoingLatency(e.target.valueAsNumber)}
                            value={outgoingLatency}
                        />
                        <div className="d-flex flex-row mt-2">
                            <input
                                checked={randomizeOutgoingLatency}
                                onChange={(e) => setRandomizeOutgoingLatency(e.target.checked)}
                                className="form-check-input me-2"
                                type="checkbox"
                            />
                            <label className="form-check-label">Randomize</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-basis-0 border border-2 rounded-3">
                {connection == null ? (
                    connected ? (
                        "Connecting ..."
                    ) : (
                        "Not Conncted"
                    )
                ) : (
                    <View connection={connection} children={children} />
                )}
            </div>
        </div>
    )
}

export function View({
    children,
    connection,
}: {
    connection: Connection
    children: (rootStore: RootStore) => JSX.Element
}): JSX.Element {
    const rootStore = useMemo(() => {
        const rootStore = createRootStore()
        rootStore.link(RootStoreDefaultLinkId, connection)
        return rootStore
    }, [connection])

    return <Suspense fallback={"loading ..."}>{children(rootStore)}</Suspense>
}

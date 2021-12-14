import React, { useEffect, useState } from "react"
import { useStoreSubscription } from "co-share/react"
import { Simulator } from "../components/simulator"
import { Header } from "../components/header"
import MD from "../content/consistent.md"
import { Footer } from "../components/footer"
import { RootStore } from "co-share"
import { ConsistentStore } from "../stores/consistent"

export default function Index() {
    return (
        <div className="d-flex flex-column fullscreen">
            <Header selectedIndex={7} />
            <div className="d-flex flex-column justify-content-stretch container-lg">
                <div className="d-flex flex-row-responsive">
                    <Simulator
                        defaultIncommingLatency={500}
                        defaultOutgoingLatency={500}
                        defaultNetworkSettingsCollapsed={false}
                        twoClients
                        initStores={(rootStore) =>
                            rootStore.addStore(new ConsistentStore(true, 0, 0, false), "consistent")
                        }>
                        {(rootStore) => <ConsistentExamplePage rootStore={rootStore} />}
                    </Simulator>
                </div>
                <div className="p-3 flex-basis-0 flex-grow-1">
                    <MD />
                </div>
            </div>
            <Footer />
        </div>
    )
}

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

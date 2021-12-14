import { useStoreSubscription } from "co-share/react"
import React, { useEffect, useMemo, useRef } from "react"
import create from "zustand"
import { RootStore } from "co-share"
import { MessagesStore } from "../stores/message"
import { Simulator } from "../components/simulator"
import { Header } from "../components/header"
import MD from "../content/message.md"
import { Footer } from "../components/footer"

export default function Index(): JSX.Element {
    return (
        <div className="d-flex flex-column fullscreen">
            <Header selectedIndex={2} />
            <div className="d-flex flex-column justify-content-stretch container-lg">
                <div className="d-flex flex-row-responsive">
                    <Simulator
                        twoClients
                        initStores={(rootStore) => rootStore.addStore(new MessagesStore([]), "messages")}>
                        {(rootStore) => <MessagesSamplePage rootStore={rootStore} />}
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

export function MessagesSamplePage({ rootStore }: { rootStore: RootStore }): JSX.Element {
    const store = useStoreSubscription(
        "messages",
        1000,
        (clients: Array<string>) => new MessagesStore(clients),
        undefined,
        rootStore
    )

    const id = useMemo(() => rootStore.mainLink.connection.userData.id, [rootStore])
    const useStoreState = useMemo(
        () =>
            create<{
                clients: string[]
                messages: {
                    senderId: string
                    message: string
                }[]
            }>(store.state),
        [store]
    )

    const messages = useStoreState((store) => store.messages)
    const clients = useStoreState((store) => store.clients)

    return (
        <div className="p-3">
            <h5>Clients {store.mainLink.id}</h5>
            {clients.map((client) => (
                <Client sendMessage={store.sendMessage.bind(store, id)} client={client} key={client} />
            ))}
            <h5 className="mt-3">Messages</h5>
            <div>
                {messages.map(({ message, senderId }, index) => (
                    <div key={index}>
                        From {senderId}: <span className="h6">{message}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function Client({
    sendMessage,
    client,
}: {
    client: string
    sendMessage: (receiverId: string, message: string) => void
}): JSX.Element {
    const inputRef = useRef<HTMLInputElement>(null)
    return (
        <div>
            <span>{client}</span>

            <div className="input-group mb-3">
                <input
                    ref={inputRef}
                    style={{ flexGrow: 1 }}
                    type="text"
                    className="form-control"
                    placeholder="Message"
                />
                <div className="input-group-append">
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => {
                            if (inputRef.current != null) {
                                sendMessage(client, inputRef.current.value)
                                inputRef.current.value = ""
                            }
                        }}
                        type="button">
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}

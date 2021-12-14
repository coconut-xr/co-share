# Message Example

Write messages directly from client to client without any persistent storage in between.  
We use a `send-message` **Action**, which the server re-routs to the target client. 

# Source Code

[`message.ts`](https://github.com/cocoss-org/co-share/blob/master/examples/stores/message.ts)

```typescript
export class MessagesStore extends Store {
    public state: StoreApi<{ clients: Array<string>; messages: Array<{ senderId: string; message: string }> }>

    public subscriber: Subscriber<MessagesStore, [Array<string>]> = Subscriber.create(
        MessagesStore,
        (connection, accept, deny) => {
            this.addClient(connection.userData.id)
            accept(this.state.getState().clients.filter((id) => id != connection.userData.id))
        }
    )

    public sendMessage = Action.create(
        this,
        "send-message",
        (origin, senderId: string, receiverId: string, message: string) => {
            //the following routing algorithm assumes a star topology
            if (origin == null) {
                this.sendMessage.publishTo({ to: "one", one: this.mainLink }, senderId, receiverId, message)
            } else if (origin.connection.userData.id === senderId) {
                const link = Array.from(this.linkSet).find((link) => link.connection.userData.id === receiverId)
                if (link == null) {
                    throw `unable to find connection with receiver id ${receiverId}`
                }
                this.sendMessage.publishTo({ to: "one", one: link }, senderId, receiverId, message)
            } else {
                this.state.setState({
                    messages: [...this.state.getState().messages, { message, senderId }],
                })
            }
        }
    )

    constructor(clients: Array<string>) {
        super()
        this.state = create<{ clients: Array<string>; messages: Array<{ senderId: string; message: string }> }>(() => ({
            messages: [],
            clients,
        }))
    }

    public onLink(link: StoreLink): void {}

    private addClient = Action.create(this, "addClient", (origin, clientInfo: string) => {
        this.state.setState({
            clients: [...this.state.getState().clients, clientInfo],
        })
        this.addClient.publishTo(origin == null ? { to: "all" } : { to: "all-except-one", except: origin }, clientInfo)
    })

    private removeClient = Action.create(this, "removeClient", (origin, clientId: string) => {
        this.state.setState({
            clients: this.state.getState().clients.filter((id) => id !== clientId),
        })
        this.removeClient.publishTo(origin == null ? { to: "all" } : { to: "all-except-one", except: origin }, clientId)
    })

    public onUnlink(link: StoreLink): void {
        this.removeClient(link.connection.userData.id)
    }
}
```

[`message.tsx`](https://github.com/cocoss-org/co-share/blob/master/examples/pages/message.tsx)

```typescript
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
```

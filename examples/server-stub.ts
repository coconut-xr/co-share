import {
    ActionIdentifier,
    Connection,
    ConnectionMessage,
    RootStore,
    RootStoreDefaultLinkId,
    StoreLinkId,
} from "co-share"
import { Observable, Subject } from "rxjs"

export class ServerStub {
    constructor(private readonly rootStore: RootStore, private readonly log: boolean) {}

    async createConnection(
        id: string,
        incommingLatency: number,
        outgoingLatency: number
    ): Promise<SimulatedConnection> {
        await wait(outgoingLatency)
        const clientToServerSubject = new Subject<ConnectionMessage>()
        if (this.log) {
            clientToServerSubject.subscribe((msg) => console.log(`client ${id} to server:`, ...msg))
            //serverToClientSubject.subscribe((msg) => console.log(`server to client ${id}:`, ...msg))
        }

        const clientConnection = new SimulatedConnection(id, clientToServerSubject)
        const serverConnection: Connection = {
            userData: {
                id,
            },
            disconnect: () => clientConnection.serverDisconnected(),
            publish: (...message) => clientConnection.sendToClient(JSON.parse(JSON.stringify(message))),
            receive: () => clientToServerSubject,
        }
        if (this.log) {
            console.log(`client ${id} connected to server`)
        }
        this.rootStore.link(RootStoreDefaultLinkId, serverConnection)
        await wait(incommingLatency)
        return clientConnection
    }
}

export class SimulatedConnection implements Connection {
    userData: { id: string }

    public incommingLatency = 0
    public outgoingLatency = 0

    private receiveSubject = new Subject<ConnectionMessage>()

    constructor(id: string, private readonly clientToServerSubject: Subject<ConnectionMessage>) {
        this.userData = { id }
    }

    publish(id: StoreLinkId, actionIdentifier: ActionIdentifier, ...params: any[]): void {
        setTimeout(() => this.clientToServerSubject.next(JSON.parse(JSON.stringify([id, actionIdentifier, ...params]))), this.outgoingLatency)
    }

    sendToClient(message: ConnectionMessage): void {
        setTimeout(() => this.receiveSubject.next(message), this.incommingLatency)
    }

    receive(): Observable<ConnectionMessage> {
        return this.receiveSubject
    }

    disconnect(): void {
        this.receiveSubject.complete()
        setTimeout(() => {
            /*if (this.log) {
                console.log(`client ${id} is now disconnected from the server`)
            }*/
            this.clientToServerSubject.complete()
        }, this.outgoingLatency)
    }

    serverDisconnected(): void {
        this.clientToServerSubject.complete()
        setTimeout(() => {
            /*if (this.log) {
                console.log(`client ${id} is now disconnected from the server`)
            }*/
            this.receiveSubject.complete()
        }, this.incommingLatency)
    }
}

function wait(time: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, time))
}

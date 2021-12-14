import React, { Suspense, useMemo, useRef, useState } from "react"
import { RootStore } from "co-share"
import { Group, GroupChatListStore, GroupChatStore, Message } from "../stores/group-chat"
import create from "zustand"
import { Simulator } from "../components/simulator"
import { Header } from "../components/header"
import MD from "../content/group-chat.md"
import { Footer } from "../components/footer"
import { useStoreSubscription } from "co-share/react"

export default function Index() {
    return (
        <div className="d-flex flex-column fullscreen">
            <Header selectedIndex={3} />
            <div className="d-flex flex-column justify-content-stretch container-lg">
                <div className="d-flex flex-row-responsive">
                    <Simulator
                        initStores={(rootStore) =>
                            rootStore.addStore(new GroupChatListStore(rootStore, []), "group-chat-list")
                        }>
                        {(rootStore) => <GroupChatExamplePage rootStore={rootStore} />}
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

export function GroupChatExamplePage({ rootStore }: { rootStore: RootStore }) {
    const store = useStoreSubscription(
        "group-chat-list",
        1000,
        (groups: Array<Group>) => new GroupChatListStore(rootStore, groups),
        undefined,
        rootStore
    )

    const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(undefined)
    const inputRef = useRef<HTMLInputElement>(null)

    const useStoreState = useMemo(
        () =>
            create<{
                groups: Group[]
            }>(store.state),
        [store]
    )

    const { groups } = useStoreState()
    const groupId = useMemo(
        () =>
            selectedGroupId != null && groups.find((group) => group.id === selectedGroupId) != null
                ? selectedGroupId
                : groups.length > 0
                ? groups[0].id
                : undefined,
        [groups, selectedGroupId]
    )

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "stretch",
                justifyContent: "stretch",
                flexGrow: 1,
            }}
            className="p-3">
            <div style={{ maxWidth: 300, width: "100%" }}>
                <h1>Groups</h1>
                <div className="input-group mb-3">
                    <input
                        ref={inputRef}
                        style={{ flexGrow: 1 }}
                        type="text"
                        className="form-control"
                        placeholder="Group Name"
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => {
                                if (inputRef.current != null && inputRef.current.value.length > 0) {
                                    store.createGroup(inputRef.current.value).subscribe()
                                }
                            }}
                            type="button">
                            Create
                        </button>
                    </div>
                </div>
                {groups.map((group) => (
                    <div
                        className="d-flex align-items-center justify-content-between"
                        key={group.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedGroupId(group.id)}>
                        <span className={groupId === group.id ? "fw-bold" : ""}>{group.name}</span>
                        <button className="btn btn-outline-danger" onClick={() => store.deleteGroup(group.id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
            <div style={{ flexGrow: 1, display: "flex", alignItems: "stretch", justifyContent: "stretch" }}>
                {groupId == null ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
                        Create a Group
                    </div>
                ) : (
                    <Suspense fallback={<span>Loading ...</span>}>
                        <GroupChat groupId={groupId} rootStore={rootStore} />
                    </Suspense>
                )}
            </div>
        </div>
    )
}

function GroupChat({ rootStore, groupId }: { groupId: string; rootStore: RootStore }) {
    const groupChatStore = useStoreSubscription(
        groupId,
        1000,
        (messages: Array<Message>, ownId: string | undefined) => new GroupChatStore(messages, ownId),
        undefined,
        rootStore
    )

    //buggy: guess: suspense will not unmount this component and thus the api is not resubscribed
    const useStoreState = useMemo(() => create<{ messages: Message[] }>(groupChatStore.state), [groupChatStore])
    const { messages } = useStoreState()

    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
            {messages.map((message, index) => (
                <p key={index}>
                    <strong>{message.sender}</strong>: {message.text}
                </p>
            ))}
            <div style={{ flexGrow: 1 }}></div>
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
                            if (inputRef.current != null && inputRef.current.value.length > 0) {
                                groupChatStore.sendMessage(inputRef.current.value)
                            }
                        }}
                        type="button">
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}

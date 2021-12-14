# co-share

[![Build Status](https://img.shields.io/github/workflow/status/cocoss-org/co-share/Depolyment)](https://github.com/cocoss-org/co-share/actions)&nbsp;
[![Npm package version](https://badgen.net/npm/v/co-share)](https://npmjs.com/package/co-share)&nbsp;
[![GitHub license](https://img.shields.io/github/license/cocoss-org/co-share.svg)](https://github.com/cocoss-org/co-share/blob/master/LICENSE)&nbsp;
[![Twitter](https://badgen.net/badge/icon/twitter?icon=twitter&label)](https://twitter.com/BelaBohlender)

Javascript framework for easily building shared applications such as chats and games

![Transformable Example](transformable-example.gif)

_A shared 3D Cube with "Alice" and "Bob" as **simulated** users.  
The [Example](https://cocoss-org.github.io/co-share/transformable/) was built with `co-share` and [react-three-fiber](https://github.com/pmndrs/react-three-fiber)_

`npm i co-share`

## **When to use**

Building **multiuser applications for the web** is often challenging as asynchronous communication can drastically increase the system complexity.
Writing **robust and performant shared applications** requires a structured and fitting architecture.

We propose the abstraction of **shared stores** to distribute logic and data between participating systems.
By using Javascript & Node.js, the same code can be used on the client and the server to carry out the **platform-independent communication**.

## [**Tutorial**](https://cocoss-org.github.io/co-share/counter)

We will build a globally synchronized counter and display it using `react`. Every client can increase the counter.

![Counter Example](counter-example.gif)

Above, you can see a local simulation with the clients "Alice" and "Bob". Even though we can simulate the communication locally, this library is meant for **networked communication** using WebSocket or WebRTC.

## [**Examples**](https://cocoss-org.github.io/co-share)

_The code for each example can be found on the respective pages_

### Simulated locally in your browser

-   [Request](https://cocoss-org.github.io/co-share/request) - request response paradigma
<!-- * [Group Chat](https://cocoss-org.github.io/co-share/group-chat) - a whatsapp like chat implementation -->
-   [Message](https://cocoss-org.github.io/co-share/message) - direct client to client messaging without any persistent storage in between
-   [Lockable](https://cocoss-org.github.io/co-share/lockable) - advanced lock functionality to prevent editing by multiple people simultaneously
-   [Optimistic Lockable](https://cocoss-org.github.io/co-share/optimistic-lockable) - performance optimize lockable that allows for optimistic behaviour and error correction
-   [Whiteboard](https://cocoss-org.github.io/co-share/whiteboard) - collaborative drawing on a shared whiteboard
-   [Transformable](https://cocoss-org.github.io/co-share/transformable) - shared 3D transformation
-   [Consistent](https://cocoss-org.github.io/co-share/consistent) - continous states with **client-side prediction**, **lag-compensation** and **smoothing** (using [co-consistent](https://github.com/cocoss-org/co-consistent))

### An extra Project with a server/client architecture using SocketIO

-   [Networked Counter using SocketIO](https://github.com/cocoss-org/co-share-socketio-counter-example) - just like the counter from the tutorial but with a server/client architecture using SocketIO

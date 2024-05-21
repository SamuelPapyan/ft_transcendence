class PongClient {
    constructor(client) {
        this.client = client;
        this.onGame = false;
        this.user = "";
    }

    onOpen(event) {
        this._socket.send(JSON.stringify({
            "method": "connect",
            "user": this.user
        }))
    }

    async start(receive_func, disconnect_func, username) {
        console.log("start pong");
        this.user = username;
        let url = `ws://localhost:8000/pong`;

        this._socket = new WebSocket(url);

        this.searching = true;

        this.receive_func = receive_func;
        this.disconnect_func = disconnect_func;

        this._socket.onopen = this.onOpen.bind(this);

        this._socket.onmessage = function(event) {
            receive_func(event.data);
        }

        this._socket.onclose = this.onclose.bind(this);
        window.addEventListener('beforeunload', this.clientLeave.bind(this));
    }

    sendMove(movement) {
        this._socket.send(JSON.stringify({
            "method": "move",
            "user": this.user,
            "movement": movement
        }))
    }

    sendGame(userN1) {
        if (this.user == userN1)
            this._socket.send(JSON.stringify({
                "method": "game",
                "user": this.user
            }))
    }

    onclose(event) {
        console.log(this.user, "closing with event handler")
        console.log(event);
        this.stop();
        this.disconnect_func(event);
    }

    clientLeave() {
        console.log(this.user, "pong client leaving");
        this._socket.send(JSON.stringify({
            "method": "disconnect",
            "user": this.user
        }));
    }

    stop(){
        console.log(this.user, "pong client stopping");
        if (this._socket)
            this._socket.close()
        this._socket = undefined;
        this.onGame = false;
    }
}

export {PongClient}
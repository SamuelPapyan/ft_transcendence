class MatchMakingClient {
    constructor(client) {
        this.client = client;
        this.searching = false;
        this.user = "";
    }

    onOpen(event) {
        this._socket.send(JSON.stringify({
            "method": "connect",
            "user": this.user
        }));
    }

    async start(receive_func, disconnect_func, username) {
        this.user = username;
        let url = `ws://10.19.203.198:8000/matchmaking`;

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

    onclose(event) {
        this.stop();
        this.disconnect_func(event);
    }

    clientLeave(){
        if (this._socket) {
            this._socket.send(JSON.stringify({
                "method": "disconnect",
                "user": this.user
            }));
        }
    }

    addToMatch() {
        if (this._socket) {
            this._socket.send(JSON.stringify({
                "method": "add",
                "user": this.user,
            }))
        }
    }

    stop(){
        if (this._socket)
            this._socket.close()
        this._socket = undefined;
        this.searching = false;
    }
}

export {MatchMakingClient}
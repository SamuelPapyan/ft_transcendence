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
        this.user = username;
        let url = `ws://10.19.203.198:8000/pong`;

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

    createNextMatch(nextUser) {
        this._socket.send(JSON.stringify({
            "method": "next",
            "user": this.user,
            "next_user": nextUser,
        }))
    }

    sendGame(userN1) {
        this._socket.send(JSON.stringify({
            "method": "game",
            "user": this.user
        }))
    }

    onclose(event) {
        this.stop();
        this.disconnect_func(event);
    }

    clientLeave() {
        this._socket.send(JSON.stringify({
            "method": "disconnect",
            "user": this.user
        }));
    }

    stop(){
        if (this._socket)
            this._socket.close()
        this._socket = undefined;
        this.onGame = false;
    }
}

export {PongClient}
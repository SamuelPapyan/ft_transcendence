import AbstractComponent from "./AbstractComponent.js";

export default class Matchmaking extends AbstractComponent {
    constructor() {
        super();
        this.socket = null;
        this.player2 = "??????";
    }

    beforeUnload(){
        console.log(this.user.username);
        this.socket.send(JSON.stringify({
            method: "close",
            user: this.user.username
        }));
    }

    socketOnOpen(e) {
        this.socket.send(JSON.stringify({
            method: 'connect',
            user: this.user.username,
        }));
    }

    socketOnMessage(e) {
        try {
            console.log(e);
            console.log(JSON.parse(e.data));
        } catch (err) {
            console.log(err.message);
        }
    }

    searchingForUser() {
        this.socket = new WebSocket('ws://127.0.0.1:8000/ws')
        this.socket.onopen = this.socketOnOpen.bind(this);
        this.socket.onmessage = this.socketOnMessage.bind(this);
        window.addEventListener('beforeunload', this.beforeUnload.bind(this));
    }

    activateEventHandlers() {
        this.searchingForUser();
    }

    getHtml() {
        return `
        <div class="d-flex justify-content-center">
            <div class="w-75 rounded border border-success">
                <h2 class="text-success text-center">ENDO Pong Battle</h2>
                <div class="d-flex justify-content-evenly align-items-center">
                    <div>
                        <div class="d-flex justify-content-center">
                            <img class="w-50 rounded-circle" src="/static/imgs/avatar_default.png" alt=""/>
                        </div>
                        <h3 class="text-success text-center">${this.user.username}</h3>
                    </div>
                    <h3 class="text-light">VS</h3>
                    <div>
                        <div class="d-flex justify-content-center">
                            <img class="w-50 rounded-circle" src="/static/imgs/avatar_default.png" alt=""/>
                        </div>
                        <h3 class="text-success text-center">${this.player2}</h3>
                    </div>
                </div>
                <p class="text-center text-light">Waiting for a second player...</p>
            </div>
        </div>
        `
    }
}
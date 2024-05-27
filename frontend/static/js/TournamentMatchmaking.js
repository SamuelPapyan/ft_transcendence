import AbstractComponent from "./AbstractComponent.js";
import { handleLocation } from "./index.js";

export default class TournamentMatchmaking extends AbstractComponent{
    constructor(){
        super();
        this.players = [];
        this.message = null;
        this.countdown = null;
        this.interval = null;
        this.socket = null;
    }

    beforeUnload() {
        this.socket.send(JSON.stringify({
            method: "disconnect",
            user: this.user.username,
        }))
    }

    intervalPredicator(){
        const num = +this.countdown.innerText;
        this.countdown.innerText = (num - 1);
        if (num - 1 == 0) {
            if (this.user.username === this.players[3]) {
                this.socket.send(JSON.stringify({
                    "method": "start",
                    "user": this.user.username,
                }))
            }
        }
    }

    redirectToPong() {
        clearInterval(this.interval);
        window.history.pushState(null, null, '/pong')
        handleLocation();
    }

    startGame() {
        this.message.innerText = "Tournament starts on "
        this.countdown.innerText = "5";
        this.interval = setInterval(this.intervalPredicator.bind(this), 1000);
    }

    endGame() {
        this.message.innerText = "Waiting for the rest of players..."
        this.countdown.innerText = "";
        clearInterval(this.interval);
    }

    async searchingForUsers() {
        this.socket = new WebSocket('ws://localhost:8000/matchmaking/tournament')
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onDisconnect.bind(this);
        window.addEventListener('beforeunload', this.beforeUnload.bind(this))
    }

    onOpen(event) {
        this.socket.send(JSON.stringify({
            "method": 'connect',
            "user": this.user.username
        }))
    }

    onMessage(event) {
        const res = JSON.parse(event.data);
        this.players = res.members;
        [...document.querySelectorAll('.player-label')].forEach((v, i)=>{
            if (i < res.members.length)
                v.innerText = res.members[i];
            else
                v.innerText = "??????";
        });
        [...document.querySelectorAll('.user-image')].forEach((v, i)=>{
            if (i < res.members.length)
                v.src = `data:image/png;base64,${res.avatars[i]}`
            else
                v.src = "/static/imgs/avatar_default.png";
        })
        if (res.method === 'connect') {
            if (res.members.length == 4) {
                this.startGame();
            }
        } else if (res.method === 'start') {
            this.redirectToPong()
        }
        else {
            this.endGame();
        }
    }

    onDisconnect(event) {
        // console.log("Disconnecting from Tournament");
    }

    activateEventHandlers() {
        this.message = document.getElementById('message');
        this.countdown = document.getElementById('countdown');
        this.searchingForUsers();
    }

    getHtml() {
        return `
        <div class="d-flex justify-content-center">
            <div class="w-75 rounded border border-success">
                <h2 class="text-success text-center">ENDO Pong Battle</h2>
                <div class="d-flex justify-content-evenly align-items-center">
                    <div>
                        <div class="d-flex justify-content-center">
                            <img class="w-50 rounded-circle user-image" src="/static/imgs/avatar_default.png" alt=""/>
                        </div>
                        <h3 class="player-label text-success text-center">??????</h3>
                    </div>
                    <h3 class="text-light">VS</h3>
                    <div>
                        <div class="d-flex justify-content-center">
                            <img class="w-50 rounded-circle user-image" src="/static/imgs/avatar_default.png" alt=""/>
                        </div>
                        <h3 class="player-label text-success text-center">??????</h3>
                    </div>
                </div>
                <div class="d-flex justify-content-evenly align-items-center">
                    <div>
                        <div class="d-flex justify-content-center">
                            <img class="w-50 rounded-circle user-image" src="/static/imgs/avatar_default.png" alt=""/>
                        </div>
                        <h3 class="player-label text-success text-center">??????</h3>
                    </div>
                    <h3 class="text-light">VS</h3>
                    <div>
                        <div class="d-flex justify-content-center">
                            <img class="w-50 rounded-circle user-image" src="/static/imgs/avatar_default.png" alt=""/>
                        </div>
                        <h3 class="player-label text-success text-center">??????</h3>
                    </div>
                </div>
                <p class="text-center text-light">
                    <span id="message">Waiting for the rest of players...</span>
                    <span id="countdown"></span>
                </p>
            </div>
        </div>
        `
    }
}
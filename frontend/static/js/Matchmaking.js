import AbstractComponent from "./AbstractComponent.js";
import { matchmakingSocket } from "./sockets.js";
import { client } from "./index.js";

export default class Matchmaking extends AbstractComponent {
    constructor() {
        super();
        this.socket = null;
        this.player2 = null;
        this.message = null;
        this.countdown = null;
        this.interval - null;
    }

    async searchingForUser() {
        if (client.matchmaking.searching) {
            client.matchmaking.stop();
        } else {
            await client.matchmaking.start(this.onReceive.bind(this), this.onDisconnect.bind(this), this.user.username);
        }
    }

    onDisconnect(event) {
        console.log("Disconnected");
    }

    intervalPredicator(){
        const num = +this.countdown.innerText;
        this.countdown.innerText = (num - 1);
        if (num - 1 == 0)
            window.location.assign('/pong');
    }

    startGame() {
        this.message.innerText = "Game starts on "
        this.countdown.innerText = "5";
        this.interval = setInterval(this.intervalPredicator, 1000);
    }

    endGame() {
        this.message.innerText = "Waiting for another player..."
        this.countdown.innerText = "";
        clearInterval(this.interval);
    }

    onReceive(data) {
        const res = JSON.parse(data)
        if (res.method === 'connect') {
            if (res.members.length == 2) {
                let otherUser = res.members.find(value => value != this.user.username);
                this.player2.innerText = otherUser;
                this.startGame();
            }
        }
        else {
            this.player2.innerText = "??????";
            this.endGame();
        }
    }

    activateEventHandlers() {
        this.player2 = document.getElementById('other-user');
        this.message = document.getElementById('message');
        this.countdown = document.getElementById('countdown');
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
                        <h3 id="other-user" class="text-success text-center">??????</h3>
                    </div>
                </div>
                <p class="text-center text-light">
                    <span id="message">Waiting for a second player...</span>
                    <span id="countdown"></span>
                </p>
            </div>
        </div>
        `
    }
}
import AbstractComponent from "./AbstractComponent.js";
import { client, handleLocation } from "./index.js";

export default class Matchmaking extends AbstractComponent {
    constructor() {
        super();
        this.player2 = null;
        this.message = null;
        this.countdown = null;
        this.interval - null;
        this.players = null;
        this.opponentImage = null;
    }

    async searchingForUser() {
        await client.matchmaking.start(this.onReceive.bind(this), this.onDisconnect.bind(this), this.user.username);
    }

    onDisconnect(event) {
        // console.log("Disconnected");
    }

    intervalPredicator(){
        const num = +this.countdown.innerText;
        this.countdown.innerText = (num - 1);
        if (num - 1 == 0) {
            if (this.user.username === this.players[0])
                client.matchmaking.addToMatch();
        }
    }

    redirectToPong() {
        clearInterval(this.interval);
        window.history.pushState({players: this.players}, null, '/pong')
        handleLocation();
    }

    startGame() {
        this.message.innerText = "Game starts on "
        this.countdown.innerText = "5";
        this.interval = setInterval(this.intervalPredicator.bind(this), 1000);
    }

    endGame() {
        this.message.innerText = "Waiting for another player..."
        this.countdown.innerText = "";
        clearInterval(this.interval);
    }

    onReceive(data) {
        const res = JSON.parse(data)
        this.players = res.members;
        if (res.method === 'connect') {
            if (res.members.length == 2) {
                let otherUser = res.members.find(value => value != this.user.username);
                let otherUserIndex = res.members.indexOf(otherUser);
                this.player2.innerText = otherUser;
                this.opponentImage.src = `data:image/png;base64,${res.avatars[otherUserIndex]}`
                this.startGame();
            }
        } else if (res.method === 'add') {
            this.redirectToPong()
        }
        else {
            this.player2.innerText = "??????";
            this.opponentImage.src = "/static/imgs/avatar_default.png"
            this.endGame();
        }
    }

    activateEventHandlers() {
        this.player2 = document.getElementById('other-user');
        this.message = document.getElementById('message');
        this.countdown = document.getElementById('countdown');
        this.opponentImage = document.getElementById('opponent-image');
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
                            <img class="w-50 rounded-circle" src="${this.user.avatar ? `data:image/png;base64,${this.user.avatar}` : "/static/imgs/avatar_default.png"}" alt=""/>
                        </div>
                        <h3 class="text-success text-center">${this.user.username}</h3>
                    </div>
                    <h3 class="text-light">VS</h3>
                    <div>
                        <div class="d-flex justify-content-center">
                            <img id="opponent-image" class="w-50 rounded-circle" src="/static/imgs/avatar_default.png" alt=""/>
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
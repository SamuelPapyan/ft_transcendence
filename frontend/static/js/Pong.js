import AbstractComponent from "./AbstractComponent.js";
import { client } from "./index.js";

export default class Pong extends AbstractComponent {
    constructor() {
        super();
        this.gameOn = false;
        this.player2 = null;
        this.upPressed = false;
        this.downPressed = false;
        this.player1Score = null;
        this.player2Score = null;
        this.area = null;
        this.ctx = null;
        this.interval = null;
        this.winnerName = null;
        this.player1Label = null;
        this.player2Label = null;
        this.player1FinalScore = null;
        this.player2FinalScore = null;
        this.resultModal = null;
    }

    onKeyDown(event) {
        if (event.key == 'w')
            this.upPressed = true;
        else if (event.key == 's')
            this.downPressed = true;
    }

    onKeyUp(event) {
        if (event.key == 'w')
            this.upPressed = false;
        else if (event.key == 's')
            this.downPressed = false;
    }

    renderPong(data, members, final_scores){
        this.ctx.clearRect(0, 0, 800, 500);
        if (members.indexOf(this.user.username) == 0) {
            this.ctx.fillStyle = "green";
            this.ctx.fillRect(20, data.p1_y, 20, 100);
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(+this.area.width - 40, data.p2_y, 20, 100);
            this.ctx.beginPath();
            this.ctx.arc(data.x + 400, data.y + 250 - 10, 10, 0, Math.PI * 2);
            this.ctx.fillStyle = "orange";
            this.ctx.fill();
            this.player1Score.innerText = final_scores[0];
            this.player2Score.innerText = final_scores[1];
        } else {
            this.ctx.fillStyle = "green";
            this.ctx.fillRect(20, data.p2_y, 20, 100);
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(+this.area.width - 40, data.p1_y, 20, 100);
            this.ctx.beginPath();
            this.ctx.arc(-data.x + 400, data.y + 250 - 10, 10, 0, Math.PI * 2);
            this.ctx.fillStyle = "orange";
            this.ctx.fill();
            this.player1Score.innerText = final_scores[1];
            this.player2Score.innerText = final_scores[0];
        }
    }

    async startPong() {
        await client.pong.start(this.onReceive.bind(this), this.onDisconnect.bind(this), this.user.username);
    }

    intervalPredicator() {
        if (this.upPressed) {
            client.pong.sendMove(-2);
        } else if (this.downPressed) {
            client.pong.sendMove(2);
        } else {
            client.pong.sendGame();
        }
    }

    startGame() {
        this.interval = setInterval(this.intervalPredicator.bind(this), 1);
    }

    onReceive(data) {
        const res = JSON.parse(data)
        this.players = res.members;
        if (res.method === 'connect' || res.method === 'move' || res.method === 'game') {
            if (res.method === 'connect') {
                if (res.members.length == 2) {
                    let otherUser = res.members.find(value => value != this.user.username);
                    this.player2.innerText = otherUser;
                    this.gameOn = true;
                    this.startGame();
                }
            }
            if (res.winner) {
                clearInterval(this.interval);
                this.winnerName.innerText = res.winner;
                this.player1Label.innerText = res.members[0]
                this.player2Label.innerText = res.members[1]
                this.player1FinalScore.innerText = res.final_scores[0]
                this.player2FinalScore.innerText = res.final_scores[1]
                this.resultModal.style.display = "block";
            }
            this.renderPong(res.game_data, res.members, res.final_scores);
        }
        else if (res.method === 'disconnect'){
            this.player2.innerText = "??????";
            clearInterval(this.interval);
        }
    }

    onDisconnect(event) {
        console.log("Disconnected");
    }

    activateEventHandlers() {
        this.area = document.querySelector('#pong-area');
        this.player1Score = document.querySelector('#p1-score');
        this.player2Score = document.querySelector('#p2-score');
        this.ctx = this.area.getContext('2d');
        this.player2 = document.querySelector('#player2');
        this.winnerName  = document.querySelector('#winnerName');
        this.player1Label = document.querySelector('#player1Label');
        this.player2Label = document.querySelector('#player2Label');
        this.player1FinalScore = document.querySelector('#player1FinalScore');
        this.player2FinalScore = document.querySelector('#player2FinalScore');
        this.resultModal = document.querySelector('#resultModal');
        if (window.history.state?.players) {
            client.matchmaking.clientLeave();
            client.matchmaking.stop();
            this.player2.innerText = window.history.state.players.find(val => val !== this.user.username)
        }
        document.addEventListener('keyup', this.onKeyUp.bind(this));
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        this.startPong();
    }

    getHtml() {
        return `
        <div class="row">
            <div class="col-6">
                <h3 class="text-success">${this.user.username}: <span id="p1-score">0</span></h3>
                <h3 class="text-danger"><span id="player2">??????</span>: <span id="p2-score">0</span></h3>
            </div>
        </div>
        <div class="d-flex justify-content-center">
            <canvas class="bg-white" id="pong-area" width="800" height="500"></canvas>
        </div>
        <div class="modal" style="display:none;" tabindex="-1" id="resultModal">
            <div class="modal-dialog">
                <div class="modal-content bg-dark">
                <div class="modal-header border-success">
                    <h5 class="text-center text-success modal-title">Modal title</h5>
                </div>
                <div class="modal-body">
                    <h3 class="text-success text-center">The winner is <span id="winnerName">WINNER</span></h3>
                    <div class="d-flex justify-content-evenly row">
                        <div class="col-4 border border-success rounded">
                            <h3 id="player1Label" class="text-center text-success">Player 1</h3>
                            <h3 id="player1FinalScore" class="text-center text-success">10</h3>
                        </div>
                        <div class="col-4 border border-success rounded">
                            <h3 id="player2Label" class="text-center text-danger">Player 2</h3>
                            <h3 id="player2FinalScore" class="text-center text-danger">9</h3>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-success">
                    <button type="button" class="btn btn-success"><a href="/">Ok</a></button>
                </div>
                </div>
            </div>
        </div>
        `;
    }
}
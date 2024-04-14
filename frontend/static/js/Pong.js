import AbstractComponent from "./AbstractComponent.js";

const data = {
    gameOn: true,
    x: 400 - 10,
    y: 250 - 10,
    p1_score: 0,
    p2_score: 0,
    p1_y: 200,
    p2_y: 200,
    dx: -1,
    dy: -1,
}

function startGame(){
    // P1 Goal
    if (data.gameOn) {
        if (data.x + data.dx > 800 - 10) {
            data.p1_score += 1;
            data.x = 400 - 10;
            data.y = 250 - 10;
        }

        // P2 Goal
        if (data.x + data.dx < 10) {
            data.p2_score += 1;
            data.x = 400 - 10;
            data.y = 250 - 10;
        }
        
        //Y-Collision
        if (data.y + data.dy > 500 - 10
            || data.y + data.dy < 10) {
            data.dy = -data.dy;
        }

        //P1 Paddle Collision
        if (data.y >= data.p1_y && data.y <= data.p1_y + 100 - 10 &&
            (data.x + data.dx < 40 + 10))
            data.dx = -data.dx;

        //P2 Paddle Collision
        if (data.y >= data.p2_y && data.y <= data.p2_y + 100 - 10 &&
            (data.x + data.dx > 800 - 40 - 10))
            data.dx = -data.dx;
        data.x += data.dx;
        data.y += data.dy;
    }
}

setInterval(startGame, 1);

async function getData() {
    return data;
}

async function sendData(y) {
    for(let i in y)
        if (i == "gameOn")
            data[i] = y[i];
        else
            data[i] += y[i];
}

let upPressed = false;
let downPressed = false;

function onKeyDown(event) {
    if (event.key == 'w')
        upPressed = true;
    else if (event.key == 's')
        downPressed = true;
}

function onKeyUp(event) {
    if (event.key == 'w')
        upPressed = false;
    else if (event.key == 's')
        downPressed = false;
}

export default class Pong extends AbstractComponent {
    constructor() {
        super();
        this.gameOn = true;
    }
    renderPong(elems, ctx) {
        if (this.gameOn && elems.area) {
            getData().then(data=>{
                ctx.clearRect(0, 0, 800, 500);
                ctx.fillStyle = "green";
                ctx.fillRect(20, data.p1_y, 20, 100);
                ctx.fillStyle = "red";
                ctx.fillRect(+elems.area.width - 40, data.p2_y, 20, 100);
                ctx.beginPath();
                ctx.arc(data.x, data.y, 10, 0, Math.PI * 2);
                ctx.fillStyle = "orange";
                ctx.fill();
                elems.p1Score.innerText = data.p1_score;
                elems.p2Score.innerText = data.p2_score;
                if (data.p1_score >= 7 || data.p2_score >= 7){
                    this.gameOn = false;
                    sendData({gameOn: false});
                }
            });
        }
        
    }

    update(elems, ctx) {
        this.renderPong(elems, ctx);
        if (upPressed) {
            sendData({p1_y: -2});
        } else if (downPressed) {
            sendData({p1_y: 2});
        }
    }

    activateEventHandlers() {
        const $area = document.querySelector('#pong-area');
        const $p1Score = document.querySelector('#p1-score');
        const $p2Score = document.querySelector('#p2-score');
        const $ctx = $area.getContext('2d');
        document.addEventListener('keyup', onKeyUp);
        document.addEventListener('keydown', onKeyDown);
        setInterval(()=>this.update({
            area: $area,
            p1Score: $p1Score,
            p2Score: $p2Score,
        }, $ctx), 1);
        this.renderPong($area, $ctx);
    }

    getHtml() {
        return `
        <div class="row">
            <div class="col-6">
                <h3 class="text-success">Sampap: <span id="p1-score">0</span></h3>
                <h3 class="text-danger">??????: <span id="p2-score">0</span></h3>
            </div>
        </div>
        <div class="d-flex justify-content-center">
            <canvas class="bg-white" id="pong-area" width="800" height="500"></canvas>
        </div>
        `;
    }
}
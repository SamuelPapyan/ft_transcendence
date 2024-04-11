import AbstractComponent from "./AbstractComponent.js";

export default class Home extends AbstractComponent {
    constructor() {
        super();
    }

    getHtml() {
        const players = [
            {'name': 'Samvel', 'wins': 20, 'loss': 11},
            {'name': 'Chito', 'wins': 30, 'loss': 1},
            {'name': 'Grito', 'wins': 2, 'loss': 11},
        ]
        let listHtml = ""
        for (let i in players ){
            listHtml += `
            <div class="col w-25 border border-success rounded">
                <h2 class="text-center text-success">${players[i].name}</h2>
                <p class="text-center text-success">Wins: ${players[i].wins}</p>
                <p class="text-center text-success">Loss: ${players[i].loss}</p>
            </div>
            `
        }
        return `
            <h2 class="text-center text-success">Welcome to our legendary Pong game.</h2>
            <div class="mx-auto mb-4 py-5 bg-light d-flex align-items-center justify-content-center">
            <button class="btn btn-success" style="font-size:100px;">
                <a href="/matchmaking" class="text-light text-decoration-none ">LET'S PLAY</a>
            </button>
            </div>
            <div class=" p-2">
            <h2 class="text-center text-uppercase text-success">Our best players</h2>
            <div class="d-flex w-100 justify-content-evenly">
                ${ listHtml }
            </div>
            </div>
        `;
    }
}
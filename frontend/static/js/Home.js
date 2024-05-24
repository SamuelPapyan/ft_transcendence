import AbstractComponent from "./AbstractComponent.js";
import MatchService from "./services/MatchService.js";

export default class Home extends AbstractComponent {
    constructor() {
        super();
        this.playButton = null;
    }

    buttonOnClick(event) {
        event.preventDefault();
        MatchService.hasOngoinMatch(this.user.username).then(res=>{
            if (res.success) {
                if (res.data) {
                    window.location.assign("/pong");
                } else { 
                    $("#match-choice-modal").modal("show")
                }
            }
        }).catch(err=>{
            console.log(err.message);
        })
    }

    activateEventHandlers(){
        this.playButton = document.querySelector('#lets-play-button')
        this.playButton.addEventListener('click', this.buttonOnClick.bind(this));
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
            <div class="col-3 mx-1 border border-success rounded p-3">
                <div class="d-flex justify-content-center">
                    <img class="w-75 rounded-circle" src="/static/imgs/avatar_default.png" alt=""/>
                </div>
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
                    <a href="/matchmaking" class="text-light text-decoration-none" id="lets-play-button">LET'S PLAY</a>
                </button>
            </div>
            <div class="p-2">
                <h2 class="text-center text-uppercase text-success">Our best players</h2>
                <div class="row d-flex justify-content-center">
                    ${ listHtml }
                </div>
            </div>

            <div id="match-choice-modal" class="modal fade" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="text-success text-center">Select Game Type</h5>
                        </div>
                        <div class="modal-body d-flex justify-content-around">
                            <a class="btn btn-success" style="font-size:25px;" href="/matchmaking">One-on-One Battle</a>
                            <a class="btn btn-outline-success" style="font-size:25px;" href="/matchmaking/tournament">Tournament</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
import AbstractComponent from "./AbstractComponent.js";

export default class Matchmaking extends AbstractComponent {
    constructor(user) {
        super();
        this.user = user;
        this.player2 = "??????";
    }

    searchingForUser() {
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
                        <h3 class="text-success text-center">${this.user}</h3>
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
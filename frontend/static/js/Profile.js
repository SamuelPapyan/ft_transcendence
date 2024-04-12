import AbstractComponent from "./AbstractComponent.js";

export default class Profile extends AbstractComponent {
    constructor(user) {
        super();
        this.user = user 
    }

    getMatches() {
        let html = "";
        const matches = [
            {p1: "Samvel", p2: "Pavan", win: "Samvel", loss: "Pavan", p1Score: 10, p2Score: 4, matchStart: new Date("2022-03-04"), matchEnd: new Date("2022-03-04")},
            {p1: "Samvel", p2: "Pavan", win: "Samvel", loss: "Pavan", p1Score: 10, p2Score: 4, matchStart: new Date("2022-03-04"), matchEnd: new Date("2022-03-04")},
            {p1: "Samvel", p2: "Pavan", win: "Samvel", loss: "Pavan", p1Score: 10, p2Score: 4, matchStart: new Date("2022-03-04"), matchEnd: new Date("2022-03-04")},
            {p1: "Samvel", p2: "Pavan", win: "Samvel", loss: "Pavan", p1Score: 10, p2Score: 4, matchStart: new Date("2022-03-04"), matchEnd: new Date("2022-03-04")},
        ]
        matches.forEach(value=>{
            html += `
            <div class="row mb-2">
                <div class="col">
                    <div class="card border-success bg-dark" style="border-radius: 15px;">
                        <div class="card-body p-4">
                            <div class="flex-grow-1 ms-3">
                                <h5 class="mb-1 text-center text-success">${value.p1} VS ${value.p2}</h5>
                                <div class="d-flex justify-content-between">
                                    <p class="mb-2 pb-1 text-success" style="color: #2b2a2a;">Winner: ${value.win}</p>
                                    <p class="mb-2 pb-1 text-success" style="color: #2b2a2a;">Loser: ${value.loss}</p>
                                </div>
                                <div class="d-flex justify-content-start rounded-3 p-2 mb-2 bg-dark border border-success">
                                    <div>
                                        <p class="small text-muted mb-1">${value.p1}</p>
                                        <p class="mb-0 text-success">${value.p1Score}</p>
                                    </div>
                                    <div class="px-3">
                                        <p class="small text-muted mb-1">${value.p2}</p>
                                        <p class="mb-0 text-success">${value.p2Score}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        });
        return html;
    }

    getHtml() {
        return `
        <h2 class="text-center text-success">${this.user}'s Profile</h2>
        <div style="height:500px;" class="row d-flex">
            <div class="w-50 h-100 d-flex justify-content-center">
                <img src="/static/imgs/avatar_default.png" class="d-block w-80 h-100 rounded-3 border border-success"/>
            </div>
            <div style="overflow: auto;" class="w-50 h-100">
                <h2 class="text-center text-success sticky-top bg-dark pb-3">Match history</h2>
                ${this.getMatches()}
            </div>
        </div>
        `
    }
}
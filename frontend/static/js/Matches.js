import AbstractComponent from "./AbstractComponent.js";

export default class Matches extends AbstractComponent {
    constructor(user) {
        super();
        this.user = user 
    }

    getUsers() {
        let html = "";
        const matches = [
            {username: "sampap", wins: 20, loss: 11},
            {username: "sampap", wins: 20, loss: 11},
            {username: "sampap", wins: 20, loss: 11},
            {username: "sampap", wins: 20, loss: 11},
            {username: "sampap", wins: 20, loss: 11},
        ]
        matches.forEach(value=>{
            html += `
                <div class="row col-xl-5 col-sm-12 mx-1 d-flex align-items-center border border-success rounded bg-dark">
                    <div class="col-xl-2 col-sm-2">
                        <img src="/static/imgs/avatar_default.png"/ alt="" class="w-100">
                    </div>
                    <div class="col-xl-8 col-sm-8 card bg-dark">
                        <div class="card-body p-4">
                            <div class="flex-grow-1 ms-3">
                                <h5 class="mb-1 text-success text-center">${value.username}</h5>
                                <div class="d-flex justify-content-start rounded-3 p-2 mb-2 bg-dark border border-success">
                                    <div>
                                        <p class="small text-muted mb-1">Wins</p>
                                        <p class="mb-0 text-success">${value.wins}</p>
                                    </div>
                                    <div class="px-3">
                                        <p class="small text-muted mb-1">Loss</p>
                                        <p class="mb-0 text-success">${value.loss}</p>
                                    </div>
                                </div>
                                <div class="d-flex pt-1">
                                    <a href="#" class="btn btn-outline-success me-1 flex-grow-1">Attend the match</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-2 col-sm-2">
                        <img src="/static/imgs/avatar_default.png"/ alt="" class="w-100">
                    </div>
                </div>`
        });
        return html;
    }

    getHtml() {
        return `
        <h2 class="text-center text-success">Ongoing Matches</h2>
        <div class="w-100 row">
            ${this.getUsers()}
        </div>
        `
    }
}
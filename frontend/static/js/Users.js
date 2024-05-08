import AbstractComponent from "./AbstractComponent.js";
import UserService from "./services/UserService.js";

export default class Users extends AbstractComponent {
    constructor() {
        super();
    }

    injectUser(user) {
        this.user = user;
    }

    getUsers(data) {
        let html = "";
        data = data.filter(usr=>usr.username !== this.user.username);
        data.forEach(value=>{
            html += `
            <div class="row mb-2">
                <div class="row col-xl-6 col-sm-12  d-flex align-items-center border border-success rounded bg-dark">
                    <div class="col-2">
                        <img src="/static/imgs/avatar_default.png"/ alt="" class="w-100">
                    </div>
                    <div class="col-10 card bg-dark">
                        <div class="card-body p-4">
                            <div class="flex-grow-1 ms-3">
                                <h5 class="mb-1 text-success">${value.username}</h5>
                                <div class="d-flex justify-content-start rounded-3 p-2 mb-2 bg-dark border border-success">
                                    <div>
                                        <p class="small text-muted mb-1">Wins</p>
                                        <p class="mb-0 text-success">${20}</p>
                                    </div>
                                    <div class="px-3">
                                        <p class="small text-muted mb-1">Loss</p>
                                        <p class="mb-0 text-success">${11}</p>
                                    </div>
                                </div>
                                <div class="d-flex pt-1">
                                    <button type="button" class="btn btn-outline-success me-1 flex-grow-1">Chat</button>
                                    <button type="button" class="btn btn-success flex-grow-1">Follow</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        });
        return html;
    }

    getHtml(data) {
        return `
        <h2 class="text-center text-success">Users</h2>
        <div class="w-100 d-flex flex-column align-items-center">
            ${this.getUsers(data)}
        </div>
        `
    }
}
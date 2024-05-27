import AbstractComponent from "./AbstractComponent.js";
import FriendsService from "./services/FriendsService.js";

export default class Profile extends AbstractComponent {
    constructor() {
        super();
    }

    injectUser(user) {
        this.user = user;
        this.profileUser = "";
    }

    getMatches(data) {
        let html = "";
        data.forEach(value=>{
            html += `
            <div class="row mb-2">
                <div class="col">
                    <div class="card border-success bg-dark" style="border-radius: 15px;">
                        <div class="card-body p-4">
                            <div class="flex-grow-1 ms-3">
                                <h5 class="mb-1 text-center text-success">${value.p1} VS ${value.p2}</h5>
                                <div class="d-flex justify-content-between">
                                    <p class="mb-2 pb-1 text-success" style="color: #2b2a2a;">Winner: ${value.winner == value.p1 ? value.p1 : value.p2}</p>
                                    <p class="mb-2 pb-1 text-success" style="color: #2b2a2a;">Loser: ${value.winner == value.p2 ? value.p1 : value.p2}</p>
                                </div>
                                <div class="d-flex justify-content-start rounded-3 p-2 mb-2 bg-dark border border-success">
                                    <div>
                                        <p class="small text-muted mb-1">${value.p1}</p>
                                        <p class="mb-0 text-success">${value.p1_score}</p>
                                    </div>
                                    <div class="px-3">
                                        <p class="small text-muted mb-1">${value.p2}</p>
                                        <p class="mb-0 text-success">${value.p2_score}</p>
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

    async acceptFriend(event) {
        try {
            const res = await FriendsService.acceptFriendRequest({
                user: this.user.username,
                other_user: event.target.getAttribute('user')
            });
            if (res.success) {
                window.location.reload();
            }
        } catch (err) {
            // console.log(err.message);
        }
    }

    async rejectFriend(event) {
        try {
            const res = await FriendsService.rejectFriendRequest({
                user: this.user.username,
                other_user: event.target.getAttribute('user')
            });
            if (res.success) {
                window.location.reload();
            }
        } catch (err) {
            // console.log(err.message);
        }
    }

    async removeFriend(event) {
        try {
            const res = await FriendsService.removeFriend({
                user: this.user.username,
                other_user: event.target.getAttribute('user')
            });
            if (res.success) {
                window.location.reload();
            }
        } catch (err) {
            // console.log(err.message);
        }
    }

    profileLinkOnClick(event) {
        event.preventDefault();
        history.pushState({ username: event.target.innerText }, null, '/profile')
        location.assign('/profile');
    }

    getFriends(data) {
        let html = "";
        const profileUser = (window.history.state ? window.history.state.username : this.user.username);
        data.forEach(value=>{
            html += `
            <div class="d-flex p-1 justify-content-evenly">
                <p class="bold"><a class="profile-link text-light text-decoration-none" href="/profile">${value.username}</a></p>
                ${profileUser == this.user.username ? `<button user="${value.username}" class="remove-friend btn btn-outline-danger">Remove Friend</button>` : ""}
            </div>
        `;
        })
        return html;
    }

    getSentRequests(data) {
        let html = "";
        const profileUser = (window.history.state ? window.history.state.username : this.user.username);
        data.filter(value=>value.from == profileUser).forEach(value=>{
            html += `
            <div class="d-flex p-1 justify-content-evenly">
                <p class="bold"><a class="profile-link text-light text-decoration-none" href="/profile">${value.to}</a></p>
                <p class="bold ${value.rejected ? "text-danger" : "text-warning"}">${value.rejected ? "Rejected" : "Pending"}</p>
            </div>
        `;})
        return html;
    }

    getFriendRequests(data) {
        let html = "";
        const profileUser = (window.history.state ? window.history.state.username : this.user.username);
        data.filter(value=>value.from != profileUser).forEach(value=>{
            html += `
            <div class="d-flex p-1 justify-content-evenly">
                <p class="bold"><a class="profile-link text-light text-decoration-none" href="/profile">${value.from}</a></p>
                ${ profileUser == this.user.username ?
                `<button user="${value.from}" class="accept-friend btn btn-outline-success">Accept</button>
                <button user="${value.from}" class="reject-friend btn btn-outline-danger">Reject</button>` : ""
                }
            </div>
        `;})
        return html;
    }

    activateEventHandlers() {
        [...document.querySelectorAll('.accept-friend')].forEach(elem=>{
            elem.addEventListener('click', this.acceptFriend.bind(this));
        });

        [...document.querySelectorAll('.reject-friend')].forEach(elem=>{
            elem.addEventListener('click', this.rejectFriend.bind(this));
        });

        [...document.querySelectorAll('.remove-friend')].forEach(elem=>{
            elem.addEventListener('click', this.removeFriend.bind(this));
        });

        [...document.querySelectorAll('.profile-link')].forEach(elem=>{
            elem.addEventListener('click', this.profileLinkOnClick.bind(this));
        });
    }

    getHtml(data) {
        return `
        <h2 class="text-center text-success">
            ${window.history.state ? window.history.state.username : this.user.username}
        </h2>
        <div style="height:500px;" class="row d-flex pb-3">
            <div class="w-50 h-100 d-flex justify-content-center">
                <img src="${data.userData.avatar ? `data:image/png;base64,${data.userData.avatar}`  : "/static/imgs/avatar_default.png"}" class="d-block w-80 h-100 rounded-3 border border-success"/>
            </div>
            <div style="overflow: auto;" class="w-50 h-100">
                <h2 class="text-center text-success sticky-top bg-dark pb-3">Match history</h2>
                ${this.getMatches(data.matchHistory)}
            </div>
        </div>
        <div style="height:500px;" class="row d-flex">
            <div style="overflow: auto;" class="col-4 h-100">
                <h2 class="text-center text-success sticky-top bg-dark pb-3">Friends</h2>
                ${this.getFriends(data.friends)}
            </div>
            <div style="overflow: auto;" class="col-4 h-100">
                <h2 class="text-center text-success sticky-top bg-dark pb-3">Friend Requests</h2>
                ${this.getFriendRequests(data.friendRequests)}
            </div>
            <div style="overflow: auto;" class="col-4 h-100">
                <h2 class="text-center text-success sticky-top bg-dark pb-3">My Friend Requests</h2>
                ${this.getSentRequests(data.sentRequests)}
            </div>
        </div>
        `
    }
}
import AbstractComponent from "./AbstractComponent.js";
import ChatService from "./services/chatService.js";
import Chat from "./Chat.js";
import FriendsService from "./services/FriendsService.js";

export default class Users extends AbstractComponent {
    constructor() {
        super();
        this.dmUser = null;
        this.dmSend = null;
        this.dmContent = null;
    }

    injectUser(user) {
        this.user = user;
    }

    async sendFriendRequest(event) {
        try {
            const res = await FriendsService.sendFriendRequest({
                user: this.user.username,
                other_user: event.target.getAttribute('user')
            });
            alert(res.message)
        } catch (err) {
            // console.log(err.message);
        }
    }

    chatClick(event) {
        ChatService.hasDM({
            sender: this.user.username,
            to: event.target.getAttribute("user")
        }).then(res=>{
            if (res.success) {
                if (res.data) {
                    Chat.dmUser = event.target.getAttribute("user")
                    Chat.dmMode = true
                    $("#chat-view").modal("show")
                } else {
                    this.dmUser.innerText = event.target.getAttribute("user")
                    $("#dm-modal").modal("toggle")
                }
            }
        }).catch(err=>{
            // console.log(err.message);
        })
    }

    onDmSend(){
        const content = this.dmContent.value;
        ChatService.createDM({
            sender: this.user.username,
            to: this.dmUser.innerText,
            content: content
        }).then(res=>{
            if (res.success) {
                $("#dm-modal").modal("hide")
                Chat.dmMode = true
                Chat.dmUser = this.dmUser.innerText
                $("#chat-view").modal("show")
            }
        }).catch(err=>{
            // console.log(err.message);
        })
    }

    profileLinkOnClick(event) {
        event.preventDefault();
        const profileUser = event.target.innerText;
        history.pushState({username: profileUser}, null, '/profile');
        location.assign('/profile');
    }

    activateEventHandlers(){
        const chatButtons = [...document.querySelectorAll('.chat-button')]
        this.dmUser = document.querySelector('#dm-username')
        this.dmSend = document.querySelector('#dm-send')
        this.dmContent = document.querySelector('#dm-content')
        this.dmModal = document.querySelector('#dm-modal')
        chatButtons.forEach(elem=>{
            elem.addEventListener('click', this.chatClick.bind(this))
        })
        this.dmSend.addEventListener('click', this.onDmSend.bind(this));
        [...document.querySelectorAll('.profile-link')].forEach(elem=>{
            elem.addEventListener('click', this.profileLinkOnClick.bind(this));
        });
        [...document.querySelectorAll('.send-fr')].forEach(elem=>{
            elem.addEventListener('click', this.sendFriendRequest.bind(this));
        })
    }

    getUsers(data) {
        let html = "";
        data = data.filter(usr=>usr.username !== this.user.username);
        data.forEach(value=>{
            html += `
            <div class="row mb-2">
                <div class="row col-xl-6 col-sm-12  d-flex align-items-center border border-success rounded bg-dark">
                    <div class="col-2">
                        <img src="${value.avatar ? `data:image/png;base64,${value.avatar}`  : "/static/imgs/avatar_default.png"}" alt="" class="w-100">
                    </div>
                    <div class="col-10 card bg-dark">
                        <div class="card-body p-4">
                            <div class="flex-grow-1 ms-3">
                                <h5 class="mb-1"><a class="profile-link text-success text-decoration-none" href="/profile">${value.username}</a></h5>
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
                                    <button type="button" class="btn btn-outline-success me-1 flex-grow-1 chat-button" user="${value.username}">Chat</button>
                                    <button type="button" class="send-fr btn btn-success flex-grow-1" user="${value.username}">Send Friend Request</button>
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
        <div class="modal fade" id="dm-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="">Write DM to <span id="dm-username"></span></h5>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                            <input id="dm-content" class="form-control" type="text" placeholder="Type some message" name="content"/>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="dm-send" type="button" class="btn btn-success">Send</button>
                </div>
                </div>
            </div>
        </div>
        `
    }
}
import AbstractComponent from "./AbstractComponent.js";
import getSelectValues from "./getSelectValues.js";
import UserService from "./services/UserService.js";

export default class Chat extends AbstractComponent {
    static dmUser = null;
    constructor(){
        super();
        this.groupChatId = null;
        this.chatModal = null;
        this.channels = [];
        this.messages = [];
        this.socket = null;
        this.dmList = null;
        this.chatZone = null;
        this.chatInput = null;
        this.sendButton = null;
        this.dmChatsButton = null;
        this.groupChatsButton = null;
        this.dmChatsContent = null;
        this.groupChatsContent = null;
        this.groupChatNameInput = null;
        this.gcUsersSelect = null;
        this.createGroupChatButton = null;
        this.groupChatList = null;
        this.dmMode = true;
        this.blockedChat = false;
        this.inviteButton = null;
    }

    createDmItem(data, dm) {
        return `
        <li class="p-2 border-bottom">
            <div class="d-flex flex-row ${dm ? "dm-item" : "group-item"}" ${dm ? `user=${data.dm_name}` : `group=${data.chat_id}`} style="cursor: pointer;">
            <div>
                <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                alt="avatar" class="d-flex align-self-center me-3" width="60" ${dm ? `user=${data.dm_name}` : `group=${data.chat_id}`}>
                <span class="badge bg-success badge-dot"></span>
            </div>
            <div class="pt-1">
                <p ${dm ? `user=${data.dm_name}` : `group=${data.chat_id}`} class="
                ${(dm && data.dm_name == Chat.dmUser) ? "text-success" : (!dm && data.chat_id == this.groupChatId ? "text-success" : "text-light")}
                fw-bold mb-0">${dm ? data.dm_name: data.channel_name}</p>
                <p ${dm ? `user=${data.dm_name}` : `group=${data.chat_id}`} class="small text-muted chat-item">${data.messages.length ? data.messages[data.messages.length - 1].content : ""}</p>
            </div>
            </div>
            <div class="pt-1">
            <p ${dm ? `user=${data.dm_name}` : `group=${data.chat_id}`} class="small text-muted mb-1"></p>
            </div>
        </li>
        `
    }

    createMessageBox(msg) {
        const date = new Date(msg.date.split(".")[0])
        const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} | ${date.getHours()} : ${date.getMinutes()}`
        if (msg.sender != this.user.username) {
            return `
            <div class="d-flex flex-row justify-content-end">
                <div>
                    <div class="text-dark small p-2 me-3 mb-1 rounded-3" style="background-color: #f5f6f7;">
                        <p>${msg.content}</p>
                        ${msg.invitation ? `
                            <a href="/matchmaking" class="btn btn-success">Play Pong</a>
                        ` : ""}
                    </div>
                    <p class="small me-3 mb-3 rounded-3 text-muted">${dateString}</p>
                </div>
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                    alt="avatar 1" style="width: 45px; height: 100%;">
            </div>
        `
        }
        return `
            <div class="d-flex flex-row justify-content-start">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                    alt="avatar 1" style="width: 45px; height: 100%;">
                <div>
                    <div class="bg-success small p-2 ms-3 mb-1 rounded-3 text-light">
                        <p>${msg.content}</p>
                        ${msg.invitation ? `
                            <p href="/matchmaking" class="small text-light">You invited ${msg.dm_name} to Pong.</p>
                        ` : ""}
                    </div>
                    <p class="small ms-3 mb-3 rounded-3 text-muted float-end">${dateString}</p>
                </div>
            </div>
        `
    }

    fillChatZone(messages) {
        this.chatZone.innerHTML = ""
        messages.forEach(msg=>{
            this.chatZone.innerHTML += this.createMessageBox(msg)
        })
    }

    fillBlockedChatZone(){
        this.chatZone.innerHTML = `
            <div class="w-100 h-100 d-flex justify-content-center align-items-center">
                <p class="text-light bold">You have been blocked by the chat owner.</p>
            </div>
        `
    }

    switchDM(event){
        Chat.dmUser = event.target.getAttribute('user');
        this.disconnect(true, false);
    }

    switchGroup(event){
        this.groupChatId = event.target.getAttribute('group');
        this.disconnect(false, true);
    }

    onConnect() {
        this.socket.send(JSON.stringify({
            "type": "dms",
            "user": this.user.username
        }))
    }

    blockUser(event) {
        const user = event.target.getAttribute('user');
        console.log(user);
        this.socket.send(JSON.stringify({
            type: "block",
            user: this.user.username,
            group_id: this.groupChatId,
            target: user
        }))
    }

    onMessage(event) {
        const data = JSON.parse(event.data);
        if (data.type == 'dms') {
            this.inviteButton.classList.remove('collapse')
            this.dmList.innerHTML = ""
            data.dm_chats.forEach(chat=>{
                if (!Chat.dmUser)
                    Chat.dmUser = chat.dm_name;
                this.dmList.innerHTML += this.createDmItem(chat, true);
                if (chat.dm_name == Chat.dmUser) {
                    this.fillChatZone(chat.messages);
                }
            });
            [...document.querySelectorAll('.dm-item')].forEach(elem=>{
                elem.addEventListener('click', this.switchDM.bind(this))
            })
            this.chatZone.scrollTop = this.chatZone.scrollHeight;
            this.socket.send(JSON.stringify({
                "type": "connect",
                "user": this.user.username,
                "dm": true,
                "dm_user": Chat.dmUser
            }))
        }
        if (data.type == 'connect') {
            if (data.user == this.user.username) {
                this.dmMode = data.dm;
            }
        }
        if (data.type == 'send') {
            console.log()
            if (!this.blockedChat) {
                if (Chat.dmUser == data.sender || !this.dmMode && data.group_id == this.groupChatId || this.user.username == data.sender) {
                    this.chatZone.innerHTML += this.createMessageBox(data)
                    this.chatZone.scrollTop = this.chatZone.scrollHeight;
                }
            }
            if (this.dmMode) {
                let x;
                x = document.querySelector(`.chat-item[user="${data.dm_name}"]`);
                console.log(x);
                if (!x)
                    x = document.querySelector(`.chat-item[user="${data.sender}"]`)
                x.innerText = data.content;
            }
            else {
                if (!this.blockedChat)
                    document.querySelector(`.chat-item[group="${data.group_id}"]`).innerText = data.content;
            }
        }
        if (data.type == 'disconnect') {
            if (data.user == this.user.username) {
                if (data.switchDm) {
                    this.socket.send(JSON.stringify({
                        "type": "dms",
                        "user": this.user.username
                    }))
                }
                if (data.switchGroup) {
                    this.socket.send(JSON.stringify({
                        "type": "group chats",
                        "user": this.user.username
                    }))
                }
            }
        }
        if (data.type == 'create group chat') {
            this.socket.send(JSON.stringify({
                "type": "group chats",
                "user": this.user.username
            }))
        }
        if (data.type == 'group chats') {
            this.inviteButton.classList.add('collapse');
            document.querySelector('#gc-list-view').style.height = "400px"
            document.querySelector('#group-users-view').classList.add("collapse");
            this.groupChatList.innerHTML = "";
            data.group_chats.forEach(chat=>{
                if (!this.groupChatId)
                    this.groupChatId = chat.chat_id;
                this.groupChatList.innerHTML += this.createDmItem(chat, false);
                if (chat.group_users[this.user.username])
                    document.querySelector(`.chat-item[group="${chat.chat_id}"]`).innerText = "(you are blocked from this chat)";
                if (chat.chat_id == this.groupChatId) {
                    if (chat.group_users[this.user.username]) {
                        this.fillBlockedChatZone();
                        this.chatInput.setAttribute('disabled', '');
                        this.blockedChat = true;
                    } else {
                        this.fillChatZone(chat.messages);
                        this.chatInput.removeAttribute('disabled');
                        this.blockedChat = false;
                    }
                }
                if (chat.chat_owner === this.user.username && chat.chat_id == this.groupChatId) {
                    document.querySelector('#gc-list-view').style.height = "200px"
                    document.querySelector('#group-users-view').classList.remove("collapse");
                    const x = document.querySelector('#group-users');
                    x.innerHTML = "";
                    Object.entries(chat.group_users).forEach(v=>{
                        x.innerHTML += `<div class="d-flex justify-content-evenly pb-1">
                                            <p class="bold text-light">${v[0]}</p>
                                            <button class="btn ${v[1] ? "btn-outline-success" : "btn-success"} user-block-item" user="${v[0]}">${v[1] ? "Unblock" : "Block"}</button>
                                        </div>`;
                        [...document.querySelectorAll('.user-block-item')].forEach(elem=>{
                            elem.addEventListener('click', this.blockUser.bind(this));
                        })
                    })
                }
            });
            [...document.querySelectorAll('.group-item')].forEach(elem=>{
                elem.addEventListener('click', this.switchGroup.bind(this))
            })
            this.chatZone.scrollTop = this.chatZone.scrollHeight;
            this.socket.send(JSON.stringify({
                "type": "connect",
                "user": this.user.username,
                "dm": false,
                "group_id": this.groupChatId
            }))
        }
        if (data.type == 'block') {
            console.log(data);
            if (data.user == this.user.username || data.target == this.user.username && !this.dmMode) {
                this.socket.send(JSON.stringify({
                    "type": "group chats",
                    "user": this.user.username
                }));
            }
        }
    }

    onShown(){
        if (!this.socket) {
            this.socket = new WebSocket('ws://localhost:8000/chat')
            this.socket.onopen = this.onConnect.bind(this);
            this.socket.onmessage = this.onMessage.bind(this);
            this.socket.onclose = function() {
                console.log("closed.");
            }
        } else {
            if (this.dmMode) {
                this.socket.send(JSON.stringify({
                    "type": "dms",
                    "user": this.user.username
                }))
            } else {
                this.socket.send(JSON.stringify({
                    "type": "group chats",
                    "user": this.user.username
                }))
            }
        }
    }

    onHidden() {
        this.disconnect(false, false);
    }

    sendMessage(){
        const content = this.chatInput.value;
        if (content) {
            this.socket.send(JSON.stringify({
                "type": "send",
                "user": this.user.username,
                "dm_user": Chat.dmUser,
                "group_id": this.groupChatId,
                "content": content,
                "dm": this.dmMode
            }));
            this.chatInput.value = "";
        }
    }

    toggleChats(event) {
        if (event.target == this.dmChatsButton) {
            this.dmChatsButton.classList.remove("btn-outline-success")
            this.dmChatsButton.classList.add("btn-success")
            this.groupChatsButton.classList.remove("btn-success")
            this.groupChatsButton.classList.add("btn-outline-success")
            this.dmChatsContent.classList.remove('collapse')
            this.groupChatsContent.classList.add('collapse')
            this.disconnect(true, false);
            this.blockedChat = false;
        }
        if (event.target == this.groupChatsButton) {
            this.dmChatsButton.classList.add("btn-outline-success")
            this.dmChatsButton.classList.remove("btn-success")
            this.groupChatsButton.classList.add("btn-success")
            this.groupChatsButton.classList.remove("btn-outline-success")
            this.dmChatsContent.classList.add('collapse')
            this.groupChatsContent.classList.remove('collapse')
            this.disconnect(false, true);
        }
    }

    createGroupChat(){
        const groupChatName = this.groupChatNameInput.value;
        const userIds = getSelectValues(this.gcUsersSelect).map(v=>+v);
        this.socket.send(JSON.stringify({
            type: "create group chat",
            user: this.user.username,
            gc_name: groupChatName,
            members_ids: userIds
        }))
    }

    fillGcUsersSelect() {
        UserService.getUsers().then(res=>{
            res.forEach(v=>{
                this.gcUsersSelect.innerHTML += `<option value="${v.id}">${v.username}</option>`
            })
        }).catch(err=>{
            console.log(err.message);
        })
    }

    activateEventHandlers() {
        this.chatModal = document.querySelector('#chat-view')
        this.dmList = document.querySelector('#dm-list')
        this.chatZone = document.querySelector('#chat-zone');
        this.chatInput = document.querySelector('#chat-input');
        this.sendButton = document.querySelector('#send-button');
        this.dmChatsButton = document.querySelector('#dm-chats-button')
        this.groupChatsButton = document.querySelector('#group-chats-button')
        this.dmChatsContent = document.querySelector('#dm-chats-content')
        this.groupChatsContent = document.querySelector('#group-chats-content')
        this.groupChatNameInput = document.querySelector('#group-chat-name-input')
        this.gcUsersSelect = document.querySelector('#gc-users-select')
        this.createGroupChatButton = document.querySelector('#create-group-chat-button')
        this.groupChatList = document.querySelector('#gc-list')
        this.inviteButton = document.querySelector('#invite-button')

        this.chatModal.addEventListener('hidden.bs.modal', this.onHidden.bind(this))
        this.chatModal.addEventListener('shown.bs.modal', this.onShown.bind(this))
        this.sendButton.addEventListener('click', this.sendMessage.bind(this))
        this.dmChatsButton.addEventListener('click', this.toggleChats.bind(this))
        this.groupChatsButton.addEventListener('click', this.toggleChats.bind(this))
        this.createGroupChatButton.addEventListener('click', this.createGroupChat.bind(this))
        this.inviteButton.addEventListener('click', this.sendInvitation.bind(this));
        window.addEventListener('beforeunload', this.onBeforeUnload.bind(this))

        this.fillGcUsersSelect()
    }

    sendInvitation() {
        const content = this.chatInput.value;
        if (content) {
            this.socket.send(JSON.stringify({
                "type": "send",
                "user": this.user.username,
                "dm_user": Chat.dmUser,
                "group_id": this.groupChatId,
                "content": content,
                "dm": this.dmMode,
                "invitation": true,
            }));
            this.chatInput.value = "";
        }
    }

    onBeforeUnload(){
        this.disconnect(false, false);
    }

    disconnect(switchDm, switchGroup) {
        if (this.socket && this.socket.readyState == this.socket.OPEN) {
            console.log("discarded as always")
            this.socket.send(JSON.stringify({
                type: "disconnect",
                user: this.user.username,
                switchDm: switchDm,
                switchGroup: switchGroup
            }))
        }
    }

    getHtml(){
        return `
        <button type="button" style="position: fixed; left:calc(100% - 100px); top:calc(100% - 60px)" class="btn btn-success rounded rounded-5" data-bs-toggle="modal" data-bs-target="#chat-view">
            Chat!
        </button>
        <div class="modal fade  m-0" id="chat-view" tabindex="-1" aria-labelledby="chatViewLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl bg-transparent">
        <div class="modal-content bg-transparent h-auto">
        <div class="modal-body">
            <div class="container">
            <div class="row">
                <div class="col-md-12">
                <div class="card bg-dark" id="chat3" style="border-radius: 15px;">
                    <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
                        <div class="row text-center d-flex justify-content-evenly">
                            <button class="col-5 btn btn-success" id="dm-chats-button">DM Chats</button>
                            <button class="col-5 btn btn-outline-success" id="group-chats-button">Group Chats</button>
                        </div>


                        <div id="dm-chats-content" class="p-3" style="overflow:auto">
                            <div class="input-group rounded mb-3">
                            <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search"
                                aria-describedby="search-addon" />
                            <span class="input-group-text border-0" id="search-addon">
                                <i class="fas fa-search"></i>
                            </span>
                            </div>
        
                            <div data-mdb-perfect-scrollbar="true" style="position: relative; height: 400px">
                            <ul id="dm-list" class="list-unstyled mb-0">
                                
                            </ul>
                            </div>
                        </div>

                        <div id="group-chats-content" class="p-3 collapse" style="overflow:auto">
                            <div class="input-group rounded mb-3">
                            <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search"
                                aria-describedby="search-addon" />
                            <span class="input-group-text border-0" id="search-addon">
                                <i class="fas fa-search"></i>
                            </span>
                            </div>
        
                            <div id="gc-list-view" data-mdb-perfect-scrollbar="true" style="position: relative; height: 400px; overflow:auto;">
                            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#createGroupChatModal">Add Group Chat</button>
                            <ul id="gc-list" class="list-unstyled mb-0">
                            </ul>
                            </div>
                            <div id="group-users-view" class="collapse" data-mdb-perfect-scrollbar="true" style="position: relative; height: 200px; overflow:auto">
                                <h3 class="text-center text-success">Group Users</h3>
                                <div id="group-users">

                                </div>
                            </div>
                        </div>


                        </div>
                        <div class="col-md-6 col-lg-7 col-xl-8">
                        <div id="chat-zone" class="pt-3 pe-3" data-mdb-perfect-scrollbar="true"
                            style="position: relative; height: 500px; overflow: auto; scroll-behavior: smooth">
                        </div>
                        <div class="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                            alt="avatar 3" style="width: 40px; height: 100%;">
                            <input type="text" class="form-control form-control-lg" id="chat-input"
                            placeholder="Type message">
                            <button id="invite-button" class="btn btn-success ms-3 pointer collapse">Invite!</button>
                            <button id="send-button" class="btn btn-success ms-3 pointer">Send!</button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
        </div>
        </div>
        <div class="modal fade" id="createGroupChatModal" tabindex="-1" role="dialog" aria-labelledby="crateGroupchatModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content bg-dark rounded border border-success">
                <div class="modal-header border-success">
                    <h5 class="modal-title text-success">Create group chat</h5>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <input id="group-chat-name-input" class="form-control" type="text" placeholder="Group Chat Name" name="content"/>
                    </div>
                    <div class="form-group">
                        <label for="gc-users-select">Select Users</label>
                        <select class="form-select" id="gc-users-select" multiple aria-label="multiple select example">
                            
                        </select>
                    </div>
                </div>
                <div class="modal-footer border-success d-flex justify-content-center">
                    <button id="create-group-chat-button" type="button" class="btn btn-success" data-bs-dismiss="modal">Create</button>
                </div>
                </div>
            </div>
        </div>
        `
    }
}
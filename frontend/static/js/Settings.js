import AbstractComponent from "./AbstractComponent.js";

export default class Settings extends AbstractComponent {
    constructor() {
        super(); 
    }

    injectUser(user) {
        this.user = user;
    }

    getHtml() {
        return `
        <h2 class="text-center text-success">Account Settings</h2>
        <div style="height:500px;" class="row d-flex">
            <div class="w-50 h-100 d-flex justify-content-center">
                <img src="/static/imgs/avatar_default.png" class="d-block w-80 h-100 rounded-3 border border-success"/>
            </div>
            <div class="w-50 h-100">
                <form action="/username" method="POST" class="border border-success rounded-3 p-2 mb-2">
                    {% csrf_token %}
                    <div class="mb-3 d-flex">
                        <div class="col-11">
                            <label for="username" class="form-label text-success">Change Username</label>
                            <input type="text" name="username" class="form-control bg-dark border-success text-success" id="username" aria-describedby="emailHelp">
                        </div>
                        <button type="submit" class="col-1 btn btn-success">Save</button>
                    </div>
                </form>
                <form action="/password" method="POST" class="border border-success rounded-3 p-2">
                    {% csrf_token %}
                    <div class="mb-3">
                        <label for="current-password" class="form-label text-success">Current Password</label>
                        <input type="password" name="current_password" class="form-control bg-dark border-success text-success" id="current-password">
                    </div>
                    <div class="mb-3">
                        <label for="new-password" class="form-label text-success">New Password</label>
                        <input type="password" name="new_password" class="form-control bg-dark border-success text-success" id="new-password">
                    </div>
                    <div class="mb-3">
                        <label for="confirm-password" class="form-label text-success">Confirm Password</label>
                        <input type="password" name="confirm_password" class="form-control bg-dark border-success text-success" id="confirm-password">
                    </div>
                    <div class="d-flex justify-content-center">
                        <button type="submit" class="btn btn-success">Change Password</button>
                    <div>
                </form>
            </div>
        </div>
        `
    }
}
import AbstractComponent from "./AbstractComponent.js";
import UserService from "./services/UserService.js";
import AuthService from "./services/AuthService.js"

export default class Settings extends AbstractComponent {
    constructor() {
        super(); 
    }

    injectUser(user) {
        this.user = user;
        this.usernameField = null;
        this.usernameForm = null;
        this.currentPassword = null;
        this.newPassword = null;
        this.confirmPassword = null;
        this.passwordForm = null;
        this.email = null;
        this.emailField = null;
        this.twoFactor = null;
        this.twoFactorForm = null;
        this.fileButton = null;
        this.avatarInput = null;
        this.avatarImage = null;
        this.saveAvatar = null;
    }

    usernameFormOnSubmit(event) {
        event.preventDefault();
        const username = this.usernameField.value;
        UserService.updateUsername({username: this.user.username, new_username: username}).then(res=>{
            if (res.success) {
                window.localStorage.setItem('token', res.data);
                window.location.reload();
            } else {
                alert(res.message)
            }
        }).catch(err=>{
            // console.log(err.message);
        })
    }

    passwordFormOnSubmit(event) {
        event.preventDefault();
        const current = this.currentPassword.value;
        const newPass = this.newPassword.value;
        const confirmPass = this.confirmPassword.value;
        if (newPass == confirmPass) {
            UserService.updatePassword({
                username: this.user.username,
                password: current,
                new_pass: newPass
            }).then(res=>{
                if (res.success) {
                    window.localStorage.setItem('token', res.data);
                    window.location.reload();
                } else {
                    alert(res.message)
                }
            })
        }
        else {
            alert("Passwords must be identical.")
        }
    }

    twoFactorOnChange(event) {
        if (event.target.checked)
            this.emailField.classList.remove('collapse')
        else
            this.emailField.classList.add('collapse')
    }

    twoFactorOnSubmit(event) {
        event.preventDefault();
        if (this.twoFactor.checked && !this.email.value) {
            alert("You have to fill email field to confirm 2FA authentication.")
        } else {
            AuthService.set2FA({
                username: this.user.username,
                two_factor: this.twoFactor.checked,
                email: this.email.value
            }).then(res=>{
                if (res.success)
                    window.location.reload()
            }).catch(err=>{
                // console.log(err.message);
            })
        }
    }

    fileButtonOnClick() {
        this.avatarInput.click();
    }

    avatarInputOnChange(event) {
        const file = event.target.files[0];
        this.avatarImage.src = URL.createObjectURL(file);
    }

    async saveAvatarOnClick(event) {
        const file = this.avatarInput.files[0];
        const formData = new FormData();
        formData.append('file', file);
        const res = await UserService.changeAvatar(this.user.username, formData);
        window.location.reload();
    }

    activateEventHandlers(){
        this.usernameField = document.querySelector('#username-field')
        this.usernameForm = document.querySelector('#username-form')
        this.currentPassword = document.querySelector('#current-password')
        this.newPassword = document.querySelector('#new-password')
        this.confirmPassword = document.querySelector('#confirm-password')
        this.passwordForm = document.querySelector('#password-form');
        this.twoFactorForm = document.querySelector('#two-factor-form');
        this.twoFactor = document.querySelector('#two-factor-checkbox');
        this.email = document.querySelector('#email')
        this.emailField = document.querySelector('#email-field');
        this.fileButton = document.querySelector('#file-button');
        this.avatarInput = document.querySelector('#avatar-input');
        this.avatarImage = document.querySelector('#avatar-image');
        this.saveAvatar = document.querySelector('#save-avatar');

        this.usernameForm.addEventListener('submit', this.usernameFormOnSubmit.bind(this));
        this.passwordForm.addEventListener('submit', this.passwordFormOnSubmit.bind(this));
        this.fileButton.addEventListener('click', this.fileButtonOnClick.bind(this));
        this.avatarInput.addEventListener('change', this.avatarInputOnChange.bind(this));
        this.saveAvatar.addEventListener('click', this.saveAvatarOnClick.bind(this));

        this.twoFactor.addEventListener('change', this.twoFactorOnChange.bind(this));
        this.twoFactorForm.addEventListener('submit', this.twoFactorOnSubmit.bind(this));
    }

    getHtml(data) {
        return `
        <h2 class="text-center text-success">Account Settings</h2>
        <div style="height:500px;" class="row d-flex">
            <div class="w-50 h-100 d-flex justify-content-start flex-column">
                <img src="${data.avatar ? `data:image/png;base64,${data.avatar}`  : "/static/imgs/avatar_default.png"}" class="pb-3 d-block w-80 h-100 rounded-3 border border-success" id="avatar-image"/>
                <button type="button" class="btn btn-outline-success" id="file-button">Change Avatar</button>
                <input type="file" accept="image/*" class="collapse" id="avatar-input"/>
                <button type="button" class="btn btn-success" id="save-avatar">Save Avatar</button>
            </div>
            <div class="w-50 h-100">
                <form id="username-form" action="" method="POST" class="border border-success rounded-3 p-2 mb-2">
                    {% csrf_token %}
                    <div class="mb-3 d-flex">
                        <div class="col-11">
                            <label for="username" class="form-label text-success">Change Username</label>
                            <input type="text" name="username" class="form-control bg-dark border-success text-success" id="username-field" aria-describedby="emailHelp">
                        </div>
                        <button type="submit" class="col-1 btn btn-success">Save</button>
                    </div>
                </form>
                <form id="password-form" action="" method="POST" class="border border-success rounded-3 p-2">
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
                    </div>
                </form>
                <form action="/" method="PUT" id="two-factor-form" class="border border-success rounded-3 p-2">
                    <div class="mb-3">
                        <label for="2fa-checkbox" class="form-label text-success">Activate Two-Factor Authentication</label>
                        <input type="checkbox" name="two_factor" class="form-check-input bg-dark border-success text-success" id="two-factor-checkbox" ${data.two_factor ? "checked" : ""}>
                    </div>
                    <div class="mb-3 ${data.two_factor ? "" : "collapse"}" id="email-field">
                        <label for="confirm-password" class="form-label text-success">Email</label>
                        <input type="text" name="email" class="form-control bg-dark border-success text-success" id="email" value=${data.email}>
                    </div>
                    <div class="d-flex justify-content-center">
                        <button type="submit" class="btn btn-success">Activate 2FA</button>
                    <div>
                </form>
            </div>
        </div>
        `
    }
}
import AbstractPage from "./AbstractPage.js"

export default class Login extends AbstractPage {
    constructor(title, isValid) {
        super(title);
        this.isValid = isValid;
    }

    static validateEnter(username, password) {
        if (username.length >= 8 && password.length >= 10) {
            window.localStorage.setItem("token", "fakeToken");
            // window.history.pushState(null, null, "/");
            window.location.assign("/")
        } else {
            window.history.replaceState({isValid: false, username: username, password: password}, null, '/login');
            window.location.reload();
        }
    }

    submitForm(event) {
        event.preventDefault();
        const $username = document.querySelector('#username');
        const $password = document.querySelector('#password');
        Login.validateEnter($username.value, $password.value);
    }

    render(masterView) {
        document.title = this.title;
        masterView.innerHTML = this.getHtml();
        if (window.history.state?.username && window.history.state?.password) {
            const $username = document.querySelector('#username');
            const $password = document.querySelector('#password');
            $username.value = window.history.state?.username;
            $password.value = window.history.state?.password;
        }
        const $form = document.querySelector('#login-form');
        $form.addEventListener('submit', this.submitForm);
        window.history.replaceState(null, null, '/login');
    }

    getHtml() {
        this.isValid = window.history.state?.isValid ?? true;
        return `
        <h1 class="text-center text-success">ENDO Pong</h1>
        <div class="w-100 d-flex justify-content-center">
            <div class="w-50 border border-success rounded px-2 py-3">
                <h2 class="text-success text-center">Login</h2>
                <form id='login-form' action="/login" method="POST">
                    {% csrf_token %}
                    <div class="mb-3">
                        <label for="username" class="form-label text-success">Username</label>
                        <input type="text" name="username" class="form-control bg-dark border-success text-success" id="username" aria-describedby="emailHelp">
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label text-success">Password</label>
                        <input type="password" name="password" class="form-control bg-dark border-success text-success" id="password">
                    </div>
                    ${ !this.isValid ?
                    `<span class="d-block text-danger text-center">Invalid username or password</span>` : ""
                    }
                    <div class="d-flex justify-content-between">
                        <button type="submit" class="btn btn-success">Login</button>
                        <span><span class="text-light">Don't have account, </span><a href="/signup" class="text-success">Sign Up</a></span>
                    </div>
                </form>
            </div>
        </div>
        `
    }
}
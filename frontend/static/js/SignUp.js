import Login from "./Login.js"

export default class SignUp extends Login {

    static validateEnter(username, password) {
        if (username.length >= 8 && password.length >= 10) {
            window.localStorage.setItem("token", "fakeToken");
            window.history.pushState(null, null, "/");
            window.location.reload();
        } else {
            window.history.replaceState({isValid: false, username: username, password: password}, null, '/signup');
            window.location.reload();
        }
    }

    submitForm(event) {
        event.preventDefault();
        const $username = document.querySelector('#username');
        const $password = document.querySelector('#password');
        SignUp.validateEnter($username.value, $password.value);
    }

    activateEventHandlers() {
        console.log(window.history.state);
        if (window.history.state?.username && window.history.state?.password) {
            const $username = document.querySelector('#username');
            const $password = document.querySelector('#password');
            $username.value = window.history.state?.username;
            $password.value = window.history.state?.password;
        }
        const $form = document.querySelector('#login-form');
        $form.addEventListener('submit', this.submitForm);
        window.history.replaceState(null, null, '/signup');
    }

    getHtml(){
        document.title = this.title;
        this.isValid = window.history.state?.isValid ?? true;
        return `
        <h1 class="text-center text-success">ENDO Pong</h1>
        <div class="w-100 d-flex justify-content-center">
            <div class="w-50 border border-success rounded px-2 py-3">
                <h2 class="text-success text-center">Sign Up</h2>
                <form id='login-form' action="/signup/" method="POST">
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
                        <button type="submit" class="btn btn-success">Sign Up</button>
                        <span><span class="text-light">Already have an account, </span><a href="/login" class="text-success">Login</a></span>
                    </div>
                </form>
            </div>
        </div>
        `
    }
}
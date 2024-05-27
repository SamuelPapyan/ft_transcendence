import Login from "./Login.js"
import UserService from "./services/UserService.js";

export default class SignUp extends Login {

    static validateEnter(username, password) {
        UserService.createUser({
            username: username,
            password: password,
        }).then(res=>{
            if (res.success) {
                window.location.assign('/login');
            } else {
                window.history.replaceState({isValid: false, username: username, password: password}, null, '/signup');
                window.location.reload();
            }
            
        }).catch(err=>{
            // console.log(err.message);
        })
    }

    submitForm(event) {
        event.preventDefault();
        const $username = document.querySelector('#username');
        const $password = document.querySelector('#password');
        SignUp.validateEnter($username.value, $password.value);
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
        window.history.replaceState(null, null, '/signup');
    }

    getHtml(){
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
                        `<span class="d-block text-danger text-center">This user already exists.</span>` : ""
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
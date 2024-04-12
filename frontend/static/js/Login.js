import AbstractPage from "./AbstractPage.js"

export default class Login extends AbstractPage {
    constructor(title, isValid) {
        super(title);
        this.isValid = isValid;
    }

    formOnSubmit(event){
        event.preventDefault();
    }

    getHtml() {
        document.title = this.title;
        return `
        <h1 class="text-center text-success">ENDO Pong</h1>
        <div class="w-100 d-flex justify-content-center">
            <div class="w-50 border border-success rounded px-2 py-3">
                <h2 class="text-success text-center">Login</h2>
                <form action="/login" method="POST">
                    {% csrf_token %}
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label text-success">Username</label>
                        <input type="text" name="username" class="form-control bg-dark border-success text-success" id="exampleInputEmail1" aria-describedby="emailHelp">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label text-success">Password</label>
                        <input type="password" name="password" class="form-control bg-dark border-success text-success" id="exampleInputPassword1">
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
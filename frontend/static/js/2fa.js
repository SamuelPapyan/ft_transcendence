import AbstractPage from "./AbstractPage.js";
import AuthService from "./services/AuthService.js";

export default class TwoFactor extends AbstractPage{
    constructor(title, isValid) {
        super(title);
        this.user = null;
        this.form = null;
        this.verificationCode = null;
        this.interval = null;
        this.isValid = isValid;
        this.countdown = null;
        this.code = "";
    }

    update(masterView, meta) {
        for (let i in meta) {
            this[i] = meta[i]
        }
        this.render(masterView);
    }

    sendCode(event) {
        event.preventDefault();
        if (this.verificationCode.value === this.code) {
            alert("You are verified")
            clearInterval(this.interval);
            this.verify();
        } else {
            alert("Wrong Code");
        }
    }

    generateCode() {
        let code = ""
        for (let i = 0; i < 10; i++) {
            code += Math.floor(Math.random() * 10);
        }
        this.code = code;
        this.sendMail();
    }

    async verify(){
        try {
            const res = await AuthService.verify2FA({
                username: this.user.username
            });
            if (res.success) {
                window.localStorage.setItem('token', res.data);
                window.location.reload();
            }
        } catch(err) {
            // console.log(err.message);
        }
    }

    intervalPredicator() {
        const num = +this.countdown.innerText;
        this.countdown.innerText = num - 1;
        if (num - 1 == 0) {
            this.countdown.innerText = 30;
            this.generateCode();
        }
    }

    sendMail(){
        emailjs.send('service_tfj5k6p', 'endo_pong_2fa_template', {
            code: this.code,
            reply_to: this.user.email,
        }).then(res=>{

        }).catch(err=>{
            // console.log(err.message);
        })
    }

    startTicking() {
        this.generateCode();
        this.interval = setInterval(this.intervalPredicator.bind(this), 1000);
    }

    startMailService(){
        (function() {
            emailjs.init({
              publicKey: "k831Gmo35__3E55Dq",
            });
        })();
    }

    render(masterView) {
        document.title = this.title;
        masterView.innerHTML = this.getHtml();
        this.form = document.querySelector('#two-factor-form');
        this.verificationCode = document.querySelector('#verification-code');
        this.countdown = document.querySelector('#countdown');
        this.form.addEventListener('submit', this.sendCode.bind(this));
        this.startMailService();
        this.startTicking();
    }

    getHtml() {
        return `
        <h1 class="text-center text-success">ENDO Pong</h1>
        <div class="w-100 d-flex justify-content-center">
            <div class="w-50 border border-success rounded px-2 py-3">
                <h2 class="text-success text-center">2FA Authentication</h2>
                <form id='two-factor-form' action="/login" method="POST">
                    {% csrf_token %}
                    <div class="mb-3">
                        <label for="verification-code" class="form-label text-success">Go to your mail and get verification code.</label>
                        <input type="text" name="username" class="form-control bg-dark border-success text-success" id="verification-code">
                    </div>
                    <h3 id="countdown" class="text-light text-center">30</h3>
                    <div class="d-flex justify-content-between">
                        <button type="submit" class="btn btn-success">Obtain Code</button>
                    </div>
                </form>
            </div>
        </div>
        `;
    }
}
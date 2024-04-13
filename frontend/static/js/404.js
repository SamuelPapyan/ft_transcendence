import AbstractPage from "./AbstractPage.js"
import Menu from "./Menu.js";

export default class Page404 extends AbstractPage {
    constructor(title) {
        super(title);
    }

    render(masterView) {
        document.title = this.title;
        masterView.innerHTML = this.getHtml();
    }

    getHtml() {
        return `
        ${window.localStorage.getItem('token') ? new Menu("404").getHtml() : ""}
        <h1 class="text-center text-success">ENDO Pong</h1>
        <div class="w-100 d-flex justify-content-center">
            <div class="w-50 border border-success rounded px-2 py-3">
                <h2 class="text-danger text-center">Error 404</h2>
                <p class="text-danger text-center">This page is currently not exist.</p>
            </div>
        </div>
        `
    }
}
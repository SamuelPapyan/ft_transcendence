import AbstractPage from "./AbstractPage.js"
import Menu from "./Menu.js";

export default class Page404 extends AbstractPage {
    constructor(title) {
        super(title);
        this.user = null;
        this.menu = null;
    }

    render(masterView) {
        document.title = this.title;
        masterView.innerHTML = this.getHtml();
    }

    update(masterView, meta) {
        for (let i in meta) {
            this[i] = meta[i]
        }
        this.menu = new Menu("404");
        this.menu.injectUser(this.user);
        this.render(masterView);
        this.menu.activateEventHandlers();
    }

    getHtml() {
        return `
        ${window.localStorage.getItem('token') ? this.menu.getHtml() : ""}
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
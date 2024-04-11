import AbstractPage from "./AbstractPage.js";
import Menu from "./Menu.js";
import Home from "./Home.js";

export default class Main extends AbstractPage {
    constructor(title, page){
        super(title);
        this.page = page;
    }

    getHtml() {
        return `
        ${new Menu("home").getHtml()}
        ${this.page === "home" ? new Home().getHtml() : ""}
        `
    }
}
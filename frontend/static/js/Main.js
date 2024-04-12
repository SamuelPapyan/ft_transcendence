import AbstractPage from "./AbstractPage.js";
import Menu from "./Menu.js";
import Home from "./Home.js";
import Profile from "./Profile.js";
import Settings from "./Settings.js";
import Users from "./Users.js";
import Matches from "./Matches.js";
import Matchmaking from "./Matchmaking.js";

export default class Main extends AbstractPage {
    constructor(title, page, user){
        super(title);
        this.page = page;
        this.user = user;
    }

    getHtml() {
        document.title = this.title;
        return `
        ${new Menu(this.page).getHtml()}
        ${this.page === "home" ? new Home().getHtml() : ""}
        ${this.page === "profile" ? new Profile(this.user).getHtml() : ""}
        ${this.page === "settings" ? new Settings(this.user).getHtml() : ""}
        ${this.page === "users" ? new Users(this.user).getHtml() : ""}
        ${this.page === "matches" ? new Matches(this.user).getHtml() : ""}
        ${this.page === "matchmaking" ? new Matchmaking(this.user).getHtml() : ""}
        `
    }
}
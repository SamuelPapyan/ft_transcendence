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
        this.components = {
            'menu': new Menu(this.page),
            'home': new Home(),
            'profile': new Profile(this.user),
            'settings': new Settings(this.user),
            'users': new Users(this.user),
            'matches': new Matches(this.user),
            'matchmaking': new Matchmaking(this.user)
        }
    }

    activateEventHandlers() {
        console.log("activating");
        for (let i in this.components) {
            this.components[i].activateEventHandlers();
        }
    }

    getHtml() {
        document.title = this.title;
        return `
        ${this.components['menu'].getHtml()}
        ${this.components[this.page].getHtml()}
        `
    }
}
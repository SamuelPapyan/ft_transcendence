import AbstractPage from "./AbstractPage.js";
import Menu from "./Menu.js";
import Home from "./Home.js";
import Profile from "./Profile.js";
import Settings from "./Settings.js";
import Users from "./Users.js";
import Matches from "./Matches.js";
import Matchmaking from "./Matchmaking.js";
import Pong from "./Pong.js";

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
            'matchmaking': new Matchmaking(this.user),
            'pong': new Pong(this.user),
        }
    }

    render(masterView) {
        document.title = this.title;
        masterView.innerHTML = this.getHtml();
        this.components['menu'].activateEventHandlers();
        this.components[this.page].activateEventHandlers();
    }

    getHtml() {
        return `
        ${this.components['menu'].getHtml()}
        ${this.components[this.page].getHtml()}
        `
    }
}
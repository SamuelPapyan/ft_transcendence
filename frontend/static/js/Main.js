import AbstractPage from "./AbstractPage.js";
import Menu from "./Menu.js";
import Home from "./Home.js";
import Profile from "./Profile.js";
import Settings from "./Settings.js";
import Users from "./Users.js";
import Matches from "./Matches.js";
import Matchmaking from "./Matchmaking.js";
import Pong from "./Pong.js";
import viewDataHelper from "./viewDataHelper.js";
import Chat from "./Chat.js";

export default class Main extends AbstractPage {
    constructor(title, page){
        super(title);
        this.page = page;
        this.user = null;
        this.components = {
            'menu': new Menu(this.page),
            'home': new Home(),
            'profile': new Profile(),
            'settings': new Settings(),
            'users': new Users(),
            'matches': new Matches(this.user),
            'matchmaking': new Matchmaking(),
            'pong': new Pong(this.user),
            'chat': new Chat()
        }
    }

    update(masterView, meta) {
        for (let i in meta) {
            this[i] = meta[i]
        }
        this.render(masterView);
    }

    render(masterView) {
        document.title = this.title;
        this.components['menu'].injectUser(this.user);
        this.components[this.page].injectUser(this.user);
        this.components['chat'].injectUser(this.user);
        viewDataHelper(this.page).then(res=>{
            if (res) {
                const dataSet = {
                    menu: null,
                    chat: null,
                }
                dataSet[this.page] = res;
                masterView.innerHTML = this.getHtml(dataSet);
                this.components['menu'].activateEventHandlers();
                this.components[this.page].activateEventHandlers();
                this.components['chat'].activateEventHandlers();
            } else {
                // console.log("Not OK.");
            }
        }).catch(err=>{
            console.log(err.message);
            console.log(err);
        })
    }

    getHtml(dataSet) {
        return `
        ${this.components['menu'].getHtml(dataSet.menu)}
        ${this.components[this.page].getHtml(dataSet[this.page])}
        ${this.components['chat'].getHtml(dataSet.chat)}
        `
    }
}
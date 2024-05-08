export default class AbstractComponent{
    constructor() {
        this.user = null;
    }

    activateEventHandlers() {
    }

    injectUser(user){
        this.user = user;
    }

    getHtml(data) {
        return ``;
    }
}
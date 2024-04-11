export default class AbstractPage {
    constructor(title) {
        document.title = title;
    }

    getHtml(){
        return ""
    }
}
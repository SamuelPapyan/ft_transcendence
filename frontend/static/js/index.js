import Login from "./Login.js";
import Main from "./Main.js";
import SignUp from "./SignUp.js";

const views = {
    "/login": new Login("Login", true),
    "/": new Main("Home", "home"),
    "/signup": new SignUp("Sign Up", true),
}

const master = document.getElementById('master');

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
}

function handleLocation() {
    const path = window.location.pathname;
    const html = views[path].getHtml();
    master.innerHTML = html;
}

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
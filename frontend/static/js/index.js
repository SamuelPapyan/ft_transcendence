import Login from "./Login.js";
import Main from "./Main.js";
import SignUp from "./SignUp.js";
import Page404 from "./404.js";

const views = {
    "/login": new Login("Login", true),
    "/": new Main("Home", "home", "sampap"),
    "/signup": new SignUp("Sign Up", true),
    "/profile": new Main("Profile", "profile", "sampap"),
    "/settings": new Main("Settings", "settings", "sampap"),
    "/users" : new Main("Users", "users", "sampap"),
    "/matches" : new Main("Matches", "matches", "sampap"),
    "/matchmaking" : new Main("Matchmaking", "matchmaking", "sampap"),
    404: new Page404("Page not found"),
}

const master = document.getElementById('master');

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
}

function handleLocation() {
    let html;
    const path = window.location.pathname;
    if (views[path])
        html = views[path].getHtml();
    else
        html = views[404].getHtml();
    console.log(html);
    master.innerHTML = html;
}

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
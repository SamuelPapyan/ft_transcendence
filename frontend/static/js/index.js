import Login from "./Login.js";
import Main from "./Main.js";
import SignUp from "./SignUp.js";
import Page404 from "./404.js";

const localData = {
    latestUrlBeforeLogout : "/",
}

const protectedRoutes = [
    '/',
    "/profile",
    "/settings",
    "/users",
    "/matches",
    "/matchmaking",
]

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
    let path = window.location.pathname;
    if ((protectedRoutes.includes(path) && window.localStorage.getItem("token"))
        || (!protectedRoutes.includes(path) && !window.localStorage.getItem("token"))) {
        if (views[path]) {
            html = views[path].getHtml();
        }
        else
            html = views[404].getHtml();
        master.innerHTML = html;
        views[path].activateEventHandlers();
    }
    else if (!protectedRoutes.includes(path) && window.localStorage.getItem("token")) {
        window.history.replaceState(null, null, '/');
        window.location.reload();
    }
    else {
        window.history.replaceState(null, null, '/login');
        window.location.reload();
    }
}

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
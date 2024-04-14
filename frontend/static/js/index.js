import Login from "./Login.js";
import Main from "./Main.js";
import SignUp from "./SignUp.js";
import Page404 from "./404.js";

const localData = {
    latestUrlBeforeLogout : "/",
}

const routes = {
    "/login": {
        view: new Login("Login", true),
        protected: false,
    },
    "/": {
        view: new Main("Home", "home", "sampap"),
        protected: true,
    },
    "/signup": {
        view: new SignUp("Sign Up", true),
        protected: false,
    },
    "/profile": {
        view: new Main("Profile", "profile", "sampap"),
        protected: true,
    },
    "/settings": {
        view: new Main("Settings", "settings", "sampap"),
        protected: true,
    },
    "/users" : {
        view: new Main("Users", "users", "sampap"),
        protected: true,
    },
    "/matches" : {
        view: new Main("Matches", "matches", "sampap"),
        protected: true,
    },
    "/matchmaking" : { 
        view: new Main("Matchmaking", "matchmaking", "sampap"),
        protected: true,
    },
    "/pong" : {
        view: new Main("Pong", "pong", "sampap"),
        protected: true,
    },
    404: {
        view: new Page404("Page not found"),
    }
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
    if (routes[path]) {
        if ((routes[path].protected && window.localStorage.getItem("token"))
            || (!routes[path].protected && !window.localStorage.getItem("token"))) {
            routes[path].view.render(master);
        }
        else if (!routes[path].protected && window.localStorage.getItem("token")) {
            window.history.replaceState(null, null, '/');
            window.location.reload();
        }
        else {
            window.history.replaceState(null, null, '/login');
            window.location.reload();
        }
    }
    else {
        routes[404].view.render(master);
    }
}

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
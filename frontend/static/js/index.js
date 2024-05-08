import Login from "./Login.js";
import Main from "./Main.js";
import SignUp from "./SignUp.js";
import Page404 from "./404.js";
import AuthService from "./services/AuthService.js";

const localData = {
    latestUrlBeforeLogout : "/",
}

const routes = {
    "/login": {
        view: new Login("Login", true),
        protected: false,
    },
    "/": {
        view: new Main("Home", "home"),
        protected: true,
    },
    "/signup": {
        view: new SignUp("Sign Up", true),
        protected: false,
    },
    "/profile": {
        view: new Main("Profile", "profile"),
        protected: true,
    },
    "/settings": {
        view: new Main("Settings", "settings"),
        protected: true,
    },
    "/users" : {
        view: new Main("Users", "users"),
        protected: true,
    },
    "/matches" : {
        view: new Main("Matches", "matches"),
        protected: true,
    },
    "/matchmaking" : { 
        view: new Main("Matchmaking", "matchmaking"),
        protected: true,
    },
    "/pong" : {
        view: new Main("Pong", "pong"),
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
    AuthService.getProfile().then(res=>{
        if (res.data) {
            if (routes[path]) {
                if (routes[path].protected) {
                    routes[path].view.update(master, {
                        user: res.data
                    });
                } else {
                    window.history.replaceState(null, null, '/');
                    window.location.reload();
                }
            } else {
                routes[404].view.update(master, {
                    user: res.data
                });
            }
        } else {
            if (window.localStorage.getItem("token")) {
                window.localStorage.removeItem("token");
                window.history.replaceState(null, null, '/login');
                window.location.reload();
            } else {
                if (routes[path]) {
                    if (!routes[path].protected) {
                        routes[path].view.render(master);
                    } else {
                        window.history.replaceState(null, null, '/login');
                        window.location.reload();
                    }
                } else {
                    routes[404].view.render(master);
                }
            }
        }
    }).catch((err)=>{
        console.log(err.message);
        console.log(err);
    })
}

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
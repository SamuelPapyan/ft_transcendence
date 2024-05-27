import Login from "./Login.js";
import Main from "./Main.js";
import SignUp from "./SignUp.js";
import Page404 from "./404.js";
import AuthService from "./services/AuthService.js";
import { Client } from "./client/Client.js";
import TwoFactor from "./2fa.js";
import verify42User, {getQueryParams} from "./42_api.js";
import MatchService from "./services/MatchService.js";

let client = new Client(location.origin);

const localData = {
    latestUrlBeforeLogout : "/",
}

const routes = {
    "/login": {
        view: new Login("Login", true),
        protected: false,
    },
    "/login/": {
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
    "/signup/": {
        view: new SignUp("Sign Up", true),
        protected: false,
    },
    "/profile": {
        view: new Main("Profile", "profile"),
        protected: true,
    },
    "/profile/": {
        view: new Main("Profile", "profile"),
        protected: true,
    },
    "/settings": {
        view: new Main("Settings", "settings"),
        protected: true,
    },
    "/settings/": {
        view: new Main("Settings", "settings"),
        protected: true,
    },
    "/users" : {
        view: new Main("Users", "users"),
        protected: true,
    },
    "/users/" : {
        view: new Main("Users", "users"),
        protected: true,
    },
    "/matches" : {
        view: new Main("Matches", "matches"),
        protected: true,
    },
    "/matches/" : {
        view: new Main("Matches", "matches"),
        protected: true,
    },
    "/matchmaking" : { 
        view: new Main("Matchmaking", "matchmaking"),
        protected: true,
    },
    "/matchmaking/" : { 
        view: new Main("Matchmaking", "matchmaking"),
        protected: true,
    },
    "/pong" : {
        view: new Main("Pong", "pong"),
        protected: true,
    },
    "/pong/" : {
        view: new Main("Pong", "pong"),
        protected: true,
    },
    "/matchmaking/tournament": {
        view: new Main("Tournament Making", "matchmaking-tournament"),
        protected: true,
    },
    "/matchmaking/tournament/": {
        view: new Main("Tournament Making", "matchmaking-tournament"),
        protected: true,
    },
    "/2fa": {
        view: new TwoFactor("2FA authentication", true),
        protected: false,
    },
    "/2fa/": {
        view: new TwoFactor("2FA authentication", true),
        protected: false,
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

export function handleLocation() {
    const path = window.location.pathname;
    if (window.localStorage.getItem("token")) {
        AuthService.getProfile().then(async(res)=>{
            if (res.data) {
                if (res.data.two_factoring && path != "/2fa") {
                    window.history.replaceState(null, null, '/2fa');
                    window.location.reload();
                } else {
                    if (routes[path]) {
                        if (path == "/2fa" && res.data.two_factoring) {
                            routes["/2fa"].view.update(master, {
                                user: res.data
                            });
                        }
                        else if (routes[path].protected) {
                            const hasMatch = (await MatchService.hasOngoinMatch(res.data.username)).data;
                            if (path == '/pong' && !hasMatch) {
                                window.history.replaceState(null, null, '/matchmaking');
                                window.location.reload();
                            } else if (['/matchmaking', '/matchmaking/tournament'].includes(path) && hasMatch) {
                                window.history.replaceState(null, null, '/pong');
                                window.location.reload();
                            } else {
                                routes[path].view.update(master, {
                                    user: res.data
                                });
                            }
                        } else {
                            window.history.replaceState(null, null, '/');
                            window.location.reload();
                        }
                    } else {
                        routes[404].view.update(master, {
                            user: res.data
                        });
                    }
                }
            } else {
                if (window.localStorage.getItem("token")) {
                    window.localStorage.removeItem("token");
                    window.history.replaceState(null, null, '/login');
                    window.location.reload();
                }
            }
        }).catch((err)=>{
            // console.log(err.message);
        })
    } else {
        if (routes[path]) {
            if (!routes[path].protected && path !== '/2fa') {
                routes[path].view.render(master);
            } else if (path == '/' && Object.keys(getQueryParams()).length) {
                verify42User();
            } else {
                window.history.replaceState(null, null, '/login');
                window.location.reload();
            }
        } else {
            routes[404].view.render(master);
        }
    }
}

window.onpopstate = handleLocation;
window.route = route;

handleLocation();

export {client}
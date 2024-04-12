import AbstractComponent from "./AbstractComponent.js";

export default class Menu extends AbstractComponent{
    constructor(selectedPage) {
        super();
        this.selectedPage = selectedPage;
    }

    getHtml() {
        return `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
            <a class="navbar-brand" href="/">
                <h1 class="text-center text-success">ENDO Pong</h1>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link ${this.selectedPage === 'home' ? "active" : "" }" aria-current="page" href="/">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link ${this.selectedPage === 'users' ? "active" : "" }" aria-current="page" href="/users">Users</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link ${this.selectedPage === 'matches' ? "active" : "" }" href="/matches">Matches</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    me
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown" style="z-index: 1021;">
                    <li><a class="dropdown-item" href="/profile">My Profile</a></li>
                    <li><a class="dropdown-item" href="/settings">Settings</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="/login">Logout</a></li>
                    </ul>
                </li>
                </ul>
            </div>
            </div>
        </nav>
        `;
    }
}
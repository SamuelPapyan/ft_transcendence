import { MatchMakingClient } from "./MatchMakingClient.js";

function getCookie(name) {
    let cookie = {};
    document.cookie.split(';').forEach((el)=>{
        let split = el.split('=')
        cookie[split[0].trim()] = split.slice(1).join('=')
    })
    return cookie[name];
}

class Client {
    constructor(url) {
        this._url = url;
        this.matchmaking = new MatchMakingClient(this);
    }

    async isAuthenticated() {
        if (this._logged == undefined)
            this._logged = await this._test_logged();
        return this._logged;
    }

    async _get(uri, data) {
        let response = await fetch(this._url + uri, {
            method: "GET",
            body: JSON.stringify(data),
        });
        return response;
    }

    async _post(uri, data) {
        let response = await fetch(this._url + uri, {
			method: "POST",
			headers: {
                "Accept": "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
        return response;
    }

    async _delete(uri, data) {
        let response = await fetch(this._url + uri, {
			method: "DELETE",
			headers: {
                "Accept": "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
        return response;
    }

    async _put(uri, data) {
        let response = await fetch(this._url + uri, {
			method: "PUT",
			headers: {
                "Accept": "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
        return response;
    }

    async _patch_json(uri, data)
    {
        let response = await fetch(this._url + uri, {
			method: "PATCH",
			headers: {
                "Accept": "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
        return response;
    }

    async _patch_file(uri, file)
    {
        let response = await fetch(this._url + uri, {
			method: "PATCH",
			body: file,
		});
        return response;
    }
}

export {Client}
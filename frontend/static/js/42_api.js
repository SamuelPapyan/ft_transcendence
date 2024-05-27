import AuthService from "./services/AuthService.js";

export function getQueryParams() {
    const params = {}
    let search = location.search.slice(1);
    if (search) {
        const entries = search.split('&')
        for (let entry of entries) {
            const [key, value] = entry.split('=')
            params[key] = value;
        }
    }
    return params;
}

export default async function verify42User() {
    const params = getQueryParams();
    if (params.code) {
        try {
            const res = await AuthService.loginVia42({
                code: params.code
            })
            if (res) {
                window.localStorage.setItem('token', res);
                window.history.replaceState(null, null, '/')
                window.location.reload()
            } else {
                window.history.replaceState(null, null, '/login')
                window.location.reload();
            }
        } catch (err){
            // console.log(err.message);
        }
    }
}
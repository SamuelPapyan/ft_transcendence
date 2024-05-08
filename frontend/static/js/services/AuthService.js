export default class AuthService {
    static async login(data) {
        return new Promise(function(resolve, reject) {
            fetch(`http://localhost:8000/api/token`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Accept': "application/json",
                    'Content-Type': "application/json"
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                const mute = err;
                reject(err);
            })
        })
    }

    static async getProfile() {
        return new Promise(function(resolve, reject) {
            fetch(`http://localhost:8000/api/token`, {
                headers: {
                    'Accept': "application/json",
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${window.localStorage.getItem('token')}`
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        })
    }
}
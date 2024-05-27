export default class UserService {
    static async getUsers(data) {
        return new Promise(function(resolve, reject) {
            fetch(`http://localhost:8000/api/users/all`
            ).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        })
    }
    
    static async getUserByUsername(username) {
        return new Promise(function(resolve, reject) {
            fetch(`http://localhost:8000/api/users/${username}`
            ).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        })
    }

    static async createUser(data) {
        return new Promise((resolve, reject)=>{
            fetch(`http://localhost:8000/api/users/create`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        })
    }

    static getUserMatchHistory(username) {
        return new Promise(function(resolve, reject) {
            fetch(`http://localhost:8000/api/matches/${username}`,{
                headers:{
                    'Authorization': `Bearer ${window.localStorage.getItem('token')}`
                }
            }
            ).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        })
    }

    static getFriends(username) {
        return new Promise(function(resolve, reject) {
            fetch(`http://localhost:8000/api/friends/${username}`,{
                headers:{
                    'Authorization': `Bearer ${window.localStorage.getItem('token')}`
                }
            }
            ).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        })
    }

    static getFriendRequests(username) {
        return new Promise(function(resolve, reject) {
            fetch(`http://localhost:8000/api/friends/fr/${username}`,{
                headers:{
                    'Authorization': `Bearer ${window.localStorage.getItem('token')}`
                }
            }
            ).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        })
    }

    static async updateUsername(data) {
        return new Promise((resolve, reject)=>{
            fetch(`http://localhost:8000/api/users/username`, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": window.localStorage.getItem('token'),
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        })
    }

    static async updatePassword(data) {
        return new Promise((resolve, reject)=>{
            fetch(`http://localhost:8000/api/users/password`, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": window.localStorage.getItem('token'),
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        })
    }

    static async changeAvatar(username, formData) {
        return new Promise((resolve, reject)=>{
            fetch(`http://localhost:8000/api/users/avatar/${username}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    "Authorization": window.localStorage.getItem('token'),
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        })
    }
}
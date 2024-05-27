export default class FriendsService {
    static async getSentRequests(username) {
        return new Promise(function(resolve, reject) {
            fetch(`http://localhost:8000/api/friends/sent/${username}`,{
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
    
    static async sendFriendRequest(data) {
        return new Promise(function(resolve, reject) {
            fetch(`http://localhost:8000/api/friends/send`,{
                method: 'POST',
                body: JSON.stringify(data),
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
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

    static async acceptFriendRequest(data) {
        return new Promise(function(resolve, reject) {
            fetch(`http://localhost:8000/api/friends/accept`,{
                method: 'POST',
                body: JSON.stringify(data),
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
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
    
    static async rejectFriendRequest(data) {
        return new Promise(function(resolve, reject) {
            fetch(`http://localhost:8000/api/friends/reject`,{
                method: 'POST',
                body: JSON.stringify(data),
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
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

    static async removeFriend(data) {
        return new Promise(function(resolve, reject) {
            fetch(`http://localhost:8000/api/friends/remove`,{
                method: 'DELETE',
                body: JSON.stringify(data),
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
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
}
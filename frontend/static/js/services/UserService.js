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
}
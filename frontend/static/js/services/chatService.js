export default class ChatService {
    static async hasDM(data) {
        return new Promise(function(resolve, reject) {
            fetch(`http://10.19.203.198:8000/api/chat/dm/has?sender=${data.sender}&to=${data.to}`,{
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            }
            ).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        })
    }

    static async createDM(data) {
        return new Promise((resolve, reject)=>{
            fetch(`http://10.19.203.198:8000/api/chat/dm`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        })
    }
}
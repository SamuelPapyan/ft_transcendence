export default class MatchService {
    static async hasOngoinMatch(username) {
        return new Promise(function(resolve, reject){
            fetch(`http://10.19.203.198:8000/api/matches/ongoing/${username}`
            ).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        })
    }
    static async getOngoingMatches() {
        return new Promise(function(resolve, reject){
            fetch(`http://10.19.203.198:8000/api/matches/ongoing`, {
                headers: {
                    "Authorization": `Bearer ${window.localStorage.getItem('token')}`
                }
            }
            ).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                // console.log(err.message);
                reject(err);
            })
        })
    }
}
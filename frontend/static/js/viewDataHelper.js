import MatchService from "./services/MatchService.js";
import UserService from "./services/UserService.js";

export default async function viewDataHelper(page) {
    return new Promise((resolve, reject)=>{
        try {
            if (page == "users") {
                UserService.getUsers().then(res=>{
                    resolve(res);
                }).catch(()=>{
                    resolve(null);
                })
            }
            else if (page == "matches") {
                MatchService.getOngoingMatches().then(res=>{
                    resolve(res);
                }).catch((err)=>{
                    console.log(err.message);
                    resolve(null);
                })
            }
            else {
                resolve({});
            }
        } catch (err) {
            reject(err);
        }
    })
}
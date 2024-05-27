import MatchService from "./services/MatchService.js";
import UserService from "./services/UserService.js";
import FriendsService from "./services/FriendsService.js";

export default async function viewDataHelper(page, username) {
    return new Promise(async(resolve, reject)=>{
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
                    // console.log(err.message);
                    resolve(null);
                })
            }
            else if (page == "profile") {
                const res = {}
                try {
                    const profileUser = window.history.state ? window.history.state.username : username
                    res.userData = await UserService.getUserByUsername(profileUser);
                    res.matchHistory = await UserService.getUserMatchHistory(profileUser);
                    res.friends = (await UserService.getFriends(profileUser)).data;
                    res.friendRequests = (await UserService.getFriendRequests(profileUser)).data;
                    res.sentRequests = (await FriendsService.getSentRequests(profileUser)).data;
                    resolve(res);
                } catch (err) {
                    // console.log(err.message);
                    reject(err);
                }
                
                UserService.getUserMatchHistory(profileUser).then(res=>{
                    resolve(res);
                }).catch(()=>{
                    resolve(null);
                })
            } else if (page === "settings"){
                try {
                    const res = await UserService.getUserByUsername(username);
                    resolve(res);
                } catch (err) {
                    // console.log(err.message);
                    reject(err);
                }
            }
            else {
                resolve({});
            }
        } catch (err) {
            reject(err);
        }
    })
}
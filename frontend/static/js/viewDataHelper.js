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
            else {
                resolve({});
            }
        } catch (err) {
            reject(err);
        }
    })
}
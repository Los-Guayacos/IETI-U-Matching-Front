const URL = "https://u-match.herokuapp.com/api/v1/matching/"
const local = "http://localhost:8080/api/v1/matching/"
class MatchServices{

    fetchMatches(token){
        return fetch(local + "fetchAll", {
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":token
            }
        })
    }

    likeUser(token, userId){
        return fetch(local + "likeUser?userId=" + userId, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":token
            }
        })
    }

    unmatch(token, userId){
        return fetch(local + "unmatch?unmatchId=" + userId, {
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":token
            }
        })
    }
}

export default new MatchServices();
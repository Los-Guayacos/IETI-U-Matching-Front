const URL = "https://u-matching.herokuapp.com/api/v1/matching/"
const local = "http://localhost:8080/api/v1/matching/"
class MatchServices{

    fetchMatches(token){
        return fetch(URL + "fetchAll", {
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":token
            }
        })
    }

    likeUser(token, userId){
        return fetch(URL + "likeUser?userId=" + userId, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":token
            }
        })
    }

    unmatch(token, userId){
        return fetch(URL + "unmatch?unmatchId=" + userId, {
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":token
            }
        })
    }
}

export default new MatchServices();
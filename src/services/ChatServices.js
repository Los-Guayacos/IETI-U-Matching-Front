const URL = "https://u-matching.herokuapp.com/"
const local = "http://localhost:8080/"

class ChatServices {

    retrieveMessages(token, receiver, limit) {
        return fetch(URL + "retrieveMessages?receiver=" + receiver + "&limit=" + limit, {
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":token
            }
        })
    }

    retrieveAllMessages(token, matches){
        return fetch(URL + "retrieveAllMessages", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":token
            },
            body:JSON.stringify(matches)
        })
    }

    sendMessage(msg, token) {
        return fetch(URL + "send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization":token
            },
            body: JSON.stringify(msg)
        })
    }
}

export default new ChatServices();
const URL = "https://u-match.herokuapp.com/"
const local = "http://localhost:8080/"

class ChatServices {

    retrieveMessages(token, receiver, limit) {
        return fetch(local + "retrieveMessages?receiver=" + receiver + "&limit=" + limit, {
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":token
            }
        })
    }

    retrieveAllMessages(token, matches){
        return fetch(local + "retrieveAllMessages", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":token
            },
            body:JSON.stringify(matches)
        })
    }

    sendMessage(msg, token) {
        return fetch(local + "send", {
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
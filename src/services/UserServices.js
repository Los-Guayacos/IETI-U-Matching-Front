const URL = "https://u-match.herokuapp.com/api/v1/"
const local = "http://localhost:8080/api/v1/"

class UserServices {

    createUser(user) {
        return fetch(URL + "createUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        })
    }

    fetchAll(limit, token) {
        return fetch(URL + "fetchAll?limit=" + limit, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
    }

    fetchCustom(limit, filters, token) {
        return fetch(URL + "fetchCustom?limit=" + limit, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(filters)
        })
    }

    findUserByEmail(email) {
        return fetch(URL + "findUserByEmail?email=" + email, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
    }

    updateUser(user, token) {
        return fetch(URL + "updateUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(user)
        })
    }

    rateUser(token, userId, rate) {
        return fetch(URL + "rateUser?userId=" + userId + "&rate=" + rate, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
    }
}

export default new UserServices();
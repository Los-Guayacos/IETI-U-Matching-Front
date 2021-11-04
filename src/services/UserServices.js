const URL = "https://u-match.herokuapp.com/api/v1/"
const local = "http://localhost:8080/api/v1/"

class UserServices {

    createUser(user) {
        return fetch(local + "createUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        })
    }

    fetchAll(limit, token) {
        return fetch(local + "fetchAll?limit=" + limit, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
    }

    fetchCustom(limit, filters, token) {
        return fetch(local + "fetchCustom?limit=" + limit, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(filters)
        })
    }

    findUserByEmail(email) {
        return fetch(local + "findUserByEmail?email=" + email, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
    }

    updateUser(user, token) {
        return fetch(local + "updateUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(user)
        })
    }

    rateUser(token, userId, rate) {
        return fetch(local + "rateUser?userId=" + userId + "&rate=" + rate, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
    }
}

export default new UserServices();
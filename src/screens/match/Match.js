import React, { useEffect, useState } from "react"
import { MatchList, Chat, NavBar } from "../../components"
import MatchServices from "../../services/MatchServices"
import firebase from "firebase"
import "firebase/auth"

export default function Match() {

    const [matches, setMatches] = useState([]);
    const [currentChat, setCurrentChat] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            fetchMatches();
        }, 1000)
    }, [])

    const fetchMatches = () => {
        firebase.auth().currentUser.getIdToken()
            .then((token) => {
                MatchServices.fetchMatches(token)
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        if (data) {
                            setMatches(data);
                        }
                        setCurrentChat(data[0]);
                        setLoading(false);
                    })
                    .catch(error => console.log(error))
            })
            .catch(error => console.log(error))
    }

    if (!loading) {
        return (
            <div style={{ display: "flex", height: "100vh", backgroundColor: "#333333" }}>
                <NavBar />
                {
                    matches && matches.length > 0 ?
                        <Chat fetchMatches={fetchMatches} matches={matches} currentChat={currentChat} />
                        :
                        <div className="col-10 h-100 my-auto mt-auto" style={{ alignItems: "center" }}>
                            <label className="text-center text-light mx-auto mt-5 d-block">Empieza a usar la app para tener matches</label>
                        </div>
                }
            </div>
        )
    } else {
        return (
            <div style={{ height: "100vh", display: "flex" }}>
                <NavBar />
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 d-flex align-items-center">
                    <div className="mx-auto spinner-border" role="status"></div>
                </div>
            </div>
        )
    }
}
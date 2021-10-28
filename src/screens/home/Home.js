import React, { useState, useContext, useEffect } from "react"
import { UserCard, NavBar, UserInfo, MatchMenu } from "../../components/index"
import firebase from "firebase";
import { useHistory, useLocation } from "react-router-dom";
import UserServices from "../../services/UserServices";
import MatchServices from "../../services/MatchServices";
import Matching from "../card/Matching";

const db = [
    {
      name: 'Luffy',
      url: './img/luffy.jpg',
      description: 'El rey de los piratas'
    },
    {
      name: 'Fuque es re bambaro',
      url: './img/jorgito.jpg',
      description: 'Chupalooo!'
    },
    {
      name: 'Bandida de Indigo',
      url: './img/indigo.jpg',
      description: 'Mamá luchona'
    },
    {
      name: 'Bandida de Roots',
      url: './img/roots.jpg',
      description: 'De medallo bebé'
    },
    {
      name: 'Bandida de Tierra bomba',
      url: './img/tierrab.jpg',
      description: 'Me gustan colombianos'
    }
  ]

export default function Home() {

    const history = useHistory();
    const location = useLocation();
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0);
    const [limit, setLimit] = useState(10);
    const [filters, setFilters] = useState({
        age: 25,
        gender: "Todos",
        interests: false,
        college: "",
        program: "",
        rating: 5
    });

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                fetchUsers(limit);

                //history.push("/login")
            } else {
                fetchUsers(limit);
            }
        })
    }, []);

    useEffect(() => {
        setCurrentUser(users[index]);
    }, [index])

    const fetchUsers = (limit) => {
        setLoading(false);
        setUsers(db);
        /*let updatedFilters = location.state ? location.state.filter : filters;
        setFilters(updatedFilters);
        firebase.auth().currentUser.getIdToken()
            .then((token) => {
                UserServices.fetchCustom(limit, updatedFilters, token)
                    .then(res => res.json())
                    .then(data => {
                        if (data) {
                            data = data.filter(user => user.pictures);
                            setUsers(data);
                            setCurrentUser(data[index]);
                            setLoading(false);
                        }
                    }).catch(error => console.log(error));
            }).catch(error => console.log(error));*/
    }

    const prevUser = () => {
        if (index > 0) {
            setIndex(index - 1);
        } else {
            setIndex(users.length - 1)
        }
    }

    const nextUser = () => {
        if (index < users.length - 1) {
            setIndex(index + 1);
        } else {
            setIndex(0);
        }
    }

    const likeUser = () => {
        firebase.auth().currentUser.getIdToken()
            .then((token) => {
                MatchServices.likeUser(token, currentUser.uid)
                    .then(res => res.text())
                    .then(data => {
                        if (data == "true") {
                            document.getElementById("modalButton").click();
                        } else {
                            console.log(data);
                        }
                        nextUser();
                        setUsers(users.splice(index, index))
                        console.log(data);
                    })
                    .catch(error => console.log(error));
            })
            .catch(error => console.log(error))
    }

    if (!loading && users.length <= 0) {
        return (
            <div>
                No hay usuarios
            </div>
        )
    } else if (!loading) {
        return (
            <div>
                <Matching db = {db}/>
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
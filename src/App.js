import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from "react"
import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom"
import { Home, Login, Register, Profile, Match, FilterSelection } from "./screens/index"
import { NavBar } from './components/index';
import PrivateRoute from './navigation/PrivateRoute';
import firebase from "firebase"
import UserContext from "./persistence/UserContext"
import { firebaseConfig } from "./firebase/firebaseConfig"

function App() {

    const [userId, setUserId] = useState();

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setUserId(user.uid);
            }
        })
    }, [])

    return (
        <UserContext.Provider value={userId}>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <PrivateRoute exact path="/chat" component={Match} />
                    <Route exact path="/register" component={Register} />
                    <PrivateRoute exact path="/" component={Home} />
                    <PrivateRoute exact path="/profile" component={Profile} />
                    <PrivateRoute exact path="/filter" component={FilterSelection} />
                </Switch>
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;

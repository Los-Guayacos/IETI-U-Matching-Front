import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom"
import { Home, Login, Register, Profile} from "./screens/index"
import PrivateRoute from './navigation/PrivateRoute';
import firebase from "firebase"
import { useEffect } from 'react';
import { useState } from 'react';
import UserContext from "./persistence/UserContext"

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
                    {/* <Route exact path="/login" component={Login} />
                    <PrivateRoute exact path="/chat" component={Match} />
                    <Route exact path="/register" component={Register} />
                    <PrivateRoute exact path="/" component={Home} /> */}
                    <PrivateRoute exact path="/profile" component={Profile} />
                </Switch>
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;

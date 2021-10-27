import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom";
import { Home, Login, Register, Profile } from "./screens/index";
import PrivateRoute from "./navigation/PrivateRoute";
import { useEffect } from "react";
import { useState } from "react";
import UserContext from "./persistence/UserContext";
import firebase from "firebase";
import firebaseConfig from "./firebase/firebaseConfig"
import Matching from "./screens/card/Matching";

import './App.css'

function App() {
  const [userId, setUserId] = useState();

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
  }, []);

  return (
    <div className='app'>
      <Matching />
    </div>
    /*<UserContext.Provider value={userId}>
      <BrowserRouter>
        <Switch>
          {/* <Route exact path="/login" component={Login} />
                    <PrivateRoute exact path="/chat" component={Match} />
                    <Route exact path="/register" component={Register} /> */
                    /*<PrivateRoute exact path="/" component={Home} />
                    <PrivateRoute exact path="/matching" component={Matching} />
          <PrivateRoute exact path="/profile" component={Profile} />
        </Switch>
      </BrowserRouter>
    </UserContext.Provider>*/
  );
}

export default App;

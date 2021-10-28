import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom";
import { Home, Register, Profile } from "./screens/index";
import Login from "./pages/Login";
import PrivateRoute from "./navigation/PrivateRoute";
import { useEffect } from "react";
import { useState } from "react";
import UserContext from "./persistence/UserContext";
import firebase from "firebase";
import firebaseConfig from "./firebase/firebaseConfig";

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
    <UserContext.Provider value={userId}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={Home} />
          <Route exact path="/profile" component={Profile} />
        </Switch>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;

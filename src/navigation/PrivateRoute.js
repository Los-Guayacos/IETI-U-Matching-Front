import React from "react"
import { Redirect, Route } from "react-router-dom"
import firebase from "firebase"

const PrivateRoute = ({component: Component, ...rest}) => (
   
    <Route
        {...rest}
        render = {
            props => true ? ( //firebase.auth().currentUser ? (
                    <Component {...props} />
                ) : (
                    <Redirect 
                        to = {{
                            pathname: "/login",
                        }}
                    />
            )
        }
    />
)

export default PrivateRoute;
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom";
import firebase from "firebase/app"
import "firebase/auth"

export default function Login() {

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                history.push("/");
            }
            setLoading(false);
        })
    }, [])

    function login(e) {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            .then((userCredential) => {
                var user = userCredential.user;
                history.push("/");
            })
            .catch((error) => {
                if (error.code == "auth/user-not-found") {
                    alert("Datos no encontrados");
                } else if (error.code == "auth/too-many-requests") {
                    alert("Demasiados intentos fallidos, intenta mas tarde");
                } else if (error.code == "auth/wrong-password") {
                    alert("Usuario o contraseña incorrectos")
                }
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(error.code);
            });
    }

    const handleData = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    if (!loading) {

        return (
            <form
                className="align-items-center justify-content-center mx-auto"
                style={{
                    backgroundColor: "#242424",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column"
                }}
                onSubmit={(e) => login(e)}
            >
                <div>
                    <h1 className="text-center text-light">U-MATCH</h1>
                    <span className="d-block text-center text-light">Encuentra tu pareja perfecta</span>
                </div>

                <div className="mt-3 mx-auto p-3" style={{ backgroundColor: "brown", width: "300px", borderRadius: "10px" }}>
                    <label className="text-light text-center d-block">Correo electrónico</label>
                    <input
                        placeholder="ejempli@ejemplo.com"
                        className="form-control text-center"
                        type="email"
                        autoComplete="email"
                        name="email"
                        value={user.email || ""}
                        onChange={(e) => handleData(e)}
                        required
                    />
                    <label className="text-light text-center d-block">Contraseña</label>
                    <input
                        placeholder="password"
                        className="form-control text-center"
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        value={user.password || ""}
                        onChange={(e) => handleData(e)}
                        required
                    />
                </div>

                <div className="mt-3" style={{ width: "300px" }}>
                    <button style={{ backgroundColor: "brown" }} type="submit" className="btn text-light rounded btn-block">Ingresar</button>
                </div>

                <div className="mt-5">
                    <span className="d-block text-light text-center">¿No tienes cuenta?</span>
                    <a className="text-underline text-danger d-block text-center" href="/register">Registrarse</a>
                </div>

                <div className="position-absolute" style={{ bottom: 10, right: 10 }}>
                    <i className="text-light d-block">Desarrollado por <a className="text-danger" target="_blank" href="https://www.instagram.com/johann_cepeda/">Johann Cepeda</a> Version 0.7</i>
                </div>

            </form>
        )
    } else {
        return (
            <div style={{ height: "100vh", display: "flex" }}>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 d-flex align-items-center">
                    <div className="mx-auto spinner-border" role="status"></div>
                </div>
            </div>
        )
    }
}
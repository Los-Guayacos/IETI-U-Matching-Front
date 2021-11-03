import React, { useState } from "react"
import { useEffect } from "react";
import { useHistory } from "react-router";
import firebase from "firebase"
import UserServices from "../../services/UserServices"

export default function Register() {

    const [user, setUser] = useState({ program: "Ingeniería de Sistemas", gender: "Hombre", college: "Escuela Colombiana de Ingeniería Julio Garavito" });
    const [validPsw, setValidPsw] = useState("");
    const [step, setStep] = useState(0);
    const history = useHistory();


    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                history.push("/")
            } else {
                setStep(0);
            }
        })
    }, [])

    function register(e) {
        e.preventDefault();
        //COMPROBAR LA DIRECCION DE CORREO ELECTRONICO
        if (step == 0) {
            console.log(user);
            UserServices.findUserByEmail(user.email)
                .then(res => {
                    if (res)
                        res.json()
                }
                )
                .then(data => {
                    console.log(data);
                    if (data) {
                        alert("El email registrado ya se encuentra en uso");
                    } else {
                        setStep(1);
                    }
                }).catch(error => console.log(error));

            //ENVIAR VERIFICACION DE CORREO ELECTRONICO
        } else if (step == 1) {
            //userRef.sendEmailVerification();
            setStep(2);
            //CREAR USUARIO CON EMAIL && PASSWORD
        } else if (step == 2) {
            if (user.password == validPsw) {
                firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                    .then(userCredential => {
                        var userRef = userCredential.user;
                        let finalUser = user;
                        finalUser.uid = userRef.uid;
                        UserServices.createUser(finalUser)
                            .then(() => {
                                history.push("/profile");
                            }).catch(error => console.log(error))
                    })
                    .catch(error => console.log(error));
            } else {
                alert("Las contraseñas deben coincidir");
            }
        }
    }


    const handleData = (e) => {
        e.preventDefault();
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    return (
        <form
            className="align-items-center justify-content-center mx-auto"
            style={{
                backgroundColor: "#242424",
                height: "100vh",
                display: "flex",
                flexDirection: "column"
            }}
            onSubmit={(e) => register(e)}
        >
            <div>
                <h1 className="text-center text-light">U-MATCH</h1>
                <span className="d-block text-center text-light">Encuentra tu pareja perfecta</span>
            </div>

            {
                step == 0 &&
                <div className="mt-3 mx-auto p-3" style={{ backgroundColor: "brown", width: "300px", borderRadius: "10px" }}>
                    <label className="text-light text-center d-block">Nombre y apellido</label>
                    <input
                        placeholder="Pepito Perez"
                        className="form-control text-center"
                        type="text"
                        autoComplete="none"
                        name="fullName"
                        value={user.fullName || ""}
                        onChange={(e) => handleData(e)}
                        required
                    />

                    <label className="mt-1 text-light text-center d-block">Universidad</label>
                    <select
                        onChange={(e) => handleData(e)}
                        defaultValue="Escuela Colombiana de Ingeniería Julio Garavito"
                        className="form-control"
                        name="college"
                    >
                        <option value="Escuela Colombiana de Ingeniería Julio Garavito">Escuela Colombiana de Ingeniería Julio Garavito</option>
                    </select>

                    <label className="text-light text-center d-block">Programa Académico</label>
                    <select
                        onChange={(e) => handleData(e)}
                        defaultValue="Ingeniería de Sistemas"
                        className="form-control"
                        name="program"
                    >
                        <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                        <option value="Ingeniería Mecánica">Ingeniería Mecánica</option>
                        <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                        <option value="Ingeniería Biomédica">Ingeniería Biomédica</option>
                        <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
                        <option value="Ingeniería Eléctrica">Ingeniería Eléctrica</option>
                        <option value="Economía">Economía</option>
                        <option value="Administración de empresas">Administración de empresas</option>
                        <option value="Matemáticas">Matemáticas</option>
                    </select>
                    <label className="text-light text-center d-block">Semestre</label>
                    <input
                        min={1}
                        max={10}
                        placeholder="5"
                        className="form-control text-center"
                        type="number"
                        autoComplete="none"
                        name="semester"
                        value={user.semester || ""}
                        onChange={(e) => handleData(e)}
                        required
                    />
                    <label className="text-light text-center d-block">Correo electrónico</label>
                    <input
                        placeholder="nombre.apellido"
                        className="form-control text-center"
                        type="email"
                        autoComplete="email"
                        name="email"
                        value={user.email || ""}
                        onChange={(e) => handleData(e)}
                        required
                    />
                </div>
            }

            {
                step == 1 &&
                <div className="mt-3 mx-auto p-3" style={{ backgroundColor: "brown", width: "300px", borderRadius: "10px" }}>
                    <label className="text-light text-center d-block">Edad</label>
                    <input
                        min={16}
                        max={99}
                        placeholder="18"
                        className="form-control text-center"
                        type="number"
                        name="age"
                        value={user.age || ""}
                        onChange={(e) => handleData(e)}
                        required
                    />

                    <label className="text-light text-center d-block">Decripción</label>
                    <textarea
                        placeholder="Cuentanos un poco sobre ti..."
                        maxLength={150}
                        style={{ resize: "none", height: "80px" }}
                        className="form-control text-center"
                        type="text"
                        name="description"
                        value={user.description || ""}
                        onChange={(e) => handleData(e)}
                        required
                    />

                    <label className="mt-1 text-light text-center d-block">Genero</label>
                    <select
                        onChange={(e) => handleData(e)}
                        defaultValue="Hombre"
                        className="form-control"
                        name="gender"
                    >
                        <option value="Hombre">Hombre</option>
                        <option value="Mujer">Mujer</option>
                        <option value="Otro">Otro</option>
                    </select>

                    <label className="text-light text-center d-block">Instagram (opcional)</label>
                    <input
                        placeholder="@username"
                        className="form-control text-center"
                        type="text"
                        name="instagram"
                        value={user.instagram || ""}
                        onChange={(e) => handleData(e)}
                    />

                    <label className="text-light text-center d-block">Whatsapp (opcional)</label>
                    <input
                        placeholder="123456789"
                        className="form-control text-center"
                        type="number"
                        name="whatsapp"
                        value={user.whatsapp || ""}
                        onChange={(e) => handleData(e)}
                    />
                </div>
            }

            {
                step == 2 &&
                <div className="mt-3 mx-auto p-3" style={{ backgroundColor: "brown", width: "300px", borderRadius: "10px" }}>
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

                    <label className="text-light text-center d-block">Repetir contraseña</label>
                    <input
                        placeholder="password"
                        className="form-control text-center"
                        type="password"
                        autoComplete="current-password"
                        value={validPsw || ""}
                        onChange={(e) => setValidPsw(e.target.value)}
                        required
                    />
                </div>
            }

            <div className="mt-3" style={{ width: "300px" }}>
                <button
                    style={{ backgroundColor: "brown" }}
                    type="submit"
                    className="btn text-light rounded btn-block"
                >
                    {step != 2 ? "Continuar" : "Ingresar"}
                </button>
            </div>

            {
                step == 0 &&
                <div className="mt-3 mx-auto">
                    <label className="text-light text-center d-block">¿Ya tienes cuenta?</label>
                    <a className="text-center d-block text-light" href="/login">Iniciar sesión</a>
                </div>
            }
        </form>
    )
}
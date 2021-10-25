import React, { useState } from "react"
import "./Navbar.css"
import firebase from "firebase"
import { useHistory } from "react-router-dom"
import { IconButton } from "@material-ui/core"
import ExpandMore from "@material-ui/icons/MenuTwoTone"

export default function NavBar() {

    const history = useHistory();
    const [visible, setVisible] = useState(true);

    const navigate = (path) => {
        history.push(path);
    }

    const signOut = () => {
        history.push("/login");
        firebase.auth().signOut();
    }

    return (
        <div
            className={!visible ? "col-10 col-xs-10 col-sm-10 col-md-2 col-lg-2 col-lg-2 col-xl-2 customNav" : "col-2 customNav"}
        >
            <IconButton
                onClick={() => setVisible(!visible)}
                className="mx-auto d-block d-xs-block d-sm-block d-md-none d-lg-none d-xl-none"
            >
                <ExpandMore
                    color="secondary"
                />
            </IconButton>
            <div id="navbar"
                className={visible ? "d-none d-md-block d-lg-block d-xl-block customNav" : "customNav"}>
                <div>
                    <button
                        className="text-light btn mx-auto w-100"
                        onClick={() => navigate("/")}
                    >
                        <h2 style={{ color: "#f03535" }}>U-MATCH</h2>
                    </button>
                </div>
                <div className="item mt-3">
                    <button
                        className="text-light btn mx-auto w-100"
                        onClick={() => navigate("/")}
                    >
                        Inicio
                    </button>
                </div>
                <div className="item mt-1">
                    <button
                        className="text-light btn mx-auto w-100"
                        onClick={() => navigate("/profile")}
                    >
                        Mi Perfil
                    </button>
                </div>
                <div className="item mt-1">
                    <button
                        className="text-light btn mx-auto w-100"
                        onClick={() => navigate("/filter")}
                    >
                        Filtros
                    </button>
                </div>
                <div className="item mt-1">
                    <button
                        className="text-light btn mx-auto w-100"
                        onClick={() => navigate("/chat")}
                    >
                        Chat
                    </button>
                </div>
                <div className="item mt-1">
                    <button
                        className="text-light btn mx-auto w-100"
                    >
                        Ayuda
                    </button>
                </div>
                <div className="logout">
                    <button
                        className="text-light btn mx-auto w-100"
                        onClick={() => signOut()}
                    >
                        Cerrar Sesion
                    </button>
                </div>
            </div>
        </div>
    )
}
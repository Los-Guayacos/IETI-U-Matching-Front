import React, { useEffect } from "react"
import { useState } from "react"
import { NavBar, Tag } from "../../components/index"
import { colors } from "../../constants/index"
import UserServices from "../../services/UserServices"
import IconButton from "@material-ui/core/IconButton";
import Rating from "react-rating";
import EmptyStar from "../../assets/star.png"
import FullStar from "../../assets/fullStar.png"
import Garbage from "@material-ui/icons/Delete";
import firebase from "firebase"
import "firebase/auth"
import "firebase/storage"
import { Animated } from "react-animated-css"
import AspectRatio from "react-aspect-ratio"

export default function Profile(props) {

    const [user, setUser] = useState({});
    const [editable, setEditable] = useState(false);
    const [currentTag, setCurrentTag] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [interests, setInterets] = useState([]);
    const [uploading, setUploading] = useState([false, false, false]);

    /**
     * Traer usuario al cargar el componente
     */
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                UserServices.findUserByEmail(firebase.auth().currentUser.email)
                    .then(res => res.json())
                    .then(data => {
                        if (data) {
                            setUser(data);
                            setLoading(false);
                            setSelectedFiles(data.pictures || []);
                            setInterets(data.interests || []);
                        }
                    }).catch(error => console.log(error));
            } else {
                console.log('no auth')
            }
        })
    }, [])

    const handleEdit = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const addNewTag = (e) => {
        e.preventDefault();
        let interests = user.interests || [];
        if (currentTag != "") {
            let modifed = currentTag[0].toUpperCase() + currentTag.toLowerCase().slice(1, currentTag.length);
            interests.push({ name: modifed });
        }

        setCurrentTag("");
        setInterets(interests);
        setUser({ ...user, interests: interests });
    }

    const deleteTag = (i) => {
        let interestsCopy = user.interests;
        if (i > -1) {
            interestsCopy.splice(i, 1);
        }
        setInterets(interestsCopy);
        setUser({ ...user, interests: interestsCopy })
    }

    const updateUser = (e, newUser) => {
        if (e) {
            e.preventDefault();
        }
        setLoading(true);
        firebase.auth().currentUser.getIdToken()
            .then((token) => {
                UserServices.updateUser(newUser, token)
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        if (data) {
                            setUser(data);
                        }
                        setEditable(false);
                        setLoading(false);
                    })
                    .catch(error => console.log(error))
            }).catch(error => console.log(error));
    }

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        const files = selectedFiles;

        firebase.storage().ref("users").child("pictures").child(user.uid).child(file.name).put(file)
            .then(res => {
                res.ref.getDownloadURL()
                    .then(url => {
                        files.push({ url: url, name: file.name });
                        setSelectedFiles(files);
                        let updatedUser = user;
                        updatedUser.pictures = files;
                        updateUser(null, updatedUser);
                    }).catch(error => console.log(error));
            }).catch(error => console.log(error))
    }

    const changuePicture = (e, index) => {
        const file = e.target.files[0];
        const oldFile = selectedFiles[index];
        const files = selectedFiles;
        const status = uploading;
        status[index] = true;
        setUploading(status);
        //Eliminar antigua foto
        firebase.storage().ref("users").child("pictures").child(user.uid).child(oldFile.name).delete()
            .then(res => {
                console.log(res);
                //Agregar nueva foto
                firebase.storage().ref("users").child("pictures").child(user.uid).child(file.name).put(file)
                    .then(res => {
                        res.ref.getDownloadURL()
                            .then(url => {
                                files[index] = { url: url, name: file.name };
                                setSelectedFiles(files);
                                let updatedUser = user;
                                updatedUser.pictures = files;
                                updateUser(null, updatedUser);
                                status[index] = false;
                                setUploading(status);
                            }).catch(error => console.log(error));
                    }).catch(error => console.log(error))
            }).catch(error => console.log(error));
    }

    if (!loading) {

        return (
            <div style={{ height: "100vh", display: "flex" }}>
                <NavBar />
                <form
                    style={{ overflowY: "scroll", backgroundColor: colors.third, color: "white" }}
                    className="p-5 col-xs-12 col-sm-12 col-md-12 col-lg-10"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <Animated animationIn="bounceInUp" animationOut="bounceInDown" isVisible={true}>
                        <h1 style={{ color: colors.secondary }}>Tu información</h1>
                        <div className="mt-5 row">
                            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                                <label style={{ color: colors.secondary }}>Nombre</label>
                                <input
                                    className="form-control col-11"
                                    onChange={(e) => handleEdit(e)}
                                    disabled={!editable}
                                    style={{
                                        background: editable ? colors.light : colors.primary,
                                        color: editable ? colors.dark : colors.light
                                    }}
                                    name="fullName"
                                    value={user.fullName || ""}
                                />

                                <label className="mt-1" style={{ color: colors.secondary }}>Correo electrónico</label>
                                <input
                                    className="form-control col-11"
                                    onChange={(e) => handleEdit(e)}
                                    disabled={true}
                                    style={{
                                        background: colors.primary,
                                        color: colors.light
                                    }}
                                    name="email"
                                    value={user.email || ""}
                                />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                                <label className="d-block" style={{ color: colors.secondary }}>Edad</label>
                                <input
                                    className="form-control col-6"
                                    onChange={(e) => handleEdit(e)}
                                    type="number"
                                    disabled={!editable}
                                    style={{
                                        background: editable ? colors.light : colors.primary,
                                        color: editable ? colors.dark : colors.light
                                    }}
                                    name="age"
                                    value={user.age || ""}
                                />

                                <label className="d-block" style={{ color: colors.secondary }}>Semestre</label>
                                <input
                                    className="form-control col-6"
                                    onChange={(e) => handleEdit(e)}
                                    type="number"
                                    min={0}
                                    max={10}
                                    disabled={!editable}
                                    style={{
                                        background: editable ? colors.light : colors.primary,
                                        color: editable ? colors.dark : colors.light
                                    }}
                                    name="semester"
                                    value={user.semester || ""}
                                />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <label className="d-block" style={{ color: colors.secondary }}>Universidad</label>
                                <input
                                    className="form-control col-10"
                                    onChange={(e) => handleEdit(e)}
                                    disabled={!editable}
                                    style={{
                                        background: editable ? colors.light : colors.primary,
                                        color: editable ? colors.dark : colors.light
                                    }}
                                    name="college"
                                    value={user.college || ""}
                                />
                                <label className="d-block" style={{ color: colors.secondary }}>Programa</label>
                                <input
                                    className="form-control col-10"
                                    onChange={(e) => handleEdit(e)}
                                    disabled={!editable}
                                    style={{
                                        background: editable ? colors.light : colors.primary,
                                        color: editable ? colors.dark : colors.light
                                    }}
                                    name="program"
                                    value={user.program || ""}
                                />
                            </div>
                        </div>
                        {/* Estilo */}
                        <div className="mt-5">
                            <h1 style={{ color: colors.secondary }}>Tu estilo</h1>
                            <div className="row mx-auto">
                                {
                                    user.pictures &&
                                    user.pictures.map((picture, key) => (
                                        <div key={key} className="mx-auto">
                                            <div style={{ height: "300px", display: "flex", width: "300px" }}>
                                                <img
                                                    src={picture.url}
                                                    className="img-fluid d-block mx-auto my-auto"
                                                    alt="Responsive image"
                                                    style={{ maxHeight: "300px" }}
                                                />
                                            </div>
                                            {
                                                editable &&
                                                <div>
                                                    <input
                                                        id={"selectFile" + (key + 1)}
                                                        type="file"
                                                        style={{ display: "none" }}
                                                        onChange={(e) => changuePicture(e, key)}
                                                    />
                                                    {
                                                        !uploading[key] ?
                                                            <button
                                                                className="mt-3 btn btn-danger pl-5 pr-5 d-block mx-auto"
                                                                onClick={() => document.getElementById("selectFile" + (key + 1)).click()}
                                                            >
                                                                Cambiar
                                                            </button>
                                                            : <h1>Cargando...</h1>
                                                    }
                                                </div>
                                            }
                                        </div>
                                    ))

                                }
                                {
                                    !selectedFiles[0] &&
                                    <div>
                                        <img
                                            className="img-fluid m-3 d-block"
                                            style={{ width: "300px", height: "350px" }}
                                        />
                                        <input
                                            id="selectFile1"
                                            type="file"
                                            style={{ display: "none" }}
                                            onChange={(e) => handleFileInput(e)}
                                        />
                                        {
                                            !uploading[0] ?
                                                <button
                                                    type="button"
                                                    className="btn btn-danger d-block mx-auto"
                                                    onClick={() => document.getElementById("selectFile1").click()}
                                                >
                                                    Seleccionar
                                                </button>

                                                :
                                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 d-flex align-items-center">
                                                    <div className="mx-auto spinner-border" role="status"></div>
                                                </div>
                                        }
                                    </div>
                                }
                                {
                                    !selectedFiles[1] &&
                                    <div>
                                        <img
                                            className="img-fluid m-3 d-block"
                                            style={{ width: "300px", height: "350px" }}
                                        />
                                        <input
                                            id="selectFile2"
                                            type="file"
                                            style={{ display: "none" }}
                                            onChange={(e) => handleFileInput(e)}
                                        />
                                        {
                                            !uploading[1] ?
                                                <button
                                                    type="button"
                                                    className="btn btn-danger d-block mx-auto"
                                                    onClick={() => document.getElementById("selectFile2").click()}
                                                >
                                                    Seleccionar
                                                </button>

                                                :
                                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 d-flex align-items-center">
                                                    <div className="mx-auto spinner-border" role="status"></div>
                                                </div>
                                        }
                                    </div>
                                }
                                {
                                    !selectedFiles[2] &&
                                    <div>
                                        <img
                                            className="img-fluid m-3 d-block"
                                            style={{ width: "300px", height: "350px" }}
                                        />
                                        <input
                                            id="selectFile3"
                                            type="file"
                                            style={{ display: "none" }}
                                            onChange={(e) => handleFileInput(e)}
                                        />
                                        {
                                            !uploading[2] ?
                                                <button
                                                    type="button"
                                                    className="btn btn-danger d-block mx-auto"
                                                    onClick={() => document.getElementById("selectFile3").click()}
                                                >
                                                    Seleccionar
                                                </button>

                                                :
                                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 d-flex align-items-center">
                                                    <div className="mx-auto spinner-border" role="status"></div>
                                                </div>
                                        }
                                    </div>
                                }

                            </div>
                        </div>

                        {/* Intereses */}
                        <div className="mt-5">
                            <h1 style={{ color: colors.secondary }}>Tu perfil</h1>
                            <div className="row mt-3">
                                {
                                    user.interests && user.interests.length > 0 &&
                                    interests.map((item, i) => (
                                        <div key={i} className="row mx-auto">
                                            <Tag name={item.name} />
                                            {
                                                editable &&
                                                <IconButton
                                                    color="inherit"
                                                    aria-label="upload picture"
                                                    component="span"
                                                    onClick={(e) => deleteTag(i)}
                                                >
                                                    <Garbage />
                                                </IconButton>
                                            }
                                        </div>
                                    ))
                                }
                                <div className="col-12 row mx-auto mt-5">
                                    <input
                                        className="form-control col-6 mx-auto"
                                        onChange={(text) => setCurrentTag(text.target.value)}
                                        value={currentTag || ""}
                                        style={{
                                            background: editable ? colors.light : colors.primary,
                                            color: editable ? colors.dark : colors.light
                                        }}
                                        placeholder="¿Que estas buscando o que te interesa? (Amor, Amigos, Gatos)"
                                        maxLength={15}
                                        autoCapitalize="words"
                                        disabled={!editable}
                                    />

                                    <button
                                        onClick={(e) => addNewTag(e)}
                                        className="btn btn-danger mr-auto col-3"
                                        disabled={!editable}
                                        type="button"
                                    >
                                        Agregar
                                    </button>
                                </div>
                            </div>
                            <label className="text-light text-center d-block mt-5">Decripción</label>
                            <textarea
                                placeholder="Cuentanos un poco sobre ti..."
                                maxLength={150}
                                style={{
                                    resize: "none",
                                    height: "80px",
                                    background: editable ? colors.light : colors.primary,
                                    color: editable ? colors.dark : colors.light
                                }}
                                className="form-control text-center col-12 col-md-10 col-xl-10 col-lg-10 mx-auto"
                                type="text"
                                name="description"
                                value={user.description || ""}
                                disabled={!editable}
                                onChange={(e) => setUser({ ...user, description: e.target.value })}
                                required
                            />
                        </div>

                        {/* Ranking */}
                        <div className="mt-5 mx-auto">
                            <h1 style={{ color: colors.secondary }}>Tu calificación</h1>
                            <Rating
                                emptySymbol={<img src={EmptyStar} style={{ width: 25 }} />}
                                fullSymbol={<img src={FullStar} style={{ width: 25 }} />}
                                readonly
                                initialRating={user.rating || 0}
                            />
                            <strong className="text-light ml-5">{user.totalRatings}</strong>
                        </div>
                        <div className="mt-5">
                            {
                                !editable ?
                                    <button
                                        className="btn d-block mx-auto btn-danger w-50"
                                        onClick={() => setEditable(true)}
                                        type="button"
                                    >
                                        Editar información
                                    </button>
                                    :
                                    <button
                                        className="btn d-block mx-auto btn-primary w-50"
                                        onClick={(e) => updateUser(e, user)}
                                        type="submit"
                                    >
                                        Actualizar información
                                    </button>
                            }
                        </div>
                    </Animated>
                </form>
            </div >
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

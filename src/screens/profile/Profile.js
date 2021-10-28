import React, { useEffect } from "react";
import { useState } from "react";
import { NavBar, Tag } from "../../components/index";
import { colors } from "../../constants/index";
import UserServices from "../../services/UserServices";
import IconButton from "@material-ui/core/IconButton";
import Rating from "react-rating";
import EmptyStar from "../../assets/star.png";
import FullStar from "../../assets/fullStar.png";
import Garbage from "@material-ui/icons/Delete";
import firebase from "firebase";
import "firebase/auth";
import "firebase/storage";
import AspectRatio from "react-aspect-ratio";
import { TextField } from "@material-ui/core";
import CustomTextField from "../../components/forms/CustomTextField";

const initialStateUser = {
  name: "",
  lastName: "",
  username: "",
  passwordHash: "",
  email: "",
  gender: "",
  address: "",
  age: "",
  university: "",
  carreer: "",
  program: "",
};

export default function Profile(props) {
  const [user, setUser] = useState(initialStateUser);
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
    let email = "";
    // UserServices.findUserByEmail(email)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (data) {
    //       setUser(data);
    //       setLoading(false);
    //       setSelectedFiles(data.pictures || []);
    //       setInterets(data.interests || []);
    //     }
    //   })
    //   .catch((error) => console.log(error));
    //setUser({ email: "email" });
    setLoading(false);
    setSelectedFiles([]);
    setInterets([]);
  }, []);

  const handleEdit = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const addNewTag = (e) => {
    e.preventDefault();
    let interests = user.interests || [];
    if (currentTag != "") {
      let modifed =
        currentTag[0].toUpperCase() +
        currentTag.toLowerCase().slice(1, currentTag.length);
      interests.push({ name: modifed });
    }

    setCurrentTag("");
    setInterets(interests);
    setUser({ ...user, interests: interests });
  };

  const deleteTag = (i) => {
    let interestsCopy = user.interests;
    if (i > -1) {
      interestsCopy.splice(i, 1);
    }
    setInterets(interestsCopy);
    setUser({ ...user, interests: interestsCopy });
  };

  const updateUser = (e, newUser) => {
    if (e) {
      e.preventDefault();
    }
    setLoading(true);
    firebase
      .auth()
      .currentUser.getIdToken()
      .then((token) => {
        UserServices.updateUser(newUser, token)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data) {
              setUser(data);
            }
            setEditable(false);
            setLoading(false);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    const files = selectedFiles;

    firebase
      .storage()
      .ref("users")
      .child("pictures")
      .child(user.uid)
      .child(file.name)
      .put(file)
      .then((res) => {
        res.ref
          .getDownloadURL()
          .then((url) => {
            files.push({ url: url, name: file.name });
            setSelectedFiles(files);
            let updatedUser = user;
            updatedUser.pictures = files;
            updateUser(null, updatedUser);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  const changuePicture = (e, index) => {
    const file = e.target.files[0];
    const oldFile = selectedFiles[index];
    const files = selectedFiles;
    const status = uploading;
    status[index] = true;
    setUploading(status);
    //Eliminar antigua foto
    firebase
      .storage()
      .ref("users")
      .child("pictures")
      .child(user.uid)
      .child(oldFile.name)
      .delete()
      .then((res) => {
        console.log(res);
        //Agregar nueva foto
        firebase
          .storage()
          .ref("users")
          .child("pictures")
          .child(user.uid)
          .child(file.name)
          .put(file)
          .then((res) => {
            res.ref
              .getDownloadURL()
              .then((url) => {
                files[index] = { url: url, name: file.name };
                setSelectedFiles(files);
                let updatedUser = user;
                updatedUser.pictures = files;
                updateUser(null, updatedUser);
                status[index] = false;
                setUploading(status);
              })
              .catch((error) => console.log(error));
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  if (!loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex" }}>
        {/* <NavBar /> */}
        <form
          style={{
            overflowY: "scroll",
            backgroundColor: colors.light,
            color: "white",
            width: "100vw",
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <h1 style={{ color: colors.secondary, textAlign: "center" }}>
              Tu información
            </h1>
            <div style={{ padding: "20px" }}>
              <CustomTextField
                label="Nombres"
                name="name"
                value={user.name}
                onChange={handleEdit}
              />
              <CustomTextField
                label="Apellidos"
                name="lastName"
                value={user.lastName}
                onChange={handleEdit}
              />
              <CustomTextField
                label="Nombre de usuario"
                name="username"
                value={user.username}
                onChange={handleEdit}
              />
              <CustomTextField
                label="Genero"
                name="gender"
                value={user.gender}
                onChange={handleEdit}
              />
            </div>
          </div>
        </form>
      </div>
    );
  } else {
    return (
      <div style={{ height: "100vh", display: "flex" }}>
        <NavBar />
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 d-flex align-items-center">
          <div className="mx-auto spinner-border" role="status"></div>
        </div>
      </div>
    );
  }
}

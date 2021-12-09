import React, { useState, useContext, useEffect } from "react";
import { UserCard, NavBar, UserInfo, MatchMenu } from "../../components/index";
import firebase from "firebase";
import { useHistory, useLocation } from "react-router-dom";
import UserServices from "../../services/UserServices";
import MatchServices from "../../services/MatchServices";
import { Animated } from "react-animated-css";

export default function Home() {
  const history = useHistory();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({
    age: 25,
    gender: "Todos",
    interests: false,
    college: "",
    program: "",
    rating: 5,
  });

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        history.push("/login");
      } else {
        fetchUsers(limit);
      }
    });
  }, []);

  useEffect(() => {
    setCurrentUser(users[index]);
  }, [index]);

  const fetchUsers = (limit) => {
    setLoading(true);
    let updatedFilters = location.state ? location.state.filter : filters;
    setFilters(updatedFilters);
    firebase
      .auth()
      .currentUser.getIdToken()
      .then((token) => {
        UserServices.fetchCustom(limit, updatedFilters, token)
          .then((res) => res.json())
          .then((data) => {
            if (data) {
              data = data.filter((user) => user.pictures);
              setUsers(data);
              setCurrentUser(data[index]);
              setLoading(false);
            }
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  const prevUser = () => {
    if (index > 0) {
      setIndex(index - 1);
    } else {
      setIndex(users.length - 1);
    }
  };

  const nextUser = () => {
    if (index < users.length - 1) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  };

  const likeUser = () => {
    firebase
      .auth()
      .currentUser.getIdToken()
      .then((token) => {
        MatchServices.likeUser(token, currentUser.uid)
          .then((res) => res.text())
          .then((data) => {
            if (data == "true") {
              document.getElementById("modalButton").click();
            } else {
              console.log(data);
            }
            nextUser();
            setUsers(users.filter((user) => user.uid !== currentUser.uid));
            console.log(data);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  if (!loading && users.length <= 0) {
    return (
      <div style={{ height: "100vh", backgroundColor: "#333333" }}>
        <div style={{ display: "flex" }} className="h-100">
          <NavBar />
          <button
            id="modalButton"
            type="button"
            className="d-none"
            data-toggle="modal"
            data-target="#exampleModal"
          ></button>
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Nuevo Match &#10084;
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  Ahora puedes chatear con tu match y formar una nueva relación
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 d-flex align-items-center">
            <label className="text-center text-light d-block mx-auto">
              Tus filtros no concuerdan con ningun usuario, intenta ser mas
              abierto
              <button
                className="btn btn-danger d-block mx-auto mt-5"
                onClick={() => history.push("/filter")}
              >
                Ir a filtros
              </button>
            </label>
          </div>
        </div>
      </div>
    );
  } else if (!loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          height: "auto",
          backgroundColor: "#333333",
        }}
      >
        <div style={{ display: "flex" }} className="h-100">
          <NavBar />
          {!loading && (
            <div>
              <UserCard user={currentUser} />
              <MatchMenu
                likeUser={likeUser}
                prevUser={prevUser}
                nextUser={nextUser}
              />
            </div>
          )}
          <UserInfo user={currentUser} />

          <button
            id="modalButton"
            type="button"
            className="d-none"
            data-toggle="modal"
            data-target="#exampleModal"
          ></button>
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Nuevo Match &#10084;
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  Ahora puedes chatear con tu match y formar una nueva relación
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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

import React, { useEffect, useLayoutEffect, useState } from "react"
import IconButton from "@material-ui/core/IconButton";
import Update from "@material-ui/icons/Update"
import Send from "@material-ui/icons/Send";
import Close from "@material-ui/icons/Close";
import firebase from "firebase"
import ChatServices from "../../services/ChatServices"
import { colors } from "../../constants/index"
import { Animated } from "react-animated-css";
import Settings from "@material-ui/icons/Settings"
import Rating from "react-rating";
import EmptyStar from "../../assets/star.png"
import FullStar from "../../assets/fullStar.png"
import MatchServices from "../../services/MatchServices";
import UserServices from "../../services/UserServices";

var stompClient = null;
export default function Chat(props) {

    const [matches, setMatches] = useState(props.matches || []);
    const [chatMessages, setChatMessages] = useState({});
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState("");
    const [newMessage, setNewMessage] = useState();
    const [currentChat, setCurrentChat] = useState(props.currentChat || {});
    const [limit, setLimit] = useState(20);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        if (props.currentChat) {
            setCurrentChat(props.currentChat);
            setTimeout(() => {
                retrieveAllMessages();
            }, 1000);
        }

    }, [])

    useEffect(() => {
        connect();
    }, [firebase.auth().currentUser])

    useEffect(() => {
        retrieveMessages(currentChat);
    }, [limit])

    useLayoutEffect(() => {
        if (newMessage && chatMessages[newMessage.authorId]) {
            let fullMessages = chatMessages;
            let oldMessages = fullMessages[newMessage.authorId];
            if (!oldMessages.includes(newMessage)) {
                oldMessages.push(newMessage);
            }
            fullMessages[newMessage.authorId] = oldMessages;
            setChatMessages(fullMessages);
            setNewMessage(null);
            autoScroll();
        } else {
            console.log("Message received from new match")
            props.fetchMatches();
        }
    }, [newMessage])

    const autoScroll = () => {
        var element = document.getElementById("scrollChat");
        if (element)
            element.scrollTop = element.scrollHeight;
    }

    const connect = () => {
        const Stomp = require("stompjs");
        var SockJS = require("sockjs-client");
        SockJS = new SockJS("https://u-match.herokuapp.com/ws");
        stompClient = Stomp.over(SockJS);
        stompClient.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        console.log("connected");

        stompClient.subscribe(
            "/user/" + firebase.auth().currentUser.uid + "/queue/messages",
            onMessageReceived
        );
    };

    let onError = (e) => {
        setLoading(true);
        console.log(e);
    }

    let onMessageReceived = (msg) => {
        let newMessage = JSON.parse(msg.body);
        setNewMessage(newMessage);
        autoScroll();
    }

    const retrieveAllMessages = () => {
        firebase.auth().currentUser.getIdToken()
            .then(token => {
                ChatServices.retrieveAllMessages(token, matches)
                    .then(res => res.json())
                    .then(data => {
                        setChatMessages(data);
                        setLoading(false);
                        autoScroll();
                        setLimit(20);
                    })
                    .catch(error => console.log(error));
            })
            .catch(error => console.log(error))
    }

    const retrieveMessages = (currentChat) => {
        setLoading(true);
        setCurrentChat(currentChat);
        firebase.auth().currentUser.getIdToken()
            .then(token => {
                ChatServices.retrieveMessages(token, currentChat.userId, limit)
                    .then(res => res.json())
                    .then(data => {
                        let fullMessages = chatMessages || {};
                        let retrievedMessages = [];
                        data.map((item, i) => {
                            retrievedMessages.push(item);
                        })
                        fullMessages[currentChat.userId] = retrievedMessages;
                        setChatMessages(fullMessages);
                        setLoading(false);
                    }).catch(error => console.log(error))
            })
            .catch(error => console.log(error))
    }

    const handleData = (e) => {
        let text = e.target.value.replace("\n", "")
        setText(text);
    }

    const handleKeys = (e) => {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            handleSendMesage();
        }
    }

    const handleSendMesage = () => {
        if (text.trim() !== "") {
            let oldMessages = chatMessages[currentChat.userId];
            let message = {
                authorId: firebase.auth().currentUser.uid,
                authorName: "Owner",
                receiver: currentChat.userId,
                receiverName: currentChat.fullName,
                date: new Date().toDateString(),
                content: text
            }
            //Send message for web sockets
            stompClient.send("/app/chat", {}, JSON.stringify(message));
            oldMessages.push(message);
            firebase.auth().currentUser.getIdToken()
                .then((token) => {
                    ChatServices.sendMessage(message, token)
                        .then(res => {
                            if (res.status == '200') {
                                setText("");
                                //setChatMessages(oldMessages);
                                autoScroll();
                            } else {
                                console.log("Mensaje no enviado");
                            }
                        })
                        .catch(error => console.log(error))
                })
                .catch(error => console.log(error))
        }
    }

    const unMatch = () => {
        setLoading(true);
        firebase.auth().currentUser.getIdToken()
        .then(token => {
            MatchServices.unmatch(token, currentChat.userId)
            .then(res => res.json())
            .then(data => {
                if(data){
                    setMatches(data);
                }
                alert("Match cancelado");
                setShowOptions(false);
                setCurrentChat(data[0] || null);
                setLoading(false);
            }).catch(error => console.log(error))
        }).catch(error => console.log(error))
    }

    const updateRating = (e) => {
        firebase.auth().currentUser.getIdToken()
        .then(token => {
            UserServices.rateUser(token, currentChat.userId, e)
            .then(res => {
                if(res.status != "200"){
                    console.log("Error calificando al usuario");
                }
            }).catch(error => console.log(error))
        }).catch(error => console.log(error))
    }

    return (
        <div className="d-flex bg-light col-12 col-sm-12 col-xs-12 col-md-12 col-lg-10 m-0 p-0">
            <div
                className="position-absolute"
                style={{
                    zIndex: "1",
                    width: "300px",
                    height: "310px",
                    backgroundColor: colors.primary,
                    left: "28%",
                    top: "100px",
                    borderRadius: "30px"
                }}
                hidden={!showOptions}
            >
                <h6 className="mb-5 mt-3 text-light text-center">Opciones</h6>
                <button
                    className="btn btn-danger mx-auto d-block"
                    style={{
                        width: "90%",
                        margin: "10px",
                        borderRadius: "20px"

                    }}
                    onClick={() => unMatch()}
                >
                    Cancelar Match
                </button>
                <button
                    className="btn btn-danger mx-auto d-block"
                    style={{
                        width: "90%",
                        margin: "10px",
                        borderRadius: "20px"

                    }}
                >
                    Reportar
                </button>
                <h6 className="text-light text-center mt-3">Calificar</h6>
                <div className="mx-auto d-flex">
                    <Rating
                        className="mx-auto d-block"
                        emptySymbol={<img src={EmptyStar} style={{ width: 25 }} />}
                        fullSymbol={<img src={FullStar} style={{ width: 25 }} />}
                        initialRating={5}
                        onChange={(e) => updateRating(e)}
                    />
                </div>
                <IconButton 
                    className="mx-auto d-block bg-light mt-3"
                    onClick={() => setShowOptions(!showOptions)}
                >
                    <Close color="black"/>
                </IconButton>
            </div>
            {
                !loading ?
                    <div className="float-left col-10 bg-light p-0" style={{ height: "100vh", }}>
                        <div className="w-100 d-block" style={{ backgroundColor: colors.primary }}>
                            <h6 className="h3 text-center text-light p-2">
                                {currentChat ? currentChat.fullName : ""}
                                <IconButton
                                    style={{ padding: "0px", margin: "8px" }}
                                    className="d-block float-right"
                                    color="inherit"
                                    onClick={() => setShowOptions(!showOptions)}
                                >
                                    <Settings />
                                </IconButton>
                            </h6>
                        </div>
                        <div
                            id="scrollChat"
                            className="w-100"
                            style={{ overflowY: "scroll", overflowX: "hidden", height: "80vh" }}
                        >
                            <IconButton
                                className="mx-auto d-block"
                                onClick={() => setLimit(limit + 20)}
                            >
                                <Update />
                            </IconButton>
                            {
                                currentChat && chatMessages[currentChat.userId] && chatMessages[currentChat.userId].map((msg, i) => {
                                    return (
                                        <Animated key={i} id="animatedCard" animationIn="fadeInUp" animationOut="bounceInLeft" isVisible={true}>
                                            <div
                                                className="p-1 rounded"
                                                style={{
                                                    display: "inline-block",
                                                    width: "100%",
                                                    height: "auto",
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        backgroundColor: "brown",
                                                        display: "inline-block",
                                                        width: "auto",
                                                        maxWidth: "40%",
                                                        float: msg.authorId == firebase.auth().currentUser.uid ? "right" : "left",
                                                        textAlign: msg.authorId == firebase.auth().currentUser.uid ? "right" : "left"
                                                    }}
                                                    className="p-1 pl-3 pr-3 rounded text-light my-auto"
                                                >
                                                    {msg.content}
                                                </p>
                                            </div>
                                        </Animated>
                                    )
                                })
                            }
                        </div>
                        <div className="mb-3 col-12" style={{ position: "absolute", left: 10, bottom: 0 }}>
                            <div className="row">
                                <textarea
                                    placeholder="Escribe algo..."
                                    style={{
                                        resize: "none",
                                        width: "90%",
                                    }}
                                    className="col-9 col-md-10 mx-auto d-block"
                                    name="msg"
                                    value={text || ""}
                                    onChange={(e) => handleData(e)}
                                    onKeyPress={(e) => handleKeys(e)}
                                />
                                <IconButton
                                    color="inherit"
                                    aria-label="send message"
                                    component="span"
                                    size="small"
                                    className="col-2 col-md-1 mr-3 p-0"
                                    onClick={() => handleSendMesage()}
                                >
                                    <Send />
                                </IconButton>
                            </div>
                        </div>
                    </div>

                    :
                    <div className="mx-auto d-flex align-items-center">
                        <div className="spinner-border" role="status"></div>
                    </div>
            }

            <div className="float-right col-2 m-0 p-0" style={{ backgroundColor: "brown", overflowY: "scroll", overflowX: "hidden" }}>
                <h2 className="d-none d-sm-none d-md-block text-light text-center">Matches</h2>
                <hr color="white" />
                {
                    matches && matches.length > 0 ? matches.map((item, i) => {
                        return (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: colors.primary,
                                    borderRadius: "10px",
                                    width: "60%",
                                }}
                                className="p-0 d-block mx-auto btn btn-block col-12"
                                onClick={() => retrieveMessages(matches[i])}
                            >

                                <div style={{ height: "80px", display: "flex" }}>
                                    <img
                                        src={item.picture}
                                        className="img-fluid d-block mx-auto my-auto"
                                        alt="Responsive image"
                                        style={{ maxHeight: "80px" }}
                                    />
                                </div>
                                <h6 className="d-none d-xs-block text-center d-md-block d-lg-block text-light">{item.fullName.split(" ")[0]}</h6>
                            </div>
                        )
                    })

                        :

                        <label className="text-light text-center d-block mt-3">Sin registros</label>
                }
            </div>
        </div>
    )

}
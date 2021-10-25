import React from "react";
import LeftArrow from "../../assets/left-arrow.png"
import RightArrow from "../../assets/right-arrow.png"
import Match from "../../assets/fire.png"
import Signal from "../../assets/signal.png"

export default function MatchMenu(props) {

    const prevUser = props.prevUser;
    const nextUser = props.nextUser;
    const likeUser = props.likeUser;

    return (
        <div className="row w-100 col-12 col-xs-12 col-sm-10 col-md-10 col-lg-6 mx-auto">
            <button
                className="mx-auto col-2 col-xs-3 col-sm-3 col-lg-2 col-md-2"
                style={{ backgroundColor: "transparent", border: "none", }}
                onClick={() => prevUser()}
            >
                <img className="img-fluid" src={LeftArrow} />
            </button>
            <button
                className="mx-auto col-2 col-xs-3 col-sm-3 col-lg-2 col-md-2"
                style={{ backgroundColor: "transparent", border: "none", }}
                onClick={() => likeUser()}
            >
                <img className="img-fluid" src={Match} />
            </button>
            <button
                className="mx-auto col-2 col-xs-3 col-sm-3 col-lg-2 col-md-2"
                style={{ backgroundColor: "transparent", border: "none", }}>
                <img className="img-fluid" src={Signal} />
            </button>
            <button
                className="mx-auto col-2 col-xs-3 col-sm-3 col-lg-2 col-md-2"
                style={{ backgroundColor: "transparent", border: "none", }}
                onClick={() => nextUser()}
            >
                <img className="img-fluid" src={RightArrow} />
            </button>
        </div>
    )
}
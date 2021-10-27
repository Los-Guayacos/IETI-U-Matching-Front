import React, { useEffect } from "react"
import { colors } from "../../constants/index"
import { Animated } from "react-animated-css";

export default function MatchList(props) {

    const matches = props.matches;
    const selectCurrentChat = props.selectCurrentChat;

    return (
        <Animated id="animatedCard" animationIn="bounceInRight" animationOut="bounceInLeft" isVisible={true}>
            <div className="col-3 float-right ml-auto" style={{ backgroundColor: "brown" }}>
                <h2 className="text-light text-center">Matches</h2>
                <hr color="white" />
                {
                    matches && matches.length > 0 ? matches.map((item, i) => {
                        return (
                            <button
                                key={i}
                                style={{
                                    backgroundColor: colors.primary,
                                    borderRadius: "10px",
                                }}
                                className="m-1 p-1 btn btn-block"
                                onClick={() => selectCurrentChat(matches[i])}
                            >
                                <div className="row w-100">
                                    <img
                                        src={item.picture}
                                        style={{ borderRadius: "50%", height: "60px", width: "60px" }}
                                        className="ml-3 img-fluid"
                                    />
                                    <h6 className="ml-3 text-light">{item.fullName}</h6>
                                </div>
                            </button>
                        )
                    })

                        :

                        <label className="text-light text-center d-block mt-3">Sin registros</label>
                }
            </div>
        </Animated>
    )
}
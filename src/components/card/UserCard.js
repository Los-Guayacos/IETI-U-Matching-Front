import React, { useEffect, useState } from "react"
import Rating from "react-rating";
import EmptyStar from "../../assets/star.png"
import FullStar from "../../assets/fullStar.png"
import Tag from "./Tag"
import { Animated } from "react-animated-css";
import { colors } from "../../constants/index"
import AspectRatio from "react-aspect-ratio";

export default function UserCard(props) {
    const user = props.user;
    const [currentPicture, setcurrentPicture] = useState(props.user.pictures[0].url);

    useEffect(() => {
        setcurrentPicture(props.user.pictures[0].url);
    }, [user])

    return (
        <Animated id="animatedCard" animationIn="bounceInRight" animationOut="bounceInLeft" isVisible={true}>
            <div className="mt-3 mx-auto">
                <div className="mx-auto col-12 col-lg-8 col-xl-5 col-md-8 col-sm-8 col-xs-8" style={{ borderRadius: "15px", backgroundColor: "#DF3037" }}>
                    <div className="row w-100 mx-auto">
                        <h3 className="text-light col-10">{user.fullName.split(" ")[0]}</h3>
                        <h3 className="text-light col-2">{user.age}</h3>
                    </div>
                    {
                        currentPicture &&
                        <div style={{ height: "350px", display: "flex" }}>
                            <img
                                src={currentPicture}
                                className="img-fluid d-block mx-auto my-auto"
                                alt="Responsive image"
                                style={{ maxHeight: "350px" }}
                            />
                        </div>
                    }
                    <div
                        className="row"
                        style={{
                            justifyContent: "center"
                        }}
                    >
                        {
                            user.pictures.map((picture, i) => {
                                return (
                                    <button
                                        key={i}
                                        className="btn btn-sm btn-dark d-block m-1"
                                        onClick={() => setcurrentPicture(picture.url)}
                                    >
                                    </button>
                                )
                            })
                        }
                    </div>
                    <div className="p-3">
                        <Rating
                            emptySymbol={<img src={EmptyStar} style={{ width: 25 }} />}
                            fullSymbol={<img src={FullStar} style={{ width: 25 }} />}
                            readonly
                            initialRating={user.rating || 0}
                        />
                        <strong className="text-light ml-5">{user.totalRatings}</strong>
                    </div>
                    <div>
                        <p className="text-justify text-center text-light">{user.description.length >= 100 ? user.description.slice(0, 100) + "..." : user.description}</p>
                    </div>
                    {
                        user.interests &&
                        <div className="row m-3">
                            {
                                user.interests.slice(0, 3).map((interest, i) => (
                                    <Tag key={i} name={interest.name} />
                                ))
                            }
                        </div>
                    }

                </div>
            </div>
        </Animated>
    )
}
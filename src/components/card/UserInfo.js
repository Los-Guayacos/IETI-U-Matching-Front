import React, { useEffect } from "react"
import Instagram from "../../assets/instagram.png"
import Whatsapp from "../../assets/whatsapp.png"

export default function UserInfo(props) {
    const user = props.user;

    return (
        <div style={{ backgroundColor: "#242424", overflowY:"scroll", overflowX:"hidden" }} className="col-md-4 col-lg-2 d-none d-sm-none d-md-block d-lg-block">
            <h4 className="text-center" style={{ color: "red" }}>{user.fullName}</h4>
            <div className="mt-5">
                <p className="text-center" style={{ color: "red" }}>Universidad</p>
                <p className="text-center text-light">{user.college}</p>
                <p className="text-center" style={{ color: "red" }}>Programa</p>
                <p className="text-center text-light">{user.program}</p>
                <p className="text-center" style={{ color: "red" }}>Semestre</p>
                <p className="text-center text-light">{user.semester}</p>
            </div>
            <div>
                <p className="text-center" style={{ color: "red" }}>Descripción</p>
                <p className="text-center text-light">{user.description}</p>
            </div>

            {
                user.interests &&
                <p className="text-center" style={{ color: "red" }}>Intereses</p>
            }
            <div>
                {
                    user.interests && user.interests.length > 0 && user.interests.map((interest, i) => (
                        <p className="text-light text-center d-inline">{interest.name + " | " }</p>
                    ))
                }
            </div>
            <div className="mt-3 mx-auto">
                {
                    (user.instagram || user.whatsapp) &&
                    <p className="text-center" style={{ color: "red" }}>Redes Sociales</p>
                }
                <div className="row w-100 mx-auto">
                    {
                        user.instagram &&
                        <a className="mx-auto center" target="_blank" href={"https://www.instagram.com/" + user.instagram}>
                            <img className="mx-auto img-fluid align-self-center" style={{ width: "30px", height: "30px" }} src={Instagram} />
                        </a>
                    }
                    {
                        user.whatsapp &&
                        <a className="mx-auto center" target="_blank" href={"https://wa.me/" + user.whatsapp}>
                            <img className="mx-auto img-fluid align-self-center" style={{ width: "30px", height: "30px" }} src={Whatsapp} />
                        </a>
                    }
                </div>
            </div>
        </div>
    )
}
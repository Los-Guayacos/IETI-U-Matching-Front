import React from "react"

export default function Tag(props){

    const name = props.name;

    return(
        <div className="m-1 mx-auto" style={tagStyle}>
            <h6 className="text-center text-dark">{name}</h6>
        </div>
    )
}

const tagStyle = {
    backgroundColor:"white",
    width:100,
    borderRadius:50,
}
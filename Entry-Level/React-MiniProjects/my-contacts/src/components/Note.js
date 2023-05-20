import React from "react";
import Avatar from "./Avatar";
import Info from "./Info";

function note(props) {
  return ( <
    div className = "card" > < div className = "top" >
    <
    p > {
      props.id
    } < /p> <
    h1 className = "name" > {
      props.name
    } < /h1> <Avatar image={props.image} / > < /div> < div className = "bottom" ><
    Info detail = {
      props.tel
    }
    /> <Info
    detail = {
      props.email
    }
    /></div > < /div >
  );
}

export default note;

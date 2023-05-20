import React from "react";
import Input from "./Input.js";

function Form(props) {
  return (
    <form className="container" action="/" method="post">
      <Input type="text" placeholder="Username" />
      <Input type="password" placeholder="Password" />
      {!props.isRegistered && <Input type="password" placeholder="Confirm Password" />}
      <button>{props.isRegistered?"Login":"Register"}</button>
    </form>);
}

export default Form;

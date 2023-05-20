import React, { useState } from "react";

function App() {
  const [changeStyle, effect] = useState();
  const [contact, addInfo] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  function blackEffect() {
    effect({ backgroundColor: "black" });
  }

  function normalEffect() {
    effect({ backgroundColor: "white" });
  }

  function eventHandling(event) {
    const {value, name} = event.target;
    addInfo(prev => ({
        ...prev,
        [name]: value
      })
    );
  }

  return (
    <div className="container">
      <h1>Hello {contact.firstName} {contact.lastName}</h1>
      <p>{contact.email}</p>

      <form autoComplete="disabled">
      <input onChange={eventHandling} type="text" name="firstName" value={contact.firstName} placeholder="Your first name..." autoComplete="disabled"/>
      <input onChange={eventHandling} type="text" name="lastName" value={contact.lastName} placeholder="Your last name..." autoComplete="disabled"/>
      <input onChange={eventHandling} type="text" name="email" value={contact.email} placeholder="Your email address..." autoComplete="disabled"/>
      <button
        style={changeStyle}
        onMouseOver={blackEffect}
        onMouseOut={normalEffect}
      >
        Submit
      </button>
      </form>
    </div>
  );
}

export default App;

// <form onSubmit={welcomeMsg} autoComplete="disabled">

  // const [isSubmitted, submitCase] = useState(false);

   //  function welcomeMsg(event) {
   //   submitCase(true);
   //   event.preventDefault();
   // }

   //  <h1>Hello {isSubmitted && userName}</h1>

import React from "react";
import Note from "./Note";
import celebrity from "../celebrity";
import Avatar from "./Avatar";

function createContact(contact) {
  return ( <
    Note id = {
      contact.id
    }
    key = {
      contact.id
    }
    name = {
      contact.name
    }
    image = {
      contact.image
    }
    tel = {
      contact.tel
    }
    email = {
      contact.email
    }
    / >
  );
}

function appContent() {
  return ( < div >< body > < h1 className = "heading" > My Contacts < /h1> <
    Avatar image = "https://i.pinimg.com/564x/55/b5/3a/55b53a05427f3513e0fe27e588a322da.jpg" / > {
      celebrity.map(createContact)
    } <
    /body >< /div>);
  }

  export default appContent;

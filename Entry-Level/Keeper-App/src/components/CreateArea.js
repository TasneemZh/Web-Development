import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";

function CreateArea(props) {
  const [note, setNote] = useState({
    title: "",
    content: ""
  });
  const [zoomState, toZoom] = useState(false);
  const [initialState, showRest] = useState("hidden");

  function handleChange(event) {
    const { name, value } = event.target;

    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  function submitNote(event) {
    props.onAdd(note);
    setNote({
      title: "",
      content: ""
    });
    event.preventDefault();
  }

  function showAll() {
    showRest("none");
    toZoom(true);
  }

  return (
    <div>
      <form className="create-note">
        <input
          name="title"
          onChange={handleChange}
          value={note.title}
          placeholder="Title"
          type={initialState}
        />
        <textarea
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={zoomState?"3":"1"}
          onClick={showAll}
        />
        <Zoom in={zoomState}><Fab onClick={submitNote}>{initialState==="none" && <AddIcon />}</Fab></Zoom>
      </form>
    </div>
  );
}

export default CreateArea;

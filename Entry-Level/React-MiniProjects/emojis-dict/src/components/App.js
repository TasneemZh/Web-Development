import React from "react";
import DictCard from "./DictCard"
import emojipedia from "../emojipedia";

const descriptionEmoji = [];

function App() {

  var description = emojipedia.map(emoji => emoji.meaning.substring(0, 100));
  descriptionEmoji.push(description);
  console.log(descriptionEmoji);

  return (
    <div>
      <h1>
        <span>emojipedia</span>
      </h1>
      <dl className="dictionary">
{emojipedia.map(emoji => (<DictCard key={emoji.id} emoji={emoji.emoji} name={emoji.name} meaning={emoji.meaning} />))}
</dl>
    </div>
  );
}

export default App;

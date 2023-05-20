import React, { useState } from "react";

function App() {
  let [count, update] = useState(0);

  function increase() {
    update(count + 1);
  }

  function decrease() {
    update(count - 1);
  }

  return (
    <div className="container">
      <h1>{count}</h1>
      <button onClick={decrease}>-</button>
      <button onClick={increase}>+</button>
    </div>
  );
}

export default App;

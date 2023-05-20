import React, {useState} from "react";

function App() {
  let [time, update] = useState("TIME");
  let [timeRunning, updateRunning] = useState();
  let newTime;

  function getTime() {
    newTime = new Date().toLocaleTimeString();
    update(newTime);
  }

  function getTimeRunning() {
    newTime = new Date().toLocaleTimeString();
    updateRunning(newTime);
  }

  return (
    <div className="container">
      <h1>{time}</h1>
      <button onClick={getTime}>Get Time</button><br></br>
      <p>{timeRunning}</p>
      <p hidden>{setInterval(getTimeRunning, 1000)}</p>
    </div>
  );
}

export default App;

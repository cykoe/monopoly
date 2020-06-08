import React from "react";
import logo from "./logo.svg";
import "./App.css";
import io from "socket.io-client";
import Clock from "./sample";

const ENDPOINT = "localhost:7000";

function App() {
  const socket = io(ENDPOINT);

  return (
    <div className="App">
      <Clock />
    </div>
  );
}

export default App;

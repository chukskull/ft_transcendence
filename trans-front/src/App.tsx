import React from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Chat from "./pages/Chat";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//remove padding and margin from the body
document.body.style.padding = "0rem";
document.body.style.margin = "0rem";

function App() {
  return (
    <Router>
      <div className="App" style={{ padding: "0rem", margin: "0rem" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

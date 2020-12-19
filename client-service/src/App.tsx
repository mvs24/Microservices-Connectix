import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Login} />
      <Route path="/signup" exact component={Signup} />
    </BrowserRouter>
  );
}

export default App;

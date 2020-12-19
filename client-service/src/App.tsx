import React, { useEffect, useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { signToken } from "./store/actions/userActions";
import axios from "axios";

function App() {
  const [
    controlingAuthentication,
    setControlingAuthentication,
  ] = useState<boolean>(true);

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      signToken(`${localStorage.getItem("jwt")}`);
    }
    setControlingAuthentication(false);
  }, []);

  if (controlingAuthentication) return null;

  return (
    <BrowserRouter>
      <Route path="/" exact component={Login} />
      <Route path="/signup" exact component={Signup} />
      <Route path="/home" exact component={Home} />
    </BrowserRouter>
  );
}

export default App;

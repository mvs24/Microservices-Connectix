import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { getMe, signToken } from "./store/actions/userActions";
import { useDispatch } from "react-redux";
import PrivateRoute from "./hoc/PrivateRoute";
import Me from "./pages/Me/Me";
import EditMe from "./pages/EditMe/EditMe";

function App() {
  const [
    controlingAuthentication,
    setControlingAuthentication,
  ] = useState<boolean>(true);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (localStorage.getItem("jwt")) {
        signToken(`${localStorage.getItem("jwt")}`);
        await dispatch(getMe());
        setControlingAuthentication(false);
      } else {
        setControlingAuthentication(false);
      }
    })();
  }, []);

  if (controlingAuthentication) return null;

  return (
    <BrowserRouter>
      <PrivateRoute
        path="/home"
        exact
        WrappedComponent={Home}
        restricted={true}
      />
      <PrivateRoute
        path="/"
        exact
        WrappedComponent={Login}
        restricted={false}
      />
      <PrivateRoute
        path="/signup"
        exact
        WrappedComponent={Signup}
        restricted={false}
      />
      <PrivateRoute path="/me" exact WrappedComponent={Me} restricted={true} />
      <PrivateRoute
        path="/edit-me"
        exact
        WrappedComponent={EditMe}
        restricted={true}
      />
    </BrowserRouter>
  );
}

export default App;

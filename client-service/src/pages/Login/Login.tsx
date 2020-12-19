import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Button from "../../shared/Button/Button";
import Input from "../../shared/Input/Input";
import classes from "./Login.module.css";
import { inputChangedHandler, Requirements } from "../../utils/inputHandler";
import { login, removeError } from "../../store/actions/userActions";
import { LoginData } from "./types";
import { RootState } from "../../index";
import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../shared/ErrorModal/ErrorModal";

interface LoginInput {
  placeholder: string;
  value: string;
  touched: boolean;
  valid: boolean;
  id: string;
  requirements: Requirements;
  type: "text" | "password";
}

interface LoginState {
  email: LoginInput;
  password: LoginInput;
}

const Login = () => {
  const [loginState, setLoginState] = useState<LoginState>({
    email: {
      value: "",
      placeholder: "Email",
      touched: false,
      valid: true,
      id: "email",
      requirements: {
        isEmail: true,
      },
      type: "text",
    },
    password: {
      value: "",
      placeholder: "Password",
      touched: false,
      valid: true,
      id: "password",
      type: "password",
      requirements: {
        minlength: 6,
      },
    },
  });
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const loginHandler = async () => {
    try {
      const userData: LoginData = {
        email: loginState.email.value,
        password: loginState.password.value,
      };

      dispatch(login(userData, history));
    } catch (error) {}
  };

  const loginStateArray: LoginInput[] = Object.values(loginState);

  return (
    <div className={classes.loginContainer}>
      {userState.loading && <LoadingSpinner />}
      {userState.error && (
        <ErrorModal removeHandler={() => dispatch(removeError())}>
          {userState.error}
        </ErrorModal>
      )}
      <h1 className={classes.headingPrimary}>Connectix</h1>
      <h2 className={classes.headingSecondary}>Login to Connectix</h2>
      <div className={classes.inputsContainer}>
        {loginStateArray.map((input) => (
          <div key={input.id} className={classes.inputContainer}>
            <Input
              type={input.type}
              invalid={!input.valid}
              value={input.value}
              placeholder={input.placeholder}
              touched={input.touched}
              onChange={(e) => inputChangedHandler(e, input.id, setLoginState)}
            />
          </div>
        ))}
      </div>
      <div className={classes.btnContainer}>
        <Button title="Login" onClick={loginHandler} />
      </div>

      <Link to="/signup" className={classes.link}>
        <h3 className={classes.headingTertiary}>
          Don't have an account? Sign up
        </h3>
      </Link>
    </div>
  );
};

export default Login;

import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../shared/Button/Button";
import Input from "../../shared/Input/Input";
import { inputChangedHandler, Requirements } from "../../utils/inputHandler";
import classes from "./Login.module.css";

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
      type: "password",
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

  const loginStateArray: LoginInput[] = Object.values(loginState);

  return (
    <div className={classes.loginContainer}>
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
        <Button title="Login" onClick={() => {}} />
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

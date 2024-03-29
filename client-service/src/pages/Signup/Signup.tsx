import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../shared/Button/Button";
import Input from "../../shared/Input/Input";
import { inputChangedHandler, Requirements } from "../../utils/inputHandler";
import classes from "./Signup.module.css";

interface SignupInput {
  placeholder: string;
  value: string;
  touched: boolean;
  valid: boolean;
  id: string;
  requirements: Requirements;
  type?: "text" | "password";
}

interface LoginState {
  name: SignupInput;
  lastname: SignupInput;
  email: SignupInput;
  password: SignupInput;
  passwordConfirm: SignupInput;
}

const Signup = () => {
  const [loginState, setLoginState] = useState<LoginState>({
    name: {
      value: "",
      placeholder: "Name",
      touched: false,
      valid: true,
      id: "name",
      requirements: {
        required: true,
      },
    },
    lastname: {
      value: "",
      placeholder: "Lastname",
      touched: false,
      valid: true,
      id: "lastname",
      requirements: {
        required: true,
      },
    },
    email: {
      value: "",
      placeholder: "Email",
      touched: false,
      valid: true,
      id: "email",
      requirements: {
        isEmail: true,
      },
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
    passwordConfirm: {
      value: "",
      placeholder: "Password Confirm",
      touched: false,
      valid: true,
      id: "passwordConfirm",
      type: "password",
      requirements: {
        minlength: 6,
      },
    },
  });

  const loginStateArray: SignupInput[] = Object.values(loginState);

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
        <h3 className={classes.headingTertiary}>Already an account? Log in</h3>
      </Link>
    </div>
  );
};

export default Signup;

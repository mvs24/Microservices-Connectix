import React, { ChangeEvent } from "react";
import classes from "./Input.module.css";

interface Props {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder: string;
  invalid?: Boolean;
  touched?: Boolean;
  type?: "text" | "password";
}

const Input = (props: Props) => {
  const inputClasses = [classes.input];
  if (props.invalid && props.touched) inputClasses.push(classes.invalid);

  return (
    <input
      type={props.type || "text"}
      placeholder={props.placeholder}
      onChange={props.onChange}
      className={inputClasses.join(" ")}
      value={props.value}
    />
  );
};

export default Input;

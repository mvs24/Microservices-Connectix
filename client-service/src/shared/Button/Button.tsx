import React from "react";
import classes from "./Button.module.css";

export enum ButtonState {
  success = "success",
  danger = "danger",
  pink = "pink",
  blue = "blue",
}

interface Props {
  onClick: Function;
  title: string;
  color?: string;
  backgroundColor?: string;
  state?: ButtonState;
}

const Button = (props: Props) => {
  const { title, color, backgroundColor, state } = props;
  const classNames = [classes.btn];
  if (state) classNames.push(classes[state]);
  else classNames.push(classes["pink"]);

  return (
    <button style={{ color, backgroundColor }} className={classNames.join(" ")}>
      {title}
    </button>
  );
};

export default Button;

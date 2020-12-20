import React from "react";
import classes from "./Button.module.css";

export enum ButtonState {
  Success = "Success",
  Danger = "Danger",
  Pink = "Pink",
  Blue = "Blue",
}

interface Props {
  onClick: (e: any) => void;
  title: string;
  color?: string;
  backgroundColor?: string;
  state?: ButtonState;
  disabled?: boolean;
}

const Button = (props: Props) => {
  const { title, color, backgroundColor, state, onClick, disabled } = props;
  const classNames = [classes.btn];
  if (state) classNames.push(classes[state]);
  else classNames.push(classes["pink"]);

  return (
    <button
      disabled={disabled || false}
      onClick={onClick}
      style={{ color, backgroundColor }}
      className={classNames.join(" ")}
    >
      {title}
    </button>
  );
};

export default Button;

import React from "react";

import classes from "./ErrorModal.module.css";

interface Props {
  children: string;
  removeHandler: () => void;
}

const ErrorModal = (props: Props) => {
  return (
    <div className={classes.backdrop} onClick={props.removeHandler}>
      <div className={classes.errorModal}>
        <header className={classes.errorHeader}>An error occured!</header>
        <div className={classes.error}>
          <h2 className={classes.message}>{props.children}</h2>
        </div>
        <div onClick={props.removeHandler} className={classes.removeIcon}>
          X
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;

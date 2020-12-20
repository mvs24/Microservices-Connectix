import React from "react";
import { Link } from "react-router-dom";
import Input from "../../shared/Input/Input";
import { UserInitialState } from "../../store/reducers/userReducer";
import classes from "./Header.module.css";

interface Props {
  userState: UserInitialState;
}

export const Header = (props: Props) => {
  const { userState } = props;

  return (
    <div className={classes.header}>
      <h1>Connectix</h1>
      <div className={classes.search}>
        <Input value={""} placeholder="Search" onChange={() => {}} />
      </div>
      <div>
        <img src="" alt="" />
        <div className={classes.userInfo}>
          <Link className={classes.me} to="/me">
            {userState.data?.name} {userState.data?.lastname}
          </Link>
        </div>
      </div>
    </div>
  );
};

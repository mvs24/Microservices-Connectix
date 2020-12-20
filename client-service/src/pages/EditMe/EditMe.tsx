import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../..";
import Button, { ButtonState } from "../../shared/Button/Button";
import Input from "../../shared/Input/Input";
import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";
import { inputChangedHandler, Requirements } from "../../utils/inputHandler";
import ChangePassword from "./components/ChangePassword/ChangePassword";
import EditProfile from "./components/EditProfile/EditProfile";
import classes from "./EditMe.module.css";

const EditMe = () => {
  const [activeLink, setActiveLink] = useState<"edit" | "change">("edit");

  return (
    <div className={classes.editContainer}>
      <div className={classes.options}>
        <ul>
          <li
            onClick={() => setActiveLink("edit")}
            className={activeLink === "edit" ? classes.activeLink : ""}
          >
            Edit profile
          </li>
          <li
            onClick={() => setActiveLink("change")}
            className={activeLink === "change" ? classes.activeLink : ""}
          >
            Change Password
          </li>
        </ul>
      </div>
      {activeLink === "edit" && <EditProfile />}
      {activeLink === "change" && <ChangePassword />}
    </div>
  );
};

export default EditMe;

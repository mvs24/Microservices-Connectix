import classes from "./EditProfile.module.css";
import React, { useState } from "react";
import {
  inputChangedHandler,
  Requirements,
} from "../../../../utils/inputHandler";
import LoadingSpinner from "../../../../shared/LoadingSpinner/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../../../shared/Input/Input";
import Button from "../../../../shared/Button/Button";
import { RootState } from "../../../..";
import { editMe } from "../../../../store/actions/userActions";

interface EditInput {
  placeholder: string;
  value: string;
  touched: boolean;
  valid: boolean;
  id: string;
  requirements: Requirements;
  type?: "text" | "password";
}

interface EditState {
  name: EditInput;
  lastname: EditInput;
  email: EditInput;
}

export interface EditValues {
  name: string;
  lastname: string;
  email: string;
}

const EditProfile = () => {
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  if (!userState.data) return <LoadingSpinner />;

  const [profilePhoto, setProfilePhoto] = useState();
  const [editState, setEditState] = useState<EditState>({
    name: {
      value: userState.data.name,
      placeholder: "Name",
      touched: false,
      valid: true,
      id: "name",
      requirements: {
        required: true,
      },
    },
    lastname: {
      value: userState.data.lastname,
      placeholder: "Lastname",
      touched: false,
      valid: true,
      id: "lastname",
      requirements: {
        required: true,
      },
    },
    email: {
      value: userState.data.email,
      placeholder: "Email",
      touched: false,
      valid: true,
      id: "email",
      requirements: {
        isEmail: true,
      },
    },
  });

  const editStateArray = Object.values(editState);

  const isEditButtonDisabled = (): boolean => {
    return editStateArray.some((el: EditInput) => el.valid === false);
  };

  const editProfileHandler = () => {
    const editValues: EditValues = {
      name: "",
      lastname: "",
      email: "",
    };

    editStateArray.forEach((el: EditInput) => {
      //@ts-ignore
      editValues[el.id] = el.value;
    });

    dispatch(editMe(editValues));
  };

  return (
    <div className={classes.userInfo}>
      {userState.loading && <LoadingSpinner />}
      <div className="">
        {editStateArray.map((input: EditInput) => (
          <div className={classes.input} key={input.id}>
            <Input
              placeholder={input.placeholder}
              onChange={(e) => inputChangedHandler(e, input.id, setEditState)}
              invalid={!input.valid}
              value={input.value}
              touched={input.touched}
            />
          </div>
        ))}
      </div>

      <div className={classes.editMeButton}>
        <Button
          title="Edit"
          disabled={isEditButtonDisabled()}
          onClick={editProfileHandler}
        />
      </div>
    </div>
  );
};

export default EditProfile;

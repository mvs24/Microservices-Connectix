import { LoginData } from "../../pages/Login/types";
import { ThunkAction } from "redux-thunk";
import axios from "axios";
import { LOGIN_ERROR, LOGIN_LOADING, LOGIN_SUCCESS } from "../types/userTypes";

export const login = (
  userData: LoginData
): ThunkAction<void, any, unknown, any> => async (dispatch) => {
  try {
    dispatch({
      type: LOGIN_LOADING,
    });

    const { data } = await axios.post(`/api/users/login`, userData);
    localStorage.setItem("jwt", data.token);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.data,
    });
  } catch (err) {
    dispatch({
      type: LOGIN_ERROR,
    });
  }
};

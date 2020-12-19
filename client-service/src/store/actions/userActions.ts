import { LoginData } from "../../pages/Login/types";
import { ThunkAction } from "redux-thunk";
import { History } from "history";
import axios from "axios";
import {
  ERROR,
  GET_POSTS,
  LOADING,
  LOGIN_ERROR,
  LOGIN_LOADING,
  LOGIN_SUCCESS,
  REMOVE_ERROR,
} from "../types/userTypes";

export const signToken = (token: string | null) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const login = (
  userData: LoginData,
  history: History
): ThunkAction<void, any, unknown, any> => async (dispatch) => {
  try {
    dispatch({
      type: LOGIN_LOADING,
    });

    const { data } = await axios.post(`/api/users/login`, userData);
    signToken(data.token);
    history.push("/home");
    localStorage.setItem("jwt", data.token);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.data,
    });
  } catch (err) {
    dispatch({
      type: LOGIN_ERROR,
      payload: err.response.data.message,
    });
  }
};

export const getPosts = (): ThunkAction<void, any, unknown, any> => async (
  dispatch
) => {
  try {
    dispatch({
      type: LOADING,
    });

    const { data } = await axios.get("/api/moderations/posts");

    dispatch({
      type: GET_POSTS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ERROR,
      payload: error.response.data.message,
    });
  }
};

export const removeError = (): ThunkAction<void, any, unknown, any> => async (
  dispatch
) => {
  dispatch({
    type: REMOVE_ERROR,
  });
};

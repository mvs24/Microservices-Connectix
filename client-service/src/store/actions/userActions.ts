import { LoginData } from "../../pages/Login/types";
import { ThunkAction } from "redux-thunk";
import { History } from "history";
import axios from "axios";
import {
  ERROR,
  GET_POSTS,
  Like,
  LOADING,
  LOGIN_ERROR,
  LOGIN_LOADING,
  LOGIN_SUCCESS,
  Post,
  REMOVE_ERROR,
  TOGGLE_LIKE,
  GET_ME,
} from "../types/userTypes";
import { store } from "../../index";
export const signToken = (token: string | null) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const getMe = (): ThunkAction<void, any, unknown, any> => async (
  dispatch
) => {
  try {
    dispatch({
      type: LOADING,
    });
    const { data } = await axios.get("/api/users/me");

    dispatch({
      type: GET_ME,
      payload: data.data,
    });
  } catch (error) {
    dispatch({
      type: ERROR,
      payload: error.response.data.message,
    });
  }
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
    const posts: Post[] = data.data;

    const likes: any = await Promise.all(
      posts.map(async (post: Post) => {
        post.likes = [];
        post.likedByMe = false;
        return await dispatch(getLikes(post._id));
      })
    );
    posts.forEach((post: Post, i: number) => {
      if (likes[i].data.length > 0) {
        likes[i].data.forEach((like: Like) => {
          post.likes.push(like);
          const userState = store.getState();
          if (like.user._id === userState.user.data?._id) {
            post.likedByMe = true;
          }
        });
      }
    });

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

export const getLikes = (
  postId: string
): ThunkAction<void, any, unknown, any> => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/postLikes/${postId}`);
    return data;
  } catch (error) {
    dispatch({
      type: ERROR,
      payload: error.response.data.message,
    });
  }
};

export const toggleLike = (
  postId: string,
  liked: boolean
): ThunkAction<void, any, unknown, any> => async (dispatch) => {
  try {
    dispatch({
      type: LOADING,
    });

    await axios.post(`/api/postLikes/${postId}`);
    const postLikeData = await dispatch(getLikes(postId));
    dispatch({
      type: TOGGLE_LIKE,
      payload: {
        //@ts-ignore
        postLikeData,
        postId,
        liked,
      },
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

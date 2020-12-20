export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_LOADING = "LOGIN_LOADING";
export const LOGIN_ERROR = "LOGIN_ERROR";
export const REMOVE_ERROR = "REMOVE_ERROR";
export const LOADING = "LOADING";
export const ERROR = "ERROR";
export const GET_POSTS = "GET_POSTS";
export const TOGGLE_LIKE = "TOGGLE_LIKE";
export const GET_ME = "GET_ME";

export interface LoginPayload {
  _id: string;
  name: string;
  email: string;
  lastname: string;
}

export interface LoginSuccess {
  type: typeof LOGIN_SUCCESS;
  payload: LoginPayload;
}

export interface LoginLoading {
  type: typeof LOGIN_LOADING;
}

interface LoginError {
  type: typeof LOGIN_ERROR;
  payload: string;
}

interface Error {
  type: typeof ERROR;
  payload: string;
}

interface Loading {
  type: typeof LOADING;
}

interface RemoveError {
  type: typeof REMOVE_ERROR;
}

interface ToggleLike {
  type: typeof TOGGLE_LIKE;
  payload: {
    postLikeData: Like;
    postId: string;
    liked: boolean;
  };
}

export interface Like {
  id?: string;
  post: string;
  user: { _id: string; name: string; lastname: string };
  _id: string;
}

export interface Post {
  content: string;
  createdAt: Date;
  postType: string;
  user: {
    name: string;
    lastname: string;
    photo: string;
  };
  _id: string;
  likes: Like[];
  likedByMe: boolean;
}

interface Me {
  type: typeof GET_ME;
  payload: { _id: string; name: string; email: string; lastname: string };
}

interface GetPosts {
  type: typeof GET_POSTS;
  payload: {
    results: number;
    data: Post[];
  };
}

export type UserActions =
  | LoginSuccess
  | LoginLoading
  | LoginError
  | RemoveError
  | Loading
  | Error
  | GetPosts
  | ToggleLike
  | Me;

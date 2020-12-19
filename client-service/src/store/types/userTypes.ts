export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_LOADING = "LOGIN_LOADING";
export const LOGIN_ERROR = "LOGIN_ERROR";
export const REMOVE_ERROR = "REMOVE_ERROR";
export const LOADING = "LOADING";
export const ERROR = "ERROR";
export const GET_POSTS = "GET_POSTS";

export interface LoginPayload {
  name: string;
  email: string;
  lastname: string;
  token: string;
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

export interface Post {
  content: string;
  createdAt: Date;
  postType: string;
  user: string;
  _id: string;
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
  | GetPosts;

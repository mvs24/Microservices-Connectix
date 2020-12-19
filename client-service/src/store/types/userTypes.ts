export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_LOADING = "LOGIN_LOADING";
export const LOGIN_ERROR = "LOGIN_ERROR";

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

export type UserActions = LoginSuccess | LoginLoading | LoginError;

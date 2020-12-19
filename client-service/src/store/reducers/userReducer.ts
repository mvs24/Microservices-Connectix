import {
  LOGIN_SUCCESS,
  LoginPayload,
  UserActions,
  LOGIN_LOADING,
  LOGIN_ERROR,
} from "../types/userTypes";

export interface UserInitialState {
  isAuthenticated: boolean;
  data: null | LoginPayload;
  loading: boolean;
  error: null | string;
}

const userInitialState: UserInitialState = {
  isAuthenticated: false,
  data: null,
  loading: false,
  error: null,
};

export default (
  state: UserInitialState = userInitialState,
  action: UserActions
): UserInitialState => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        data: action.payload,
        loading: false,
      };
    case LOGIN_LOADING:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

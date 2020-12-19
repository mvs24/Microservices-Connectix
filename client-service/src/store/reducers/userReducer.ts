import {
  LOGIN_SUCCESS,
  LoginPayload,
  UserActions,
  LOGIN_LOADING,
  LOGIN_ERROR,
  REMOVE_ERROR,
  GET_POSTS,
  Post,
  LOADING,
  ERROR,
} from "../types/userTypes";

export interface UserInitialState {
  isAuthenticated: boolean;
  data: null | LoginPayload;
  loading: boolean;
  error: null | string;
  homePosts: null | Post[];
}

const userInitialState: UserInitialState = {
  isAuthenticated: false,
  data: null,
  loading: false,
  error: null,
  homePosts: null,
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
    case REMOVE_ERROR:
      return {
        ...state,
        error: null,
      };
    case GET_POSTS:
      return {
        ...state,
        homePosts: action.payload.data,
        loading: false,
      };
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

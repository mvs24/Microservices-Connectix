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
  TOGGLE_LIKE,
  Like,
  GET_ME,
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
    case GET_ME:
      return {
        ...state,
        isAuthenticated: true,
        data: action.payload,
        loading: false,
      };
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
    case TOGGLE_LIKE:
      const updatedState = {
        ...state,
      };

      if (!updatedState.homePosts)
        return {
          ...state,
        };

      const updatedHomePosts = [...updatedState.homePosts];

      const post = updatedHomePosts.find(
        (post: Post) => post._id === action.payload.postId
      );
      if (!post) {
        return {
          ...state,
        };
      }

      if (post.likedByMe) {
        post.likedByMe = !post.likedByMe;
        post.likes = post.likes.filter(
          (like: Like) => like.post !== action.payload.postId
        );
      } else {
        post.likedByMe = !post.likedByMe;
        post.likes.push(action.payload.postLikeData);
      }

      return {
        ...state,
        homePosts: updatedHomePosts,
        loading: false,
      };
    default:
      return state;
  }
};

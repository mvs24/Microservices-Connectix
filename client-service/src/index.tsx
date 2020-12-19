import React from "react";
import ReactDOM from "react-dom";
import { combineReducers, applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { UserInitialState } from "./store/reducers/userReducer";

import userReducer from "./store/reducers/userReducer";
import App from "./App";
import "./index.css";

const initialState = {};
const enhancers = [];
const middleware = [thunk];

if (process.env.NODE_ENV === "development") {
  const devToolsExtension =
    //@ts-ignore
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
      //@ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()) ||
    compose;

  if (typeof devToolsExtension === "function") {
    enhancers.push(devToolsExtension);
  }
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

export interface RootState {
  user: UserInitialState;
}

const store = createStore(
  combineReducers({
    user: userReducer,
  }),
  initialState,
  composedEnhancers
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

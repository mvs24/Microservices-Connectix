import React from "react";
import ReactDOM from "react-dom";
import { combineReducers, applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";

import userReducer from "./store/reducers/userReducer";
import App from "./App";
import "./index.css";

const store = createStore(
  combineReducers({
    user: userReducer,
  })
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

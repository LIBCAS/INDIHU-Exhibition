import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import registerServiceWorker from "./registerServiceWorker";

import App from "./App";
import configureStore from "./utils/store";

import "normalize.css";
import "./styles/style.css";

const store = configureStore();

render(<App store={store} />, document.getElementById("root"));
registerServiceWorker();

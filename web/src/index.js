import "babel-polyfill";
import { render } from "react-dom";
import "normalize.css";

import "i18n";
import configureStore from "store/store";

import registerServiceWorker from "./registerServiceWorker";
import { App } from "./app";
import "./styles/style.scss";

const store = configureStore();

export const dispatch = store.dispatch;

render(<App store={store} />, document.getElementById("root"));

registerServiceWorker();

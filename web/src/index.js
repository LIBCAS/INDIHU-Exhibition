import { render } from "react-dom";
import { AppProviders } from "app-providers";

import configureStore from "store/store";
import registerServiceWorker from "./registerServiceWorker";

import "babel-polyfill";
import "i18n";
import "normalize.css";
import "./styles/style.scss";

// - -
const store = configureStore();
export const dispatch = store.dispatch;

render(<AppProviders store={store} />, document.getElementById("root"));

registerServiceWorker();

import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import registerServiceWorker from './registerServiceWorker';

import App from './App';
import configureStore from './utils/store';

import 'normalize.css';
import './styles/style.css';

injectTapEventPlugin();

const store = configureStore();

render(<App store={store} />, document.getElementById('root'));
registerServiceWorker();

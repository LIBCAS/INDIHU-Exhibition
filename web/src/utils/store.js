import { createStore, compose, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';

import reducers from '../reducers';

export default function configureStore(initialState = {}) {
  const middlewares = [thunk];
  let composeEnhancers = compose;

  if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }

  const finalCreateStore = composeEnhancers(applyMiddleware(...middlewares))(createStore);

  const store = finalCreateStore(reducers, initialState);

  return store;
}

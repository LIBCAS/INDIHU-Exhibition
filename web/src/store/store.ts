import { createStore, compose, applyMiddleware, AnyAction, Store } from "redux";
import thunk, { ThunkDispatch } from "redux-thunk";

import combinedReducer from "../reducers";

// properly type reducers to get actual types for app state instead of any
export type AppState = ReturnType<typeof combinedReducer>;
export type AppDispatch = ThunkDispatch<AppState, void, AnyAction>;
export type AppStore = Store<AppState> & { dispatch: AppDispatch };

export default function configureStore(initialState = {}): AppStore {
  const middlewares = [thunk];
  let composeEnhancers = compose;

  if (
    process.env.NODE_ENV !== "production" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }

  const finalCreateStore = composeEnhancers<any>(
    applyMiddleware(...middlewares)
  )(createStore);

  const store = finalCreateStore(combinedReducer, initialState);

  return store;
}

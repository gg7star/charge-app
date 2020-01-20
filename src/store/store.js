import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import * as storage from 'redux-storage';
import { persistStore, persistReducer } from 'redux-persist';
import createEngine from 'redux-storage-engine-reactnativeasyncstorage';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from '~/reducers';
import sagas from '~/sagas';

const isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

export default function configureStore(onComplete) {

  const engine = createEngine('AppTree');
  const storeMiddleware = storage.createMiddleware(engine, [], );
  const sagaMiddleware = createSagaMiddleware();
  let middleware = [sagaMiddleware, thunkMiddleware, storeMiddleware];
  let store = null;
  if (process.env.NODE_ENV !== 'production') {
    const logger = createLogger({
      predicate: (getState, action) => isDebuggingInChrome,
      collapsed: true,
      duration: true,
      diff: true,
    });

    middleware = [
      ...middleware
    ]

    const composeEnhancers = composeWithDevTools({
      // Specify here name, actionsBlacklist, actionsCreators and other options if needed
    });

    store = createStore(
      storage.reducer(reducers),
      //Apply redux-storage so we can persist Redux state to disk
      composeEnhancers(
        applyMiddleware(
          ...middleware, logger
        ),
      )
    );
  } else {
    const composeEnhancers = compose;
    store = createStore(
      storage.reducer(combineReducers(reducers)), 
      composeEnhancers(
        applyMiddleware(
          ...middleware
        ),
      )
    );
  }


  if (isDebuggingInChrome) {
    window.store = store;
  }

  const load = storage.createLoader(engine);
  load(store)
    .then(onComplete)
    .catch(() => console.log('Failed to load previous state'));

  sagaMiddleware.run(sagas);

  return store;
}

import {connectRouter} from 'connected-react-router';
import {applyMiddleware, compose, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import historylocal from '../components/modules/historylocal';

import middleware, {sagaMiddleware} from './middleware';
import rootReducer from './RootReducer';
import rootSaga from './RootSaga';

const reducer = persistReducer(
  {
    key: 'touchstone2-5897',
    storage, // storage is now required
    blacklist: ['workspace'],
  },
  rootReducer,
);

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/* istanbul ignore next */
const configStore = (initialState = {}) => {
  const store = createStore(
    connectRouter(historylocal)(reducer),
    initialState,
    composeEnhancer(
      applyMiddleware(...middleware),
    ),
  );


  sagaMiddleware.run(rootSaga);

  if (module.hot) {
    module.hot.accept('./RootReducer.js', () => {
      store.replaceReducer(require('./RootReducer.js').default);
    });
  }


  return {
    persistor: persistStore(store),
    store,
  };
};

const {store, persistor} = configStore();

global.store = store;

export {store, persistor};

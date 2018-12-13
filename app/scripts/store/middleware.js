import {routerMiddleware} from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import history from '../components/modules/historylocal';

export const sagaMiddleware = createSagaMiddleware();

const middleware = [
  routerMiddleware(history),
  sagaMiddleware,
];

/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  const {createLogger} = require('redux-logger');

  // use invaraints to check you r store for immutability, but you probably rather want to kill yourself
  // const invariant = require('redux-immutable-state-invariant').default;
  // middleware.push(invariant());
  middleware.push(createLogger({collapsed: true}));
}

export default middleware;

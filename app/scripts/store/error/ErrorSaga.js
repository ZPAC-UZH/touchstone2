import {takeEvery, put} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {
  CRITICAL_MESSAGE, RELEASE_CRITICAL_MESSAGE, RELEASE_WARNING_MESSAGE, SET_CRITICAL_MESSAGE, SET_WARNING_MESSAGE,
  WARNING_MESSAGE,
} from './ErrorAction';
const DELAY = {
  'ERROR': 5000,
};
/**
 * Error Handling Sagas. Use these implementations if blue prompts in the app are needed.
 */

const errorWarning = function* (action) {
  try {
    const {message} = action;
    yield put({type: SET_WARNING_MESSAGE, message});
    yield delay(DELAY.ERROR);
    yield put({type: RELEASE_WARNING_MESSAGE});
  }
  catch (error) {
    console.log('error Warning, warning', error);
  }
};

const errorCritical = function* (action) {
  try {
    const {message} = action;
    yield put({type: SET_CRITICAL_MESSAGE, message});
    yield delay(DELAY.ERROR);
    yield put({type: RELEASE_CRITICAL_MESSAGE});
  }
  catch (error) {
    console.log('Critical error, error');
  }
};


const errorSaga = function* () {
  yield takeEvery(WARNING_MESSAGE, errorWarning);
  yield takeEvery(CRITICAL_MESSAGE, errorCritical);
};

export default errorSaga;

import {all, fork} from 'redux-saga/effects';

import designsSaga from './designs/DesignsSaga';
import workspaceSaga from './workspace/WorkspaceSaga';
import powerSaga from './power/PowerSaga';
import appSaga from './app/AppSaga';
import errorSaga from './error/ErrorSaga';
import trialTableSaga from './trialTable/TrialTableSaga';

/**
 * rootSaga
 */
export default function* root() {
  yield all([
    fork(designsSaga),
    fork(powerSaga),
    fork(workspaceSaga),
    fork(appSaga),
    fork(errorSaga),
    fork(trialTableSaga),
  ]);
}

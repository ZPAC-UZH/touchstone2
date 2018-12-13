import {put, takeEvery, select} from 'redux-saga/effects';
import {
  WORKING_MODE_SWITCHER_START,
  WORKING_MODE_SWITCHER_SUCCESS,
} from './AppActions';
import {WORKING_MODE_POWER_ANALYSIS} from './workingModeConfigurations';
import {
  POWERANALYSIS_CALCULATE_POWER_MARGIN_START,
} from '../power/PowerAction';
import {getStyle} from '../workspace/selector';
import {WORKSPACE_BLOCKLY_STYLES_SUCCESS} from '../workspace/WorkspaceAction';

const switchWorkingMode = function* (action) {
  const currentStyle = yield select(getStyle);
  let width = '69vw';
  if (action.workingMode === WORKING_MODE_POWER_ANALYSIS) {
    width = '50vw';
    yield put({
      type: POWERANALYSIS_CALCULATE_POWER_MARGIN_START,
    });
  }


  const style = {
    ...currentStyle,
    wrapper: {
      ...currentStyle.wrapper,
      width,
    },
  };

  yield put({
    type: WORKSPACE_BLOCKLY_STYLES_SUCCESS,
    style,
  });

  yield put({
    type: WORKING_MODE_SWITCHER_SUCCESS,
    workingMode: action.workingMode,
  });
};

const appSaga = function* () {
  yield takeEvery(WORKING_MODE_SWITCHER_START, switchWorkingMode);
};

export default appSaga;

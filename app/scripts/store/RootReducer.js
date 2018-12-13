import {combineReducers} from 'redux';
import app from './app/AppReducer';
import designs from './designs/DesignsReducer';
import error from './error/ErrorReducer';
import power from './power/PowerReducer';
import trialtable from './trialTable/TrialTableReducer';
import workspace from './workspace/WorkspaceReducer';


export default combineReducers({
  designs,
  power,
  workspace,
  app,
  error,
  trialtable,
});

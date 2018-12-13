import immutable from 'immutability-helper';
import {handleActions} from 'redux-actions';
import {initialWorkspaceState} from './shape';
import {
  WORKSPACE_BLOCKLY_STYLES_SUCCESS,
  WORKSPACE_SET_RAWTSL_SUCCESS,
} from './WorkspaceAction';


export default handleActions({
  [WORKSPACE_SET_RAWTSL_SUCCESS]: (state, action) => immutable(state, {
    rawTsl: {$set: action.rawTsl},
  }),
  [WORKSPACE_BLOCKLY_STYLES_SUCCESS]: (state, action) => immutable(state, {
    style: {$set: action.style},
  }),
}, initialWorkspaceState);

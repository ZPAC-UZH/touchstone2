import immutable from 'immutability-helper';
import {handleActions} from 'redux-actions';
import {TRIALTABLE_SET_FISHEYE_SUCCESS} from './TrialTableAction';

const initialState = {
  fishEyeMode: false,
};
export default handleActions({
  [TRIALTABLE_SET_FISHEYE_SUCCESS]: (state, action) => immutable(state, {
    fishEyeMode: {$set: action.mode},
  }),
}, initialState);

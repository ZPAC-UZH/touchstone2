import immutable from 'immutability-helper';
import {handleActions} from 'redux-actions';
import {
  TRIALTABLE_SET_FISHEYE_SUCCESS,
  TRIALTABLE_SET_HOVER_SUCCESS,
} from './TrialTableAction';

const initialState = {
  fishEyeMode: false,
  hover: {
    designId: '',
    rowIdx: 0,
  },
};
export default handleActions({
  [TRIALTABLE_SET_FISHEYE_SUCCESS]: (state, action) => immutable(state, {
    fishEyeMode: {$set: action.mode},
  }),
  [TRIALTABLE_SET_HOVER_SUCCESS]: (state, action) => immutable(state, {
    hover: {$set: action.hover},
  }),
}, initialState);

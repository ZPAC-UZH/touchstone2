import immutable from 'immutability-helper';
import {handleActions} from 'redux-actions';
import {UPDATE_SIDEBAR} from './SidebarAction';
import {sidebarConfig} from './sidebarConfigurations';

const initialState = {
  order: sidebarConfig.DEFAULT,
};


export default handleActions({
  [UPDATE_SIDEBAR]: (state, action) => immutable(state, {
    order: {$set: action.config},
  }),
}, initialState);

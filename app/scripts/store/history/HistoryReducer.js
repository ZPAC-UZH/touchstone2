import immutable from 'immutability-helper';
import {handleActions} from 'redux-actions';
import {LOG} from './data/log';
import {
  HISTORY_ADD_ENTRY_SUCCESS,
  HISTORY_END_ANNOTATION_ARRAY_SUCCESS,
  HISTORY_END_ANNOTATION_SUCCESS,
  HISTORY_START_ANNOTATION_SUCCESS,
} from './HistoryAction';
import {generateRandomAnimalName} from './lib/animalNames';


const initialState = {
  history: LOG,
  annotations: [],
  id: generateRandomAnimalName(),
  annotationstartId: '',
  annotationstartEntry: '',
};


export default handleActions({
  [HISTORY_ADD_ENTRY_SUCCESS]: (state, action) => immutable(state, {
    history: {$set: action.history},
  }),
  [HISTORY_START_ANNOTATION_SUCCESS]: (state, action) => immutable(state, {
    annotationstartId: {$set: action.startId},
    annotationstartEntry: {$set: action.entry},
  }),
  [HISTORY_END_ANNOTATION_SUCCESS]: (state, action) => immutable(state, {
    annotations: {$set: [...state.annotations, action.annotation]}
  }),
  [HISTORY_END_ANNOTATION_ARRAY_SUCCESS]: (state, action) => immutable(state, {
    annotations: {$set: [...state.annotations, ...action.annotation]}
  }),
}, initialState);

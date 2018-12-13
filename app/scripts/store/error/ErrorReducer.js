import {
  RELEASE_CRITICAL_MESSAGE, RELEASE_WARNING_MESSAGE, SET_CRITICAL_MESSAGE,
  SET_WARNING_MESSAGE,
} from './ErrorAction';

const initialState = {
  warning: '',
  critical: '',
};


export default (state = initialState, action) => {
  switch (action.type) {
    case SET_WARNING_MESSAGE:
      return {
        ...state,
        warning: action.message,
      };
    case RELEASE_WARNING_MESSAGE:
      return {
        ...state,
        warning: '',
      };
    case SET_CRITICAL_MESSAGE:
      return {
        ...state,
        critical: action.message,
      };
    case RELEASE_CRITICAL_MESSAGE:
      return {
        ...state,
        critical: '',
      };
    default:
      return state;
  }
};

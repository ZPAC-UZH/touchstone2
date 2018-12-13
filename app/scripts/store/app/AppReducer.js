import {WORKING_MODE_SWITCHER_SUCCESS} from './AppActions';
import {WORKING_MODE_STANDARD} from './workingModeConfigurations';

const initialWorkingMode = {
  workingMode: WORKING_MODE_STANDARD,
};

export default (state = initialWorkingMode, action) => {
  switch (action.type) {
    case WORKING_MODE_SWITCHER_SUCCESS:
      return {
        ...state,
        workingMode: action.workingMode,
      };
    default:
      return state;
  }
};

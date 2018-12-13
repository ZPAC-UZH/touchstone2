export const WORKING_MODE_SWITCHER_START = 'WORKING_MODE_SWITCHER_START';
export const WORKING_MODE_SWITCHER_SUCCESS = 'WORKING_MODE_SWITCHER_SUCCESS';

export const switchToWorkingMode = (workingMode) => ({
  type: WORKING_MODE_SWITCHER_START,
  workingMode,
});

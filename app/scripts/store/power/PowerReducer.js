/**
 * designData: [
 * {trialTable, tsl},{trialTable, tsl}...]
 * @type {{designData: Array}}
 */
import {
  POWERANALYSIS_CALCULATE_POWER_MARGIN_SUCCESS,
  POWERANALYSIS_CALCULATE_POWER_SUCCESS,
  POWERANALYSIS_UPDATE_EFFECT_SIZE_SUCCESS,
  POWERANALYSIS_UPDATE_MARGIN_FOR_DESIGN_SUCCESS,
} from './PowerAction';

export const initialState = {
  powerDistributions: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case POWERANALYSIS_CALCULATE_POWER_SUCCESS:
      return {
        ...state,
        powerDistributions: action.powerData,
      };
    case POWERANALYSIS_UPDATE_EFFECT_SIZE_SUCCESS:
      return {
        ...state,
        powerDistributions: action.powerDistributions,
      };
    case POWERANALYSIS_CALCULATE_POWER_MARGIN_SUCCESS:
      return {
        ...state,
        powerDistributions: action.powerData,
      };
    case POWERANALYSIS_UPDATE_MARGIN_FOR_DESIGN_SUCCESS:
      return {
        ...state,
        powerDistributions: action.powerData,
      };
    default:
      return state;
  }
};

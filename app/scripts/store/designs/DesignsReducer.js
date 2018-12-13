import {workinput} from '../../constants';
import {
  DESIGNS_FOKUS_ID_SUCCESS,
  DESIGNS_FOKUS_TYPE_SUCCESS,
  DESIGNS_ISDESIGN_SUCCESS,
  DESIGNS_UPDATE_DESIGNDATA_SUCCESSS,
  DESIGNS_FORCE_UPDATE_SUCCESS,
  DESIGNS_UPDATE_WORKSPACE_SUCCESS,
  DESIGNS_UPDATE_MEASUREMENTS_SUCCESS,
} from './DesignsAction';

/**
 * TODO: Here the clickedDesign only fills if the type is a 'design', awful and should be changed
 * designData: [
 * {trialTable, tsl},{trialTable, tsl}...]
 * @type {{designData: Array}}
 */
export const initialState = {
  designData: [],
  clickedDesign: {},
  clickedBlockType: {},
  clickedBlockId: {},
  helpTypeOfClickedDesign: 'design',
  workspaceXML: workinput,
  forceUpdate: false,
  history: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case DESIGNS_UPDATE_DESIGNDATA_SUCCESSS:
      return {
        ...state,
        designData: action.designData,
      };
    case DESIGNS_ISDESIGN_SUCCESS:
      return {
        ...state,
        clickedDesign: action.clickedDesign,
      };
    case DESIGNS_FOKUS_TYPE_SUCCESS:
      return {
        ...state,
        clickedBlockType: action.blockType,
        helpTypeOfClickedDesign: action.blockType,
      };
    case DESIGNS_FOKUS_ID_SUCCESS:
      return {
        ...state,
        clickedBlockId: action.id,
      };
    case DESIGNS_UPDATE_WORKSPACE_SUCCESS:
      return {
        ...state,
        workspaceXML: action.workspaceXML,
      };
    case DESIGNS_FORCE_UPDATE_SUCCESS:
      return {
        ...state,
        forceUpdate: action.forceUpdate,
      };
    case DESIGNS_UPDATE_MEASUREMENTS_SUCCESS:
      return {
        ...state,
        designData: action.designData,
      };
    default:
      return state;
  }
};

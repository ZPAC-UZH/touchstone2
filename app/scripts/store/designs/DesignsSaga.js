import Blockly from 'node-blockly/browser';
import {all, call, put, select, takeEvery, throttle} from 'redux-saga/effects';
import {WARNING_MESSAGE} from '../error/ErrorAction';
import {HISTORY_ADD_ENTRY_START} from '../history/HistoryAction';
import {POWERANALYSIS_CALCULATE_POWER_START} from '../power/PowerAction';
import {WORKSPACE_SET_RAWTSL_SUCCESS} from '../workspace/WorkspaceAction';
import {
  DESIGNS_BLOCK_CLICK_START,
  DESIGNS_FOKUS_ID_SUCCESS,
  DESIGNS_FOKUS_TYPE_SUCCESS,
  DESIGNS_FORCE_UPDATE_SUCCESS,
  DESIGNS_ISDESIGN_SUCCESS,
  DESIGNS_UPDATE_CURRENT_WORKSPACE_START,
  DESIGNS_UPDATE_DESIGNDATA_START,
  DESIGNS_UPDATE_DESIGNDATA_SUCCESSS,
  DESIGNS_UPDATE_MEASUREMENTS_START,
  DESIGNS_UPDATE_MEASUREMENTS_SUCCESS,
  DESIGNS_UPDATE_WORKSPACE_START,
  DESIGNS_UPDATE_WORKSPACE_SUCCESS,
} from './DesignsAction';
import {getOrCreateData} from './helper';
import {getDesigns} from './selector';
import {generateTslWithMeta as tslParser} from 'touchstone-language';

/**
 * This generator function
 * updates the designs in the redux store
 *
 * TODO: Use Catch to report to the user a correct Error message
 * @param {Object} action
 *
 */
const updateDesignData = function* (action) {
  try {
    const currentDesigns = yield select(getDesigns);
    const {rawTsl} = action;
    let designArrays = rawTsl.split('\n');

    const incompleteDesignNames = [];

    designArrays = designArrays.filter(designString => {
      try {
        JSON.parse(designString);
      }
      catch (e) {
        return false;
      }

      const design = JSON.parse(designString);

      try {
        tslParser(design.tsl, design.numberOfParticipants);
      }
      catch (e) {
        incompleteDesignNames.push(design.designName);
        return false;
      }
      return true;
    });

    const designs = designArrays.map(design => {
      if (!design) {
        return [];
      }
      return JSON.parse(design);
    });

    const designsGenerated = yield all(designs.map((item => call(getOrCreateData, item, currentDesigns))));

    const designData = designsGenerated.map((item, idx) => {
      const oldDesignData = currentDesigns.designData;
      const {design} = item;
      return {
        ...oldDesignData[idx],
        ...design,
      };
    });

    const historyData = designsGenerated
      .filter(item => !item.existed)
      .map(item => item.design);

    yield put({
      type: DESIGNS_UPDATE_DESIGNDATA_SUCCESSS,
      designData,
    });

    if (historyData.length > 0) {
      yield put({
        type: HISTORY_ADD_ENTRY_START,
        historyData,
      });
    }

    yield put({
      type: WORKSPACE_SET_RAWTSL_SUCCESS,
      rawTsl,
    });

    if (incompleteDesignNames.length > 0) {
      let message = `${incompleteDesignNames.join(' & ')}`;
      if (incompleteDesignNames.length === 1) {
        message += ' is incomplete. Complete the design to see its power and trial table.';
      }
      else {
        message += ' are incomplete. Complete the design to see its power and trial table.';
      }

      yield put({
        type: WARNING_MESSAGE,
        message,
      });
    }
  }
  catch (err) {
    let message = 'You need to place all the Blocks inside the Workspace. See HELP for more information.';
    const completeCounterbalancingError = 'Block has too many conditions for Complete counterbalancing';
    if (err.message === completeCounterbalancingError) {
      ({message} = err);
    }

    yield put({
      type: WARNING_MESSAGE,
      message,
    });
  }
};

/**
 * Determine the clicked block and show
 * the according data in the preview components
 * @param {*} action
 */
const blockClicked = function* (action) {
  try {
    const {id} = action;
    const blockType = Blockly.getMainWorkspace()
      .getBlockById(id).type;

    yield put({
      type: POWERANALYSIS_CALCULATE_POWER_START,
      id,
    });

    yield put({
      type: DESIGNS_FOKUS_ID_SUCCESS,
      id,
    });

    yield put({
      type: DESIGNS_FOKUS_TYPE_SUCCESS,
      blockType,
    });

    if (blockType === 'design') {
      const currentDesigns = yield select(getDesigns);
      const clickedDesign = yield currentDesigns.designData.find(item => item.designId === id);
      if (clickedDesign) {
        yield put({
          type: DESIGNS_ISDESIGN_SUCCESS,
          clickedDesign,
        });
      }
    }
  }
  catch (err) {
    console.log(err);
  }
};


/**
 * This generator function
 *
 * @param {Object} action
 *
 */
const setCurrentWorkspaceData = function* (action) {
  try {
    const {workspaceXML} = action || [];

    const forceUpdate = true;
    yield put({
      type: DESIGNS_FORCE_UPDATE_SUCCESS,
      forceUpdate,
    });

    yield put({
      type: DESIGNS_UPDATE_WORKSPACE_SUCCESS,
      workspaceXML,
    });
  }
  catch (err) {
    console.log('Unable to set current workspce', err);
  }
};

const setDesignImages = function* (action) {
  try {
    // If the image is needed
    const {designImages} = action;

    const currentDesignsData = yield select(getDesigns);
    const designData = currentDesignsData.designData.map(item => ({
      image: designImages.find(entry => entry.designId === item.designId).image,
      ...item,
    }));

    yield put({
      type: DESIGNS_UPDATE_DESIGNDATA_SUCCESSS,
      designData,
    });
  }
  catch (err) {
    console.log('Unable to set images', err);
  }
};

/**
 * This generator function
 *
 * @param {Object} action
 *
 */
const setWorkspaceData = function* (action) {
  try {
    const {workspaceOutput} = action || [];
    const {xmlText: workspaceXML} = workspaceOutput;

    yield put({
      type: DESIGNS_UPDATE_WORKSPACE_SUCCESS,
      workspaceXML,
    });
  }
  catch (err) {
    console.log('Unable to set new lib', err);
  }
};

function* updateMeasurementsForDesign(action) {
  const {designId, measurements} = action;
  const oldDesigns = yield select(getDesigns);

  const {designData: oldDesignData} = oldDesigns;
  const designData = [];

  oldDesignData.forEach(item => {
    if (item.designId === designId) {
      designData.push({
        ...item,
        measurements,
      });
    }
    else {
      designData.push(item);
    }
  });

  const designs = {
    ...oldDesigns,
    designData,
  };

  yield put({
    type: DESIGNS_UPDATE_MEASUREMENTS_SUCCESS,
    designData: designs.designData,
  });
}


/**
 * Blockly Sagas
 */

const designsSaga = function* () {
  yield throttle(1, DESIGNS_UPDATE_DESIGNDATA_START, updateDesignData);
  yield throttle(1, DESIGNS_BLOCK_CLICK_START, blockClicked);
  yield throttle(500, DESIGNS_UPDATE_CURRENT_WORKSPACE_START, setCurrentWorkspaceData);
  yield throttle(500, DESIGNS_UPDATE_WORKSPACE_START, setWorkspaceData);
  yield takeEvery(DESIGNS_UPDATE_MEASUREMENTS_START, updateMeasurementsForDesign);
};

export default designsSaga;

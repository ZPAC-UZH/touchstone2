import {all, put, select, takeEvery} from 'redux-saga/effects';
import {aPriori} from './aPriori';
import {getDesigns} from '../designs/selector';
import {
  POWERANALYSIS_CALCULATE_POWER_MARGIN_START,
  POWERANALYSIS_CALCULATE_POWER_MARGIN_SUCCESS,
  POWERANALYSIS_CALCULATE_POWER_START,
  POWERANALYSIS_CALCULATE_POWER_SUCCESS,
  POWERANALYSIS_UPDATE_EFFECT_SIZE_START,
  POWERANALYSIS_UPDATE_EFFECT_SIZE_SUCCESS,
  POWERANALYSIS_UPDATE_MARGIN_FOR_DESIGN_START,
  POWERANALYSIS_UPDATE_MARGIN_FOR_DESIGN_SUCCESS,
} from './PowerAction';
import {getPowerDistributions} from './selector';
import * as d3 from 'd3';


const getChartData = (parameters, designId, powerDist) => {
  const oldParams = powerDist[designId];
  if (oldParams && JSON.stringify(oldParams.parameters) === JSON.stringify(parameters)) {
    return oldParams;
  }
  else {
    const chartData = getMonotonicallyIncreasingPowerData(parameters);
    return {
      data: chartData,
      parameters,
    };
  }
};

function getMonotonicallyIncreasingPowerData(parameters) {
  const chartData = aPriori(parameters);
  let newChartData = [];
  for (let i = 0; i < (chartData.length - 1); i++) {
    const curElem = chartData[i];
    const nextElem = chartData[i + 1];

    const powerInterpolation = d3.interpolate(curElem.power, nextElem.power);

    newChartData.push(curElem);
    let localPidx = 0;
    for (let pIdx = curElem.participant + 1; pIdx < nextElem.participant; pIdx++) {
      localPidx++;
      newChartData.push({
        power: powerInterpolation(localPidx / (nextElem.participant - curElem.participant)),
        participant: pIdx,
      });
    }
  }
  newChartData = newChartData.filter((item) => item.participant >= 8);
  return newChartData;
}

export function isMonotonicallyIncreasing(data) {
  for (let i = 1; i < data.length; i++) {
    const {power: lastElem} = data[i - 1];
    const {power: curElem} = data[i];
    if (lastElem > curElem) {
      return false;
    }
  }
  return true;
}

export function findNextBiggerElement(data, idx) {
  const {power: elem} = data[idx];
  for (let i = idx; i < data.length; i++) {
    const {power: curElem} = data[i];
    if (curElem > elem) {
      return i;
    }
  }
  return idx;
}

export function interpolateValues(data) {
  for (let i = 1; i < data.length; i++) {
    const {power: cur} = data[i];
    const {power: last} = data[i - 1];
    if (cur < last) {
      const nextIdx = findNextBiggerElement(data, (i - 1));
      const {power: next} = data[nextIdx];
      const addition = (next - last) / (nextIdx - i + 1);

      for (let j = i; j < nextIdx; j++) {
        data[j].power = data[j - 1].power + addition;
      }
    }
  }
  return data;
}

function computeMeasurements(variables) {
  let total = 1;
  let max = 0;
  variables.forEach(block => {
    const levelCounts = block.map(iv => iv.levels.length);
    levelCounts.forEach(v => {
      total *= v;
      if (v > max) {
        max = v;
      }
    });
  });
  const res = total / max;

  if (res > 2) { // TODO find out my with two measurements the power is 1
    return res;
  }
  return 3;
}

function getEffectSize(designId, powerDist) {
  if (!(designId in powerDist)) {
    return 0.25;
  }
  const powerDistForDesign = powerDist[designId];
  const {effectSize} = powerDistForDesign.parameters;

  return effectSize;
}

function createPowerParameters(design, powerParameters) {
  const {designId} = design;
  const measurements = computeMeasurements(design.variables);
  const effectSize = getEffectSize(designId, powerParameters);

  return {
    effectSize,
    alpha: 0.05,
    power: 0.8,
    groups: 1, // level permutation of between subject IVs
    measurements,
    correction: 0.5,
    nonsphericity: 1,
    designId,
    designName: 'This is a design Name',
    integrationStopThreshold: 5e-5,
    achievedPowerThreshold: 0.99,
    integrationStepSize: 0.01,
    maxSampleSizeCount: 50,
  };
}

/**
 * This generator function
 * updates the designs in the redux store
 *
 * @param {Object} action
 *
 */
const calculatePowerForAllDesigns = function* (action) {
  try {
    const designs = yield select(getDesigns);
    const powerDist = yield select(getPowerDistributions);

    // Because the power d3 wants to show multiple graphs, we need to compute all the chart data
    // Therefore not sorting by ID. s
    let powerData = {};
    yield all(designs.designData.forEach(async (design) => {
      const parameters = createPowerParameters(design, powerDist);
      powerData = {
        ...powerData,
        [design.designId]: getChartData(parameters, design.designId, powerDist),
      };
    }));

    yield put({
      type: POWERANALYSIS_CALCULATE_POWER_SUCCESS,
      powerData,
    });
  }
  catch (err) {
    console.warn(err);
  }
};

function* updateEffectSizeForDesign(action) {
  const {designId, effectSize} = action;
  const power = yield select(getPowerDistributions);

  let {parameters, margin} = power[designId];

  parameters = {
    ...parameters,
    effectSize,
  };

  const chartData = getChartData(parameters, designId, power);
  const marginsData = calculateMargins(parameters, margin);
  const newPower = {
    ...power,
    [designId]: {
      ...chartData,
      margin,
      ...marginsData,
    },
  };

  yield put({
    type: POWERANALYSIS_UPDATE_EFFECT_SIZE_SUCCESS,
    powerDistributions: newPower,
  });
}

function* calculateMargins(parameters, margin) {
  const {effectSize} = parameters;

  const lowerParameters = {
    ...parameters,
    effectSize: effectSize - margin,
  };
  const dataLowerMargin = getMonotonicallyIncreasingPowerData(lowerParameters);

  const upperParameters = {
    ...parameters,
    effectSize: effectSize + margin,
  };
  const dataUpperMargin = getMonotonicallyIncreasingPowerData(upperParameters);
  return {
    dataUpperMargin,
    dataLowerMargin,
  };
}

function* calculateMarginForDesign(action) {
  const designs = yield select(getDesigns);
  const powerData = yield select(getPowerDistributions);
  const {clickedDesign} = designs;
  if (clickedDesign) {
    const {designId: clickedDesignId} = clickedDesign;
    const clickedPowerData = powerData[clickedDesignId];

    if (!('dataUpperMargin' in clickedPowerData && 'dataLowerMargin' in clickedPowerData)) {
      // only compute margin if the data is not available
      let {parameters, margin} = clickedPowerData;

      if (!margin) {
        margin = 0.05;
      }

      const dataMargins = yield calculateMargins(parameters, margin);

      const powerDataWithMarginData = {
        ...powerData,
        [clickedDesignId]: {
          ...clickedPowerData,
          margin,
          ...dataMargins,
        },
      };

      yield put({
        type: POWERANALYSIS_CALCULATE_POWER_MARGIN_SUCCESS,
        powerData: powerDataWithMarginData,
      });
    }
  }
}

function* updateMarginForDesign(action) {
  const {designId, margin} = action;
  const power = yield select(getPowerDistributions);
  const {parameters} = power[designId];
  const marginsData = yield calculateMargins(parameters, margin);

  const newPower = {
    ...power,
    [designId]: {
      ...power[designId],
      margin,
      ...marginsData,
    },
  };

  yield put({
    type: POWERANALYSIS_UPDATE_MARGIN_FOR_DESIGN_SUCCESS,
    powerData: newPower,
  });
}


/**
 * Blockly Sagas
 */

const powerSaga = function* () {
  yield takeEvery(POWERANALYSIS_CALCULATE_POWER_START, calculatePowerForAllDesigns);
  yield takeEvery(POWERANALYSIS_UPDATE_EFFECT_SIZE_START, updateEffectSizeForDesign);
  yield takeEvery(POWERANALYSIS_CALCULATE_POWER_MARGIN_START, calculateMarginForDesign);
  yield takeEvery(POWERANALYSIS_UPDATE_MARGIN_FOR_DESIGN_START, updateMarginForDesign);
};

export default powerSaga;

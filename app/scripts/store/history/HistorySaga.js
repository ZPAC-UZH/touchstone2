import {call, put, select, throttle} from 'redux-saga/effects';
import {API} from '../../constants/settings';
import {hashCode} from '../helper';
import {
  HISTORY_ADD_ENTRY_START,
  HISTORY_ADD_ENTRY_SUCCESS,
  HISTORY_END_ANNOTATION_START,
  HISTORY_END_ANNOTATION_SUCCESS, HISTORY_SEND_XML_START,
  HISTORY_SUBMIT_ENTRY_START,
} from './HistoryAction';
import {
  getAllAnnotations,
  getAnnotationEntry,
  getAnnotationId,
  getHistory,
  getId,
} from './selector';


const setDataFormat = (data) => data.map(item => ({
  id: item.designId,
  events: [{
    date: new Date(),
    xml: item.xml,
    trialTable: item.trialTable,
    designName: item.designName,
  }],
}));

const setFlag = (data) => ({
  design: data,
  assigned: false,
});

const genNewHistory = (current, newData) => {
  // get entries that are the same

  const flaggedData = newData.map(item => setFlag(item));
  const oldHistory = current.map(item => item);


  const newHistory = oldHistory.map(item => {
    let theEntry = null;
    flaggedData.forEach(entry => {
      if (!entry.assigned && entry.design.id === item.id) {
        theEntry = {
          id: item.id,
          events:
            [...item.events, {
              date: new Date(),
              xml: entry.design.events[0].xml,
              trialTable: entry.design.events[0].trialTable,
              designName: entry.design.events[0].designName,
            }],
        };
        entry.assigned = true;
      }
    });
    if (theEntry) {
      return theEntry;
    }
    else {
      return item;
    }
  });

  const remainingData = flaggedData.filter(item => !item.assigned);
  return [...newHistory, ...remainingData.map(item => item.design)];
};

/**
 * This generator function
 *
 * @param {Object} action
 *
 */
const addHistoryEntry = function* (action) {
  try {
    // parameter is a designData object

    const {historyData} = action;
    const fullHistory = yield select(getHistory);

    const history = genNewHistory(fullHistory.history, setDataFormat(historyData));

    // there is still the deletion missing, lets clean the history and remove the unused ids
    /* const history = historyAll.map(item => {
      const exists = designData.find(entry => entry.designId === item.id);
      if (exists) {
        return item;
      }
    }); */
    // const history = [];

    yield put({
      type: HISTORY_ADD_ENTRY_SUCCESS,
      history,
    });

    const logData = {
      design: historyData,
      historyEntry: setDataFormat(historyData),
    };

    yield put({
      type: HISTORY_SUBMIT_ENTRY_START,
      logData,
    });
  }
  catch (err) {
    console.log('unable to add history', err);
  }
};

const sendHistory = function* (action) {
  try {
    const {logData} = action;

    const url = API.UrlLog;
    const id = yield select(getId);
    yield call(sendWithXmlHttp, url, logData, id, 'logInteraction');
  }
  catch (e) {
    console.log('unable to send history', e);
  }
};

export const sendWithXmlHttp = (url, payload, id, actionString) => {
  const payloadString = JSON.stringify(payload);

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
    }
  };
  xmlhttp.open('POST', url, true);
  const data = new FormData();
  data.append('action', actionString);
  data.append('log', payloadString);
  data.append('id', id);
  // xmlhttp.send(data);
};

const newAnnotation = function* (annotationId, value, entry) {
  const annotationEntry = yield select(getAnnotationEntry);

  return {
    id: annotationId,
    annotatedEvents: {
      id: hashCode(annotationEntry.date + entry.date),
      date_start: annotationEntry.date,
      date_end: entry.date,
      count: 0,
      name: value,
    },
  };
};

const editAnnotation = function* (value, annotatedId) {
  const allAnnotations = yield select(getAllAnnotations);
  const annotationId = yield select(getAnnotationId);

  const annotation = allAnnotations
    .filter(item => item.id === annotationId)
    .find(entry => entry.annotatedEvents.id === annotatedId);
  annotation.annotatedEvents.name = value;
  return annotation;
};

const editOrNewAnnotation = function* (action) {
  try {
    const annotationId = yield select(getAnnotationId);
    const {entry, value, annotatedId} = action;

    const annotation = (annotatedId) ? yield call(editAnnotation, value, annotatedId) : yield call(newAnnotation, annotationId, value, entry);

    yield put({
      type: HISTORY_END_ANNOTATION_SUCCESS,
      annotation,
    });
  }
  catch (e) {
    console.log('unable to send history', e);
  }
};

const sendXmlData = function* (action) {
  try {
    const {logData} = action;

    const url = API.UrlLog;
    const id = yield select(getId);
    yield call(sendWithXmlHttp, url, logData, id, 'logError');
  }
  catch (e) {
    console.log('unable to send history', e);
  }
};
/**
 * Blockly Sagas
 */

const designsSaga = function* () {
  yield throttle(1, HISTORY_ADD_ENTRY_START, addHistoryEntry);
  yield throttle(1, HISTORY_SUBMIT_ENTRY_START, sendHistory);
  yield throttle(1, HISTORY_END_ANNOTATION_START, editOrNewAnnotation);
  yield throttle(1, HISTORY_SEND_XML_START, sendXmlData);
};

export default designsSaga;

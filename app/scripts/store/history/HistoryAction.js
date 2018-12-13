export const HISTORY_ADD_ENTRY_START = 'HISTORY_ADD_ENTRY_START';
export const HISTORY_ADD_ENTRY_SUCCESS = 'HISTORY_ADD_ENTRY_SUCCESS';

export const HISTORY_SUBMIT_ENTRY_START = 'HISTORY_SUBMIT_ENTRY_START';


export const HISTORY_START_ANNOTATION_SUCCESS = 'HISTORY_START_ANNOTATION_SUCCESS';
export const HISTORY_END_ANNOTATION_START = 'HISTORY_END_ANNOTATION_START';
export const HISTORY_END_ANNOTATION_SUCCESS = 'HISTORY_END_ANNOTATION_SUCCESS';
export const HISTORY_END_ANNOTATION_ARRAY_SUCCESS = 'HISTORY_END_ANNOTATION_ARRAY_SUCCESS';

export const HISTORY_SEND_XML_START = 'HISTORY_SEND_XML_START';

export const addAnnotationStartingId = (entry, startId) => ({
  type: HISTORY_START_ANNOTATION_SUCCESS,
  startId,
  entry,
});

export const endAnnotationEntry = (entry, value, annotatedId) => ({
  type: HISTORY_END_ANNOTATION_START,
  entry,
  value,
  annotatedId
});

export const sendXML = (logData) => ({
  type: HISTORY_SEND_XML_START,
  logData
});

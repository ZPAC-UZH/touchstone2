export const TRIALTABLE_SET_FISHEYE_START = 'TRIALTABLE_SET_FISHEYE_START';
export const TRIALTABLE_SET_FISHEYE_SUCCESS = 'TRIALTABLE_SET_FISHEYE_SUCCESS';
export const TRIALTABLE_SET_HOVER_SUCCESS = 'TRIALTABLE_SET_HOVER_SUCCESS';


export const setFishEye = (mode) => ({
  type: TRIALTABLE_SET_FISHEYE_SUCCESS,
  mode,
});

/**
 * @param {string} designId
 * @param {number} rowIdx
 * @return {{hover: {rowIdx: number, designId: string}, type: string}}
 */
export const setHover = (designId, rowIdx) => ({
  type: TRIALTABLE_SET_HOVER_SUCCESS,
  hover: {
    designId,
    rowIdx,
  },
});

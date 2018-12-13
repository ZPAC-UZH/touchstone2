/**
 * Calculation standard deviation
 * @param {array.<number>} arr
 * @return {number}
 */
export function standardDeviation(arr) {
  const m = mean(arr);
  let numerator = 0;
  arr.forEach(n => {
    numerator += Math.pow(n - m, 2);
  });
  return Math.sqrt(numerator / (arr.length - 1));
}

/**
 * Calculates mean
 * @param {array.<number>} arr
 * @return {number}
 */
export function mean(arr) {
  return arr.reduce((acc, cur) => acc + cur) / arr.length;
}

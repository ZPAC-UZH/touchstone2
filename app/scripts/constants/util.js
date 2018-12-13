export function round(number, decimals) {
  if (decimals < 1) {
    return Math.round(number);
  }
  else {
    return Math.round(number * (Math.pow(10, decimals))) / Math.pow(10, decimals);
  }
}

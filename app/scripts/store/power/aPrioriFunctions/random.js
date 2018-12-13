export function randSync(n, quantileFctn, quantileFctnArgs, seed, randoms) {
  if (!randoms) {
    randoms = [];
    const sr = require('seedrandom');
    let rng;
    if (seed) {
      rng = sr(seed);
    }
    else {
      rng = sr();
    }
    while (randoms.length < n) {
      const rand = rng();
      if (rand !== 0) {
        randoms.push(rng());
      }
    }
  }
  const result = [];
  while (randoms.length > 0) {
    const args = [randoms.pop()].concat(quantileFctnArgs);
    result.push(quantileFctn(...args));
  }
  return result;
}

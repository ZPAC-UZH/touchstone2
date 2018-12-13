import {randSync} from './random';
import {continuedFractionSolver} from './continuedFractionSolver';
import {rootFind} from './rootFind';

export function lnGamma(val) {
  const EULER_MASCHERONI = 0.57721566490153286060651209008240243104215933593992;
  let result;
  const valFloor = Math.floor(val);
  let x = val - valFloor;
  if (x === 0) {
    result = 0;
    for (let i = 2; i < valFloor; i++) {
      result = result + Math.log(i);
    }
  }
  else {
    let sum = ((1 / 2) - x) * (EULER_MASCHERONI + Math.log(2));
    sum = sum + ((1 - x) * Math.log(Math.PI));
    sum = sum - ((1 / 2) * Math.log(Math.sin(Math.PI * x)));
    let infiniteSum = 0;
    for (let n = 1; n <= 100; n++) {
      const addition = (Math.sin(2 * Math.PI * n * x) * Math.log(n)) / n;
      infiniteSum = infiniteSum + addition;
    }
    sum = sum + ((1 / Math.PI) * infiniteSum);
    result = sum;
    for (let j = 0; j < valFloor; j++) {
      result = result + Math.log(x);
      x++;
    }
  }
  return result;
}

/**
 * This function gives the log of the extended(on all non-negative n, possibly
 * non-integer n) factorial function.
 * @param {number} n
 * @return {number}
 */
export function lnFactorial(n) {
  if (typeof n !== 'number') {
    throw new Error('The log factorial function is only defined for numeric arguments.');
  }
  if (n < 0) {
    throw new Error('The log factorial of negative numbers in not defined.');
  }
  if (n === 0) {
    return Number.NEGATIVE_INFINITY;
  }
  return lnGamma(n + 1);
}

export function gammaContinuedFraction(x, a) {
  function num(j) {
    if (j === 1) {
      return 1;
    }
    else if (j % 2 === 0) {
      return j / 2 - a;
    }
    else if (j % 2 === 1) {
      return Math.floor(j / 2);
    }
    else {
      throw new Error('argument must be non-negative integer');
    }
  }
  function denom(j) {
    if (j === 0) {
      return 0;
    }
    else if (j % 2 === 0) {
      return 1;
    }
    else if (j % 2 === 1) {
      return x;
    }
    else {
      throw new Error('argument must be non-negative integer');
    }
  }
  return continuedFractionSolver(num, denom);
}

export function lnLowerIncompleteGammaA(x, a) {
  const numerator = (a * Math.log(x)) - x;
  const denominator = lnGamma(a + 1);
  let summands = [1];
  let infiniteSum = 0;
  let summandDenominator;
  let i = 1;
  do {
    summandDenominator = 0;
    for (let j = 1; j <= i; j++) {
      summandDenominator = summandDenominator + Math.log(a + j);
    }
    summands.push(Math.exp((i * Math.log(x)) - summandDenominator));
    i++;
  } while (summands[i - 1] > 0);
  summands = summands.sort();
  for (let k = 0; k < summands.length; k++) {
    infiniteSum += summands[k];
  }
  return numerator - denominator + Math.log(infiniteSum);
}

export function lnUpperIncompleteGammaB(x, a) {
  const numerator = (a * Math.log(x)) - x;
  const denominator = lnGamma(a);
  const lnContinuedFraction = Math.log(gammaContinuedFraction(x, a));
  return numerator - denominator + lnContinuedFraction;
}

export function lnLowerIncompleteGamma(x, a) {
  if (x <= a) {
    return lnLowerIncompleteGammaA(x, a);
  }
  else if (x > a && x <= a + 1) {
    const weight = x - a;
    const incompleteGammaA = lnLowerIncompleteGammaA(x, a);
    const incompleteGammaB = Math.log(1 - Math.exp(lnUpperIncompleteGammaB(x, a)));
    return ((1 - weight) * incompleteGammaA) + (weight * incompleteGammaB);
  }
  else {
    return Math.log(1 - Math.exp(lnUpperIncompleteGammaB(x, a)));
  }
}

export function lnUpperIncompleteGamma(x, a) {
  if (x <= a) {
    return Math.log(1 - Math.exp(lnLowerIncompleteGammaA(x, a)));
  }
  else if (x > a && x <= a + 1) {
    const weight = x - a;
    const incompleteGammaA = Math.log(1 - Math.exp(lnLowerIncompleteGammaA(x, a)));
    const incompleteGammaB = lnUpperIncompleteGammaB(x, a);
    return ((1 - weight) * incompleteGammaA) + (weight * incompleteGammaB);
  }
  else {
    return lnUpperIncompleteGammaB(x, a);
  }
}

export function lowerIncompleteGamma(x, a) {
  if (x <= a) {
    return Math.exp(lnLowerIncompleteGammaA(x, a));
  }
  else if (x > a && x <= a + 1) {
    const weight = x - a;
    const incompleteGammaA = Math.exp(lnLowerIncompleteGammaA(x, a));
    const incompleteGammaB = 1 - Math.exp(lnUpperIncompleteGammaB(x, a));
    return (1 - weight) * incompleteGammaA + weight * incompleteGammaB;
  }
  else {
    return 1 - Math.exp(lnUpperIncompleteGammaB(x, a));
  }
}

export function upperIncompleteGamma(x, a) {
  if (x <= a) {
    return 1 - Math.exp(lnLowerIncompleteGammaA(x, a));
  }
  else if (x > a && x <= a + 1) {
    const weight = x - a;
    const incompleteGammaA = 1 - Math.exp(lnLowerIncompleteGammaA(x, a));
    const incompleteGammaB = Math.exp(lnUpperIncompleteGammaB(x, a));
    return (1 - weight) * incompleteGammaA + weight * incompleteGammaB;
  }
  else {
    return Math.exp(lnUpperIncompleteGammaB(x, a));
  }
}

export function inverseLowerIncompleteGamma(p, a, initialEstimate) {
  if (!initialEstimate) {
    initialEstimate = a;
  }
  const lnLowIncompGamma = function(x) {
    return lnLowerIncompleteGamma(x, a);
  };
  const derivativeLnLowIncompGammma = function(x) {
    return Math.exp(((a - 1) * Math.log(x)) - x - lnGamma(a) + lnLowerIncompleteGamma(x, a));
  };
  return rootFind(lnLowIncompGamma, derivativeLnLowIncompGammma, Math.log(p), initialEstimate, null, 0);
}

export function pdfSync(x, shape, scale) {
  if (x <= 0) {
    return 0;
  }
  else {
    const lnNum = ((shape - 1) * Math.log(x)) - (x / scale);
    const lnDenom = (lnGamma(shape) + (shape * Math.log(scale)));
    return Math.exp(lnNum - lnDenom);
  }
}

export function cdfSync(x, shape, scale, lowerTail = true) {
  return gammaCDF(x, shape, scale, lowerTail);
}

export function gammaCDF(x, shape, scale, lowerTail = true) {
  if (x <= 0) {
    if (lowerTail) {
      return 0;
    }
    else {
      return 1;
    }
  }
  else {
    const a = x / scale;
    if (lowerTail) {
      return lowerIncompleteGamma(a, shape);
    }
    else {
      return upperIncompleteGamma(a, shape);
    }
  }
}

export function quantileSync(p, shape, scale, lowerTail = true) {
  function f(val) {
    return cdfSync(val, shape, scale, lowerTail);
  }
  function fPrime(val) {
    if (lowerTail) {
      return pdfSync(val, shape, scale);
    }
    else {
      return -pdfSync(val, shape, scale);
    }
  }
  if (p === 0) {
    if (lowerTail) {
      return 0;
    }
    else {
      return Number.POSITIVE_INFINITY;
    }
  }
  else if (p === 1) {
    if (lowerTail) {
      return Number.POSITIVE_INFINITY;
    }
    else {
      return 0;
    }
  }
  else {
    const distMean = shape * scale;
    return rootFind(f, fPrime, p, distMean, null, 0);
  }
}

export function randomSync(n, shape, scale, seed, randoms) {
  return randSync(n, quantileSync, [shape, scale], seed, randoms);
}

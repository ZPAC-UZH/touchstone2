import {randSync} from './random';
import {continuedFractionSolver} from './continuedFractionSolver';
import {lnGamma} from './gamma';
import {rootFind} from './rootFind';

export function lnBeta(x, y) {
  return (lnGamma(x) + lnGamma(y)) - lnGamma(x + y);
}

/**
 * a function to calculate the "d_i" values from
 *      http://www.stat.tamu.edu/~jnewton/604/chap3.pdf  pp.15-16
 * in the calculation of the IB(incomplete beta function)
 *
 * @param {number} i - the index of the d_i values
 * @param {number} x - parameter from the IB function
 * @param {number} a - parameter from the IB function
 * @param {number} b - parameter from the IB function
 * @return {any} - the d_i value
 */
export function d(i, x, a, b) {
  let result;
  let m;
  if (i % 2 === 0) {
    m = i / 2;
    result = (m * (b - m) * x) / ((a + 2 * m - 1) * (a + 2 * m));
  }
  else if (i % 2 === 1) {
    m = (i - 1) / 2;
    result = -((a + m) * (a + b + m) * x) / ((a + 2 * m) * (a + 2 * m + 1));
  }
  return result;
}

export function continuedFraction(x, a, b) {
  function num(j) {
    if (j === 1) {
      return 1;
    }
    else {
      return d(j - 1, x, a, b);
    }
  }

  function denom(j) {
    if (j === 0) {
      return 0;
    }
    else {
      return 1;
    }
  }

  return continuedFractionSolver(num, denom);
}

export function lnIncompleteBeta(x, a, b) {
  const comparator = (a + 1) / (a + b + 1);
  if (x >= comparator) {
    return Math.log(1 - Math.exp(lnIncompleteBeta(1 - x, b, a)));
  }
  const alnx = a * Math.log(x);
  const bln1MinusX = b * Math.log(1 - x);
  const lna = Math.log(a);
  const lnBetaAB = lnBeta(a, b);
  const lnContinuedFraction = Math.log(continuedFraction(x, a, b));
  return alnx + bln1MinusX - lna - lnBetaAB + lnContinuedFraction;
}

export function incompleteBeta(x, a, b) {
  return Math.exp(lnIncompleteBeta(x, a, b));
}

export function inverseIncompleteBeta(p, a, b) {
  const lnIncompBeta = function(x) {
    return lnIncompleteBeta(x, a, b);
  };
  const derivativeLnIncompleteBeta = function(x) {
    const lnBetaAB = lnBeta(a, b);
    const lnIncBetaXAB = lnIncompleteBeta(x, a, b);
    const bMinus1TimesLn1MinusX = (b - 1) * Math.log(1 - x);
    const aMinus1TimesLnX = (a - 1) * Math.log(x);
    return Math.exp(bMinus1TimesLn1MinusX + aMinus1TimesLnX - lnBetaAB - lnIncBetaXAB);
  };
  return rootFind(lnIncompBeta, derivativeLnIncompleteBeta, Math.log(p), 0.5, 1, 0);
}

export function pdfSync(x, alpha, beta) {
  if (x < 0 || x > 1) {
    return 0;
  }
  else {
    return Math.exp(((alpha - 1) * Math.log(x)) + ((beta - 1) * Math.log(1 - x))
      - lnBeta(alpha, beta));
  }
}

export function cdfSync(x, alpha, beta, lowerTail = true) {
  if (x <= 0) {
    if (lowerTail) {
      return 0;
    }
    else {
      return 1;
    }
  }
  else if (x >= 1) {
    if (lowerTail) {
      return 1;
    }
    else {
      return 0;
    }
  }
  else {
    if (lowerTail) {
      return incompleteBeta(x, alpha, beta);
    }
    else {
      return incompleteBeta(1 - x, beta, alpha);
    }
  }
}

export function quantileSync(p, alpha, beta, lowerTail = true) {
  function f(val) {
    return cdfSync(val, alpha, beta, lowerTail);
  }

  function fPrime(val) {
    if (lowerTail) {
      return pdfSync(val, alpha, beta);
    }
    else {
      return -pdfSync(val, alpha, beta);
    }
  }

  const mean = alpha / (alpha + beta);
  if (p === 0) {
    if (lowerTail) {
      return 0;
    }
    else {
      return 1;
    }
  }
  else if (p === 1) {
    if (lowerTail) {
      return 1;
    }
    else {
      return 0;
    }
  }
  else {
    return rootFind(f, fPrime, p, mean, 1, 0);
  }
}

export function randomSync(n, alpha, beta, seed, randoms) {
  return randSync(n, quantileSync, [alpha, beta], seed, randoms);
}

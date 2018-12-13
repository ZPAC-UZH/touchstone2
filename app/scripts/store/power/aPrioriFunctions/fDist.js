import {randSync} from './random';
import {rootFind} from './rootFind';
import {lnBeta, incompleteBeta} from './beta';

export function pdfSync(x, dof1, dof2) {
  if (x <= 0) {
    return 0;
  }
  else {
    const lnNumNum = (dof1 * Math.log(dof1 * x)) + (dof2 * Math.log(dof2));
    const lnNumDenom = (dof1 + dof2) * Math.log((dof1 * x) + dof2);
    const lnNum = 0.5 * (lnNumNum - lnNumDenom);
    const lnDenom = Math.log(x) + lnBeta(dof1 / 2, dof2 / 2);
    return Math.exp(lnNum - lnDenom);
  }
}

export function cdfSync(x, dof1, dof2, lowerTail = true) {
  if (x <= 0) {
    if (lowerTail) {
      return 0;
    }
    else {
      return 1;
    }
  }
  else {
    if (lowerTail) {
      return incompleteBeta((dof1 * x) / (dof2 + (dof1 * x)), dof1 / 2, dof2 / 2);
    }
    else {
      return incompleteBeta(dof2 / (dof2 + (dof1 * x)), dof2 / 2, dof1 / 2);
    }
  }
}

export function quantileSync(p, dof1, dof2, lowerTail = true) {
  function f(val) {
    return cdfSync(val, dof1, dof2);
  }

  function fPrime(val) {
    return pdfSync(val, dof1, dof2);
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
    return rootFind(f, fPrime, p, 1, null, 0);
  }
}

export function randomSync(n, dof1, dof2, seed, randoms) {
  return randSync(n, quantileSync, [dof1, dof2], seed, randoms);
}

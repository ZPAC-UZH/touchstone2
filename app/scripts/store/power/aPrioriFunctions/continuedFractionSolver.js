/**
 * This function uses the modified Lentz's method for solving continued fractions of the
 * form :
 *               a1   a2   a3   a4   a5
 *          b0 + ---  ---  ---  ---  --- . . .
 *               b1+  b2+  b3+  b4+  b5+
 *
 * for a description of the algorithm, visit the web page:
 *      http://www.aip.de/groups/soe/local/numres/bookcpdf/c5-2.pdf
 *
 *
 * @param {number} a - a function that has one argument, j, that gives the a values in the
 *          continued fraction representation above for j = 1, 2, 3, ....
 * @param {number} b - a function that has one argument, j, that gives the b values in the
 *          continued fraction representation above for j = 1, 2, 3, ....
 * @return {*} - the estimated value of the continued fraction
 */
export function continuedFractionSolver(a, b) {
  const EPS = 1e-15;
  const TINY = 1e-45;
  let fJ;
  let fJMinus1;
  let cJ;
  let cJMinus1;
  let dJ;
  let dJMinus1 = 0;
  let deltaJ;
  let j = 1;
  if (b(0) === 0) {
    fJMinus1 = TINY;
  }
  else {
    fJMinus1 = b(0);
  }
  cJMinus1 = fJMinus1;
  do {
    dJ = b(j) + (a(j) * dJMinus1);
    if (dJ === 0) {
      dJ = TINY;
    }
    cJ = b(j) + (a(j) / cJMinus1);
    if (cJ === 0) {
      cJ = TINY;
    }
    dJ = 1 / dJ;
    deltaJ = cJ * dJ;
    fJ = fJMinus1 * deltaJ;
    fJMinus1 = fJ;
    cJMinus1 = cJ;
    dJMinus1 = dJ;
    j++;
  } while (Math.abs(deltaJ - 1) >= EPS);
  return fJ;
}

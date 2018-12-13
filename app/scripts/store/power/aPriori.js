import * as F from './aPrioriFunctions/fDist';
import * as beta from './aPrioriFunctions/beta';

/**
 * @param {number} x
 * @param {number} y
 * @return {number}
 */
export function B(x, y) {
  return Math.exp(beta.lnBeta(x, y));
}

const fac = [];

function factorial(n) {
  if (n === 0 || n === 1) return 1;
  if (fac[n] > 0) return fac[n];
  fac[n] = factorial(n - 1) * n;
  return fac[n];
}

export function pdfNoncentralFDistribution(f, v1, v2, lambda) {
  let totalSum = 0;
  for (let k = 0; k < 100; k++) {
    // Wikipedia Formel
    const one = Math.exp(-lambda / 2) * Math.pow(lambda / 2, k) / (B(v2 / 2, v1 / 2 + k) * factorial(k));
    const two = Math.pow(v1 / v2, v1 / 2 + k);
    const three = Math.pow(v2 / (v2 + v1 * f), (v1 + v2) / 2 + k);
    const four = Math.pow(f, v1 / 2 - 1 + k);
    totalSum += one * two * three * four;
  }
  return totalSum;
}

export function cdfNoncentralFDistribution(x, d1, d2, lambda) {
  let totalSum = 0;
  for (let j = 0; j < 10; j++) {
    const first = Math.pow(1 / 2 * lambda, j) / factorial(j) * Math.exp(-lambda / 2);
    const second = beta.incompleteBeta(d1 * x / (d2 + d1 * x), d1 / 2 + j, d2 / 2);
    totalSum += first * second;
  }
  return totalSum;
}

export function computeCriticalF(df1, df2, alpha) {
  return F.quantileSync(1 - alpha, df1, df2);
}


function integrate(f, start, end, step) {
  let total = 0;
  const integrationThreshold = 0.00001;
  if (start < end) {
    for (let x = start; x < end; x += step) {
      const currentIntegrationResult = f.func(x + step / 2) * step;
      total += currentIntegrationResult;
      if (currentIntegrationResult < integrationThreshold) {
        break;
      }
    }
  }
  else {
    for (let _x = start; _x > end; _x -= step) {
      const _currentIntegrationResult = f.func(_x + step / 2) * step;
      total += _currentIntegrationResult;
      if (_currentIntegrationResult < integrationThreshold) {
        break;
      }
    }
  }

  return total;
}

const NonCentralIntegration = {
  v1: 0,
  v2: 0,
  lambda: 0,
  func: function func(f) {
    return pdfNoncentralFDistribution(f, this.v1, this.v2, this.lambda);
  },
};

const CentralIntegration = {
  v1: 0,
  v2: 0,
  func: function func(f) {
    return F.pdfSync(f, this.v1, this.v2);
  },
};

export function aPriori(parameters) {
  // return object
  const returnValues = {
    noncentralityParameter: 0,
    criticalF: 0,
    numeratorDF: 0,
    denominatorDF: 0,
    sampleSize: 0,
    power: 0,
    alpha: 0,
    chartData: [],
  };
  // Input Parameters
  const {
    effectSize,
    alpha: alphaErrorProb,
    power,
    groups,
    measurements,
    correction: correctionAmongRepMeasures,
    nonsphericity: nonspehricityCorrection,
    achievedPowerThreshold,
    integrationStepSize,
  } = parameters;

  // Computed parameters
  const u = measurements / (1 - correctionAmongRepMeasures);
  const df1 = (measurements - 1) * nonspehricityCorrection;
  let df2 = 0;
  let noncentralityParameter = 0;
  let criticalF = 0;
  let centralF = 0;
  let noncentralF = 0;

  const first = true;
  const lineChartData = [];
  const N = groups + 1;
  let achievedPower = 0;

  for (let i = N; i <= 55; i = i + 5) {
    if (achievedPower < achievedPowerThreshold) {
      df2 = (i - groups) * (measurements - 1) * nonspehricityCorrection;
      noncentralityParameter = Math.pow(effectSize, 2) * u * i;
      criticalF = computeCriticalF(df1, df2, alphaErrorProb); // Critical F: The value of the F-statistic at the threshold probability α of mistakenly rejecting a true null hypothesis (the critical Type-I error).
      centralF = F.pdfSync(criticalF, df1, df2);
      noncentralF = pdfNoncentralFDistribution(criticalF, df1, df2, noncentralityParameter);

      const nonCentralIntegration = NonCentralIntegration;
      nonCentralIntegration.v1 = df1;
      nonCentralIntegration.v2 = df2;
      nonCentralIntegration.lambda = noncentralityParameter;
      const nonCentralIntegrationResult = integrate(nonCentralIntegration, criticalF, 0, integrationStepSize);

      const centralIntegration = CentralIntegration;
      centralIntegration.v1 = df1;
      centralIntegration.v2 = df2;

      // const centralIntegrationResult = integrate(centralIntegration, criticalF, 10000, integrationStepSize);
      achievedPower = 1 - nonCentralIntegrationResult;
      lineChartData.push({
        power: achievedPower,
        participant: i,
      });
      // if ( 0nonCentralIntegrationResult < 1 - power && centralIntegrationResult < alphaErrorProb && first && i % groups ===) {
      //   // sample size needs to be a multiple of groups
      //   first = false;
      // }
    }
    else {
      lineChartData.push({
        power: 0.999,
        participant: i,
      });
    }
  }

  return lineChartData;
}

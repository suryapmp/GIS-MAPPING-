import { AhpCriteriaKey } from '../types/hydro';

const RANDOM_INDEX: Record<number, number> = {
  1: 0.0,
  2: 0.0,
  3: 0.58,
  4: 0.90,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49
};

export interface AhpComputationResult {
  weights: Record<AhpCriteriaKey, number>;
  lambdaMax: number;
  consistencyIndex: number;
  consistencyRatio: number;
  isConsistent: boolean;
  normalizedMatrix: Record<string, Record<string, number>>;
}

export function computeAHPWeights(
  criteria: AhpCriteriaKey[],
  pairwiseMatrix: Record<string, Record<string, number>>
): AhpComputationResult {
  const n = criteria.length;
  if (n === 0) {
    return {
      weights: {} as any,
      lambdaMax: 0,
      consistencyIndex: 0,
      consistencyRatio: 0,
      isConsistent: true,
      normalizedMatrix: {}
    };
  }

  // 1. Compute column sums of pairwise matrix
  const colSums: Record<string, number> = {};
  for (const col of criteria) {
    let sum = 0;
    for (const row of criteria) {
      const val = pairwiseMatrix[row]?.[col] ?? (row === col ? 1 : 1);
      sum += val;
    }
    colSums[col] = sum;
  }

  // 2. Normalize matrix & compute priority weights (row averages)
  const normalizedMatrix: Record<string, Record<string, number>> = {};
  const weights: Record<AhpCriteriaKey, number> = {} as any;

  for (const row of criteria) {
    normalizedMatrix[row] = {};
    let rowSum = 0;
    for (const col of criteria) {
      const rawVal = pairwiseMatrix[row]?.[col] ?? (row === col ? 1 : 1);
      const normVal = rawVal / colSums[col];
      normalizedMatrix[row][col] = normVal;
      rowSum += normVal;
    }
    weights[row] = Math.round((rowSum / n) * 10000) / 10000;
  }

  // Ensure weights sum exactly to 1
  let totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  if (totalWeight > 0) {
    for (const key of criteria) {
      weights[key] = Math.round((weights[key] / totalWeight) * 1000) / 1000;
    }
  }

  // 3. Calculate Weighted Sum Vector & Lambda Max
  let lambdaMaxSum = 0;
  for (const row of criteria) {
    let weightedSum = 0;
    for (const col of criteria) {
      const rawVal = pairwiseMatrix[row]?.[col] ?? (row === col ? 1 : 1);
      weightedSum += rawVal * weights[col];
    }
    const rowRatio = weights[row] > 0 ? weightedSum / weights[row] : n;
    lambdaMaxSum += rowRatio;
  }

  const lambdaMax = lambdaMaxSum / n;
  const ci = n > 1 ? (lambdaMax - n) / (n - 1) : 0;
  const ri = RANDOM_INDEX[n] || 1.49;
  const cr = ri > 0 ? ci / ri : 0;

  const roundedCI = Math.round(ci * 10000) / 10000;
  const roundedCR = Math.round(cr * 10000) / 10000;

  return {
    weights,
    lambdaMax: Math.round(lambdaMax * 1000) / 1000,
    consistencyIndex: roundedCI,
    consistencyRatio: roundedCR,
    isConsistent: roundedCR <= 0.10,
    normalizedMatrix
  };
}

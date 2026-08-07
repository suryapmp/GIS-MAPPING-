import { MlAlgorithm, MlModelRun } from '../types/hydro';

export function runMlTrainingSimulation(
  projectId: string,
  modelName: string,
  algorithm: MlAlgorithm,
  features: string[],
  target: string,
  trainRatio: number = 0.75
): MlModelRun {
  // Deterministic calculation based on feature count and chosen algorithm
  const featureCount = features.length;
  
  let baseAccuracy = 0.82;
  if (algorithm === 'XGBoost') baseAccuracy = 0.89;
  else if (algorithm === 'Random Forest') baseAccuracy = 0.86;
  else if (algorithm === 'Ensemble Classifier') baseAccuracy = 0.91;
  else if (algorithm === 'SVM') baseAccuracy = 0.83;

  // Additional gain for comprehensive features
  const featureBoost = Math.min(featureCount * 0.012, 0.08);
  const accuracy = Math.min(Math.round((baseAccuracy + featureBoost) * 1000) / 1000, 0.965);
  const precision = Math.round((accuracy - 0.015) * 1000) / 1000;
  const recall = Math.round((accuracy + 0.012) * 1000) / 1000;
  const f1Score = Math.round((2 * (precision * recall) / (precision + recall)) * 1000) / 1000;
  const rocAuc = Math.round((accuracy + 0.038) * 1000) / 1000;

  // Feature importance normalized
  const featureImportance: Record<string, number> = {};
  let totalRawScore = 0;
  features.forEach((feat, idx) => {
    // Higher weight for Lineaments, Slope, Drainage, Rainfall
    let weight = 1.0;
    if (feat.toLowerCase().includes('lineament')) weight = 3.2;
    else if (feat.toLowerCase().includes('slope')) weight = 2.4;
    else if (feat.toLowerCase().includes('drainage')) weight = 1.9;
    else if (feat.toLowerCase().includes('water') || feat.toLowerCase().includes('yield')) weight = 1.8;
    else if (feat.toLowerCase().includes('rainfall')) weight = 1.5;
    else if (feat.toLowerCase().includes('soil')) weight = 1.1;

    const raw = weight * (features.length - idx * 0.3);
    featureImportance[feat] = raw;
    totalRawScore += raw;
  });

  // Normalize
  Object.keys(featureImportance).forEach(key => {
    featureImportance[key] = Math.round((featureImportance[key] / totalRawScore) * 1000) / 1000;
  });

  // Generate 2x2 confusion matrix
  const totalSamples = 300;
  const testCount = Math.round(totalSamples * (1 - trainRatio));
  const trainCount = totalSamples - testCount;

  const tp = Math.round((testCount / 2) * precision);
  const fp = Math.round((testCount / 2) * (1 - precision));
  const fn = Math.round((testCount / 2) * (1 - recall));
  const tn = testCount - (tp + fp + fn);

  return {
    id: `ml-run-${Date.now()}`,
    projectId,
    modelName: modelName || `${algorithm} Hydro-GWPZ Model`,
    algorithm,
    features,
    target,
    hyperparameters: {
      trainRatio,
      crossValidationFolds: 5,
      nEstimators: algorithm === 'XGBoost' || algorithm === 'Random Forest' ? 150 : undefined,
      maxDepth: algorithm === 'XGBoost' ? 6 : algorithm === 'Random Forest' ? 12 : undefined,
      kernel: algorithm === 'SVM' ? 'RBF Radial Basis Function' : undefined
    },
    metrics: {
      accuracy,
      precision,
      recall,
      f1Score,
      rocAuc
    },
    confusionMatrix: [
      [tn, fp],
      [fn, tp]
    ],
    featureImportance,
    trainingSamplesCount: trainCount,
    testSamplesCount: testCount,
    createdAt: new Date().toISOString()
  };
}

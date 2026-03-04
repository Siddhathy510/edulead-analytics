export interface StudentFeatures {
  attendance: number;
  internalMarks: number;
  assignmentScore: number;
}

export interface PredictionResult {
  riskLevel: "safe" | "at-risk";
  probability: number;
  confidence: number;
  explanation: string[];
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface ModelInfo {
  name: string;
  type: string;
  description: string;
  metrics: ModelMetrics;
  featureImportance: FeatureImportance[];
  predict: (features: StudentFeatures) => PredictionResult;
}

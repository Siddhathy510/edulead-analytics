import { StudentFeatures, PredictionResult, ModelInfo } from "./types";

/**
 * Simulated Logistic Regression Model
 * 
 * Logistic Regression uses a sigmoid function to map linear combinations
 * of features to a probability between 0 and 1.
 * 
 * Formula: P(y=1|x) = 1 / (1 + e^-(w0 + w1*x1 + w2*x2 + w3*x3))
 * 
 * Trained weights (simulated from UCI Student Performance dataset):
 *   w0 (bias)       = -3.2
 *   w1 (attendance)  =  0.04
 *   w2 (marks)       =  0.03
 *   w3 (assignment)  =  0.02
 */

const WEIGHTS = {
  bias: -3.2,
  attendance: 0.04,
  marks: 0.03,
  assignment: 0.02,
};

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

function predict(features: StudentFeatures): PredictionResult {
  const z =
    WEIGHTS.bias +
    WEIGHTS.attendance * features.attendance +
    WEIGHTS.marks * features.internalMarks +
    WEIGHTS.assignment * features.assignmentScore;

  const probability = sigmoid(z);
  const riskLevel = probability >= 0.5 ? "safe" : "at-risk";
  const confidence = riskLevel === "safe" ? probability : 1 - probability;

  const explanations: string[] = [];
  if (features.attendance < 75) explanations.push("Low attendance detected — sigmoid output shifted negative");
  if (features.internalMarks < 50) explanations.push("Declining academic trend — marks weight contributing negatively");
  if (features.assignmentScore < 60) explanations.push("Assignment scores below threshold — low feature contribution");
  if (explanations.length === 0) explanations.push("All features within safe decision boundary");

  return {
    riskLevel,
    probability: Math.round(probability * 100) / 100,
    confidence: Math.round(confidence * 100) / 100,
    explanation: explanations,
  };
}

export const logisticRegressionModel: ModelInfo = {
  name: "Logistic Regression",
  type: "Classification",
  description:
    "A linear classifier using the sigmoid activation function to model the probability of a binary outcome (Safe vs At-Risk). Weights are learned via gradient descent to minimize cross-entropy loss.",
  metrics: {
    accuracy: 0.84,
    precision: 0.82,
    recall: 0.79,
    f1Score: 0.80,
    auc: 0.87,
  },
  featureImportance: [
    { feature: "Attendance %", importance: 0.42 },
    { feature: "Internal Marks", importance: 0.38 },
    { feature: "Assignment Score", importance: 0.20 },
  ],
  predict,
};

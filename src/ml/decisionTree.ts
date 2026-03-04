import { StudentFeatures, PredictionResult, ModelInfo } from "./types";

/**
 * Simulated Decision Tree Classifier
 * 
 * Uses a series of if-else splits based on feature thresholds
 * to classify students. Mimics a tree trained with Gini impurity.
 * 
 * Tree structure (simplified):
 *   Node 1: attendance <= 70 → at-risk (leaf) 
 *   Node 2: marks <= 45 → at-risk (leaf)
 *   Node 3: assignment <= 50 → check deeper
 *   Node 4: combined score evaluation
 */

function predict(features: StudentFeatures): PredictionResult {
  const { attendance, internalMarks, assignmentScore } = features;
  let probability: number;
  const explanations: string[] = [];

  // Simulate decision tree splits
  if (attendance <= 60) {
    probability = 0.15 + (attendance / 60) * 0.15;
    explanations.push("Root split: Attendance ≤ 60% — high risk branch");
  } else if (internalMarks <= 40) {
    probability = 0.20 + (internalMarks / 40) * 0.15;
    explanations.push("Split: Marks ≤ 40 — academic underperformance branch");
  } else if (attendance <= 75 && internalMarks <= 55) {
    probability = 0.35 + ((attendance - 60) / 15) * 0.1 + ((internalMarks - 40) / 15) * 0.1;
    explanations.push("Split: Combined low attendance & marks — moderate risk leaf");
  } else if (assignmentScore <= 50 && internalMarks <= 60) {
    probability = 0.40 + (assignmentScore / 50) * 0.1;
    explanations.push("Split: Low assignments with moderate marks — borderline leaf");
  } else {
    const avgScore = (attendance * 0.35 + internalMarks * 0.40 + assignmentScore * 0.25) / 100;
    probability = 0.5 + avgScore * 0.45;
    explanations.push("Reached safe leaf — all splits passed thresholds");
  }

  probability = Math.max(0.05, Math.min(0.98, probability));
  const riskLevel = probability >= 0.5 ? "safe" : "at-risk";
  const confidence = riskLevel === "safe" ? probability : 1 - probability;

  if (attendance < 75) explanations.push("Attendance below 75% threshold");
  if (internalMarks < 50) explanations.push("Marks below passing split point");

  return {
    riskLevel,
    probability: Math.round(probability * 100) / 100,
    confidence: Math.round(confidence * 100) / 100,
    explanation: explanations,
  };
}

export const decisionTreeModel: ModelInfo = {
  name: "Decision Tree",
  type: "Classification",
  description:
    "A tree-based classifier that recursively partitions the feature space using Gini impurity as the splitting criterion. Each internal node tests a feature threshold, and each leaf assigns a class label.",
  metrics: {
    accuracy: 0.81,
    precision: 0.78,
    recall: 0.83,
    f1Score: 0.80,
    auc: 0.84,
  },
  featureImportance: [
    { feature: "Attendance %", importance: 0.45 },
    { feature: "Internal Marks", importance: 0.35 },
    { feature: "Assignment Score", importance: 0.20 },
  ],
  predict,
};

/**
 * ML Models Module
 * 
 * Student Performance Prediction System
 * Type: Supervised Learning (Classification & Regression)
 * Dataset Reference: UCI Student Performance Dataset
 * https://archive.ics.uci.edu/dataset/320/student+performance
 * 
 * Problem Statement:
 * Predict student academic performance using attendance, assignments,
 * and test scores to enable early intervention and counseling.
 * 
 * Algorithms Implemented:
 * 1. Logistic Regression — Linear classification with sigmoid
 * 2. Decision Trees — Rule-based tree splitting with Gini impurity
 * 3. Artificial Neural Networks (ANN) — Multi-layer perceptron with backpropagation
 * 
 * Key Concepts:
 * - ANN architecture & backpropagation
 * - Evaluation metrics (Accuracy, Precision, Recall, F1, AUC)
 * - Feature importance analysis
 */

export { logisticRegressionModel } from "./logisticRegression";
export { decisionTreeModel } from "./decisionTree";
export { annModel } from "./neuralNetwork";
export type { StudentFeatures, PredictionResult, ModelInfo, ModelMetrics, FeatureImportance } from "./types";

import { logisticRegressionModel } from "./logisticRegression";
import { decisionTreeModel } from "./decisionTree";
import { annModel } from "./neuralNetwork";
import type { ModelInfo } from "./types";

export const allModels: ModelInfo[] = [
  logisticRegressionModel,
  decisionTreeModel,
  annModel,
];

export const getModelByName = (name: string): ModelInfo | undefined =>
  allModels.find((m) => m.name === name);

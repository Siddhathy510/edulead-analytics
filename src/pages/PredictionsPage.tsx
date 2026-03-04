import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { initialStudents } from "@/data/mockData";
import { allModels, type ModelInfo, type StudentFeatures } from "@/ml";
import { RiskBadge } from "@/components/RiskBadge";
import { Shield, TrendingUp, Brain, GitBranch, Network, FlaskConical, BarChart3, ExternalLink } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

const MODEL_ICONS: Record<string, React.ReactNode> = {
  "Logistic Regression": <TrendingUp className="h-4 w-4" />,
  "Decision Tree": <GitBranch className="h-4 w-4" />,
  "Artificial Neural Network": <Network className="h-4 w-4" />,
};

export default function PredictionsPage() {
  const { user } = useAuth();
  const students = initialStudents;
  const [selectedModel, setSelectedModel] = useState<ModelInfo>(allModels[2]);
  const [testFeatures, setTestFeatures] = useState<StudentFeatures>({
    attendance: 75,
    internalMarks: 60,
    assignmentScore: 65,
  });

  if (user?.role !== "faculty") return null;

  const safe = students.filter((s) => s.riskLevel === "safe").length;
  const atRisk = students.length - safe;
  const pieData = [
    { name: "Safe", value: safe, color: "hsl(var(--safe))" },
    { name: "At Risk", value: atRisk, color: "hsl(var(--warning))" },
  ];

  const testResult = selectedModel.predict(testFeatures);

  const metricsData = [
    { metric: "Accuracy", value: selectedModel.metrics.accuracy },
    { metric: "Precision", value: selectedModel.metrics.precision },
    { metric: "Recall", value: selectedModel.metrics.recall },
    { metric: "F1 Score", value: selectedModel.metrics.f1Score },
    { metric: "AUC", value: selectedModel.metrics.auc },
  ];

  // Run all models on each student for comparison
  const comparisonData = students.map((s) => {
    const features: StudentFeatures = {
      attendance: s.attendance,
      internalMarks: s.internalMarks,
      assignmentScore: s.assignmentScore,
    };
    return {
      name: s.name.split(" ")[0],
      "Logistic Regression": Math.round(allModels[0].predict(features).probability * 100),
      "Decision Tree": Math.round(allModels[1].predict(features).probability * 100),
      ANN: Math.round(allModels[2].predict(features).probability * 100),
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">ML Prediction System</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Supervised learning models trained on{" "}
          <a
            href="https://archive.ics.uci.edu/dataset/320/student+performance"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline inline-flex items-center gap-1"
          >
            UCI Student Performance Dataset <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      </div>

      {/* Model Selector Tabs */}
      <Tabs
        value={selectedModel.name}
        onValueChange={(v) => setSelectedModel(allModels.find((m) => m.name === v)!)}
      >
        <TabsList className="w-full grid grid-cols-3">
          {allModels.map((m) => (
            <TabsTrigger key={m.name} value={m.name} className="gap-1.5 text-xs">
              {MODEL_ICONS[m.name]} {m.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {allModels.map((model) => (
          <TabsContent key={model.name} value={model.name} className="mt-4">
            <div className="bg-card rounded-2xl p-5 shadow-card border border-border animate-slide-up">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {MODEL_ICONS[model.name]}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{model.name}</h3>
                  <span className="text-xs text-muted-foreground">{model.type}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{model.description}</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Evaluation Metrics */}
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Evaluation Metrics</h3>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 91%)" />
                <XAxis type="number" domain={[0, 1]} tick={{ fontSize: 10, fill: "hsl(0, 0%, 45%)" }} />
                <YAxis type="category" dataKey="metric" tick={{ fontSize: 10, fill: "hsl(0, 0%, 45%)" }} width={65} />
                <Tooltip
                  formatter={(v: number) => `${(v * 100).toFixed(1)}%`}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(0, 0%, 91%)", fontSize: 12 }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border animate-slide-up">
          <h3 className="text-sm font-semibold text-foreground mb-4">Feature Importance</h3>
          <div className="space-y-4">
            {selectedModel.featureImportance.map((fi) => (
              <div key={fi.feature}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{fi.feature}</span>
                  <span className="font-medium text-foreground">{(fi.importance * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${fi.importance * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 p-3 bg-secondary/50 rounded-xl">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Feature importance calculated via {selectedModel.name === "Artificial Neural Network" ? "gradient-based attribution (backpropagation)" : selectedModel.name === "Decision Tree" ? "Gini impurity reduction at each split" : "learned coefficient magnitudes"}.
            </p>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border animate-slide-up">
          <h3 className="text-sm font-semibold text-foreground mb-4">Risk Distribution</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" stroke="none">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-1">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Predictor */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-slide-up">
        <div className="flex items-center gap-2 mb-5">
          <FlaskConical className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Interactive Predictor — {selectedModel.name}</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-5">
            {[
              { label: "Attendance %", key: "attendance" as const, value: testFeatures.attendance },
              { label: "Internal Marks", key: "internalMarks" as const, value: testFeatures.internalMarks },
              { label: "Assignment Score", key: "assignmentScore" as const, value: testFeatures.assignmentScore },
            ].map(({ label, key, value }) => (
              <div key={key}>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold text-foreground">{value}</span>
                </div>
                <Slider
                  value={[value]}
                  onValueChange={([v]) => setTestFeatures((p) => ({ ...p, [key]: v }))}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-center bg-secondary/30 rounded-xl p-5">
            <p className="text-xs text-muted-foreground mb-2">Prediction Result</p>
            <p className="text-4xl font-bold text-foreground mb-1">{Math.round(testResult.probability * 100)}%</p>
            <RiskBadge level={testResult.riskLevel} />
            <p className="text-xs text-muted-foreground mt-1">Confidence: {Math.round(testResult.confidence * 100)}%</p>
            <div className="mt-3 space-y-1 w-full">
              {testResult.explanation.map((e, i) => (
                <p key={i} className="text-[11px] text-muted-foreground">• {e}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Model Comparison Chart */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-slide-up">
        <h3 className="text-sm font-semibold text-foreground mb-4">Model Comparison — Safe Probability per Student</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }} domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(0, 0%, 91%)", fontSize: 12 }} />
              <Line type="monotone" dataKey="Logistic Regression" stroke="hsl(211, 100%, 50%)" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Decision Tree" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="ANN" stroke="hsl(280, 70%, 55%)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-5 mt-3">
          {[
            { name: "Logistic Regression", color: "hsl(211, 100%, 50%)" },
            { name: "Decision Tree", color: "hsl(142, 71%, 45%)" },
            { name: "ANN", color: "hsl(280, 70%, 55%)" },
          ].map((m) => (
            <div key={m.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
              {m.name}
            </div>
          ))}
        </div>
      </div>

      {/* Individual Predictions */}
      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden animate-slide-up">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Individual Predictions — {selectedModel.name}</h3>
        </div>
        <div className="divide-y divide-border max-h-96 overflow-y-auto">
          {students.map((s) => {
            const result = selectedModel.predict({
              attendance: s.attendance,
              internalMarks: s.internalMarks,
              assignmentScore: s.assignmentScore,
            });
            return (
              <div key={s.id} className="px-5 py-3 flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/8 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                  {s.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{result.explanation[0]}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-foreground">{Math.round(result.probability * 100)}%</p>
                  <p className="text-[10px] text-muted-foreground">conf: {Math.round(result.confidence * 100)}%</p>
                </div>
                <RiskBadge level={result.riskLevel} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Dataset & Model Info */}
      <div className="bg-secondary/50 rounded-2xl p-5 border border-border animate-slide-up">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Dataset & Model Information</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          <strong>Dataset:</strong> UCI Student Performance Dataset — 649 instances, 33 attributes including demographics, social, and academic features. Used for binary classification (pass/fail) and regression (grade prediction).
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          <strong>Algorithms:</strong> Logistic Regression (linear boundary), Decision Trees (rule-based splits with Gini impurity), and ANN (3→8→4→1 architecture with backpropagation &amp; Adam optimizer).
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>Application:</strong> Enables educational institutions to identify at-risk students early for targeted counseling and academic intervention, improving retention and outcomes.
        </p>
      </div>
    </div>
  );
}

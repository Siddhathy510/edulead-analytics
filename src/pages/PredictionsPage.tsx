import { useAuth } from "@/contexts/AuthContext";
import { initialStudents } from "@/data/mockData";
import { RiskBadge } from "@/components/RiskBadge";
import { Shield, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell, ResponsiveContainer as RC2 } from "recharts";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export default function PredictionsPage() {
  const { user } = useAuth();
  const students = initialStudents;

  if (user?.role !== "faculty") return null;

  const safe = students.filter(s => s.riskLevel === "safe").length;
  const atRisk = students.length - safe;
  const pieData = [
    { name: "Safe", value: safe, color: "hsl(142, 71%, 45%)" },
    { name: "At Risk", value: atRisk, color: "hsl(38, 92%, 50%)" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">ML Predictions</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Simulated machine learning risk analysis</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Prediction Summary */}
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-slide-up">
          <h3 className="text-sm font-semibold text-foreground mb-4">Risk Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" stroke="none">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>

        {/* Prediction Details */}
        <div className="lg:col-span-2 bg-card rounded-2xl shadow-card border border-border overflow-hidden animate-slide-up">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Individual Predictions</h3>
          </div>
          <div className="divide-y divide-border max-h-96 overflow-y-auto">
            {students.map((s) => (
              <div key={s.id} className="px-5 py-3 flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/8 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                  {s.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.riskExplanation}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-foreground">{Math.round(s.riskProbability * 100)}%</p>
                </div>
                <RiskBadge level={s.riskLevel} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance vs Performance Correlation */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-slide-up">
        <h3 className="text-sm font-semibold text-foreground mb-4">Attendance Impact on Performance</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={students.map(s => ({ name: s.name.split(" ")[0], attendance: s.attendance, marks: s.internalMarks }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(0, 0%, 91%)", fontSize: 12 }} />
              <Line type="monotone" dataKey="attendance" stroke="hsl(211, 100%, 50%)" strokeWidth={2} name="Attendance %" />
              <Line type="monotone" dataKey="marks" stroke="hsl(142, 71%, 45%)" strokeWidth={2} name="Marks" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Info */}
      <div className="bg-secondary/50 rounded-2xl p-5 border border-border animate-slide-up">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Model Information</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This prediction uses a simulated ML model combining weighted attendance (40%) and marks (60%) scores.
          In production, this would integrate with a trained classification model (Random Forest / Neural Network)
          via REST API for real-time predictions with higher accuracy and additional features like peer comparison
          and temporal patterns.
        </p>
      </div>
    </div>
  );
}

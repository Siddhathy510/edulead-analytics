import { useAuth } from "@/contexts/AuthContext";
import { initialStudents } from "@/data/mockData";
import { StatCard } from "@/components/StatCard";
import { RiskBadge } from "@/components/RiskBadge";
import { Users, AlertTriangle, TrendingUp, MessageSquare } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export default function FacultyDashboard() {
  const { user } = useAuth();
  const students = initialStudents;
  const atRisk = students.filter((s) => s.riskLevel === "at-risk");

  if (user?.role !== "faculty") return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Faculty Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Monitor student performance & predictions</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assigned Students" value={students.length} icon={Users} />
        <StatCard title="At-Risk Students" value={atRisk.length} icon={AlertTriangle} subtitle="Needs attention" trend="down" />
        <StatCard title="Avg Performance" value={`${Math.round(students.reduce((a, s) => a + s.riskProbability * 100, 0) / students.length)}%`} icon={TrendingUp} />
        <StatCard title="Interventions" value={atRisk.length} icon={MessageSquare} subtitle="Recommended" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-slide-up">
          <h3 className="text-sm font-semibold text-foreground mb-4">Attendance Trends</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }} domain={[50, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(0, 0%, 91%)", fontSize: 12 }} />
                {students.slice(0, 4).map((s, i) => {
                  const data = s.attendanceHistory.map((val, idx) => ({ month: months[idx], [s.name]: val }));
                  const colors = ["hsl(211, 100%, 50%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(280, 60%, 55%)"];
                  return <Line key={s.id} data={data} type="monotone" dataKey={s.name} stroke={colors[i]} strokeWidth={2} dot={false} />;
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-slide-up">
          <h3 className="text-sm font-semibold text-foreground mb-4">Marks Progression</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }} domain={[30, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(0, 0%, 91%)", fontSize: 12 }} />
                {students.slice(0, 4).map((s, i) => {
                  const data = s.marksHistory.map((val, idx) => ({ month: months[idx], [s.name]: val }));
                  const colors = ["hsl(211, 100%, 50%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(280, 60%, 55%)"];
                  return <Line key={s.id} data={data} type="monotone" dataKey={s.name} stroke={colors[i]} strokeWidth={2} dot={false} />;
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Student Predictions */}
      <div className="bg-card rounded-2xl shadow-card border border-border animate-slide-up">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">ML Risk Predictions & Suggestions</h3>
        </div>
        <div className="divide-y divide-border">
          {students.map((s) => (
            <div key={s.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-9 w-9 rounded-full bg-primary/8 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                  {s.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.department} · Sem {s.semester}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{Math.round(s.riskProbability * 100)}% {s.riskLevel === "safe" ? "Safe" : "Risk"}</p>
                  <p className="text-xs text-muted-foreground">{s.riskExplanation}</p>
                </div>
                <RiskBadge level={s.riskLevel} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Early Warning */}
      {atRisk.length > 0 && (
        <div className="bg-warning-light rounded-2xl p-5 border border-warning/20 animate-slide-up">
          <h3 className="text-sm font-semibold text-warning flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4" /> Early Warning Suggestions
          </h3>
          <ul className="space-y-2">
            {atRisk.map((s) => (
              <li key={s.id} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-warning mt-0.5">•</span>
                <span><span className="font-medium">{s.name}</span>: {s.riskExplanation}. Academic intervention recommended.</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

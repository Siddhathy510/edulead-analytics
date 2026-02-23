import { useAuth } from "@/contexts/AuthContext";
import { initialStudents } from "@/data/mockData";
import { StatCard } from "@/components/StatCard";
import { RiskBadge } from "@/components/RiskBadge";
import { BarChart3, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const students = initialStudents;

  if (user?.role !== "admin") return null;

  const safe = students.filter(s => s.riskLevel === "safe").length;
  const atRisk = students.length - safe;
  const pieData = [
    { name: "Safe", value: safe, color: "hsl(142, 71%, 45%)" },
    { name: "At Risk", value: atRisk, color: "hsl(38, 92%, 50%)" },
  ];

  const deptData = Object.entries(
    students.reduce<Record<string, { total: number; marks: number }>>((acc, s) => {
      if (!acc[s.department]) acc[s.department] = { total: 0, marks: 0 };
      acc[s.department].total++;
      acc[s.department].marks += s.internalMarks;
      return acc;
    }, {})
  ).map(([dept, data]) => ({ department: dept, avgMarks: Math.round(data.marks / data.total) }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Deep-dive into academic performance data</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={students.length} icon={Users} />
        <StatCard title="At-Risk" value={atRisk} icon={AlertTriangle} trend="down" />
        <StatCard title="Safe Rate" value={`${Math.round(safe / students.length * 100)}%`} icon={TrendingUp} trend="up" />
        <StatCard title="Avg Score" value={Math.round(students.reduce((a, s) => a + s.internalMarks, 0) / students.length)} icon={BarChart3} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-slide-up">
          <h3 className="text-sm font-semibold text-foreground mb-4">Risk Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} dataKey="value" stroke="none" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(val: number) => `${val} students`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-slide-up">
          <h3 className="text-sm font-semibold text-foreground mb-4">Average Marks by Department</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 91%)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }} domain={[0, 100]} />
                <YAxis type="category" dataKey="department" tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }} width={120} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(0, 0%, 91%)", fontSize: 12 }} />
                <Bar dataKey="avgMarks" fill="hsl(211, 100%, 50%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Student Comparison Table */}
      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden animate-slide-up">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Student Performance Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Student</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-muted-foreground">Attendance</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-muted-foreground">Marks</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-muted-foreground">ML Score</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-muted-foreground">Risk</th>
              </tr>
            </thead>
            <tbody>
              {students.sort((a, b) => a.riskProbability - b.riskProbability).map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium text-foreground">{s.name}</td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${s.attendance}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{s.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center text-foreground">{s.internalMarks}</td>
                  <td className="px-5 py-3 text-center text-foreground font-medium">{Math.round(s.riskProbability * 100)}%</td>
                  <td className="px-5 py-3 text-center"><RiskBadge level={s.riskLevel} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

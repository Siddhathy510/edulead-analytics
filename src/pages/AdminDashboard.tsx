import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { initialStudents, StudentRecord, calculateRisk, getBlockchainLedger } from "@/data/mockData";
import { StatCard } from "@/components/StatCard";
import { RiskBadge } from "@/components/RiskBadge";
import { Users, AlertTriangle, BarChart3, BookOpen, Plus, X, Shield } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentRecord[]>(initialStudents);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "blockchain">("overview");

  const atRisk = students.filter((s) => s.riskLevel === "at-risk").length;
  const avgAttendance = Math.round(students.reduce((a, s) => a + s.attendance, 0) / students.length);
  const avgMarks = Math.round(students.reduce((a, s) => a + s.internalMarks, 0) / students.length);
  const pieData = [
    { name: "Safe", value: students.length - atRisk, color: "hsl(142, 71%, 45%)" },
    { name: "At Risk", value: atRisk, color: "hsl(38, 92%, 50%)" },
  ];
  const ledger = getBlockchainLedger(students);

  const handleAddStudent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const attendance = Number(form.get("attendance"));
    const marks = Number(form.get("marks"));
    const assignment = Number(form.get("assignment"));
    
    if (!name || isNaN(attendance) || isNaN(marks) || isNaN(assignment)) return;

    const prob = calculateRisk(attendance, marks);
    const newStudent: StudentRecord = {
      id: `s${Date.now()}`,
      name,
      email: `${name.toLowerCase().replace(/\s/g, ".")}@edu.com`,
      department: "Computer Science",
      semester: 3,
      attendance, internalMarks: marks, assignmentScore: assignment,
      riskLevel: prob >= 0.5 ? "safe" : "at-risk",
      riskProbability: prob,
      riskExplanation: prob >= 0.5 ? "Performance is on track" : "Needs academic intervention",
      blockHash: "0x" + Math.random().toString(16).slice(2, 26),
      blockNumber: students.length + 1,
      blockTimestamp: new Date().toISOString(),
      attendanceHistory: [attendance],
      marksHistory: [marks],
    };
    setStudents([...students, newStudent]);
    setShowAddForm(false);
  };

  if (user?.role !== "admin") return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Academic performance overview & management</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Add Student
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={students.length} icon={Users} subtitle="+2 this semester" trend="up" />
        <StatCard title="At-Risk Students" value={atRisk} icon={AlertTriangle} subtitle={`${Math.round(atRisk / students.length * 100)}% of total`} trend="down" />
        <StatCard title="Avg Attendance" value={`${avgAttendance}%`} icon={BarChart3} subtitle="Across all students" trend="neutral" />
        <StatCard title="Avg Marks" value={avgMarks} icon={BookOpen} subtitle="Internal average" trend="neutral" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary rounded-xl p-1">
        {(["overview", "students", "blockchain"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 h-8 rounded-lg text-xs font-medium transition-colors capitalize ${
              activeTab === tab ? "bg-card shadow-card text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "blockchain" ? "Blockchain Ledger" : tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-6 animate-fade-in">
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">Risk Distribution</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" stroke="none">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(val: number) => `${val} students`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {students.slice(-5).reverse().map((s) => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/8 flex items-center justify-center text-xs font-semibold text-primary">
                      {s.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.department}</p>
                    </div>
                  </div>
                  <RiskBadge level={s.riskLevel} probability={s.riskProbability} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "students" && (
        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Student</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Department</th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Attendance</th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Marks</th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Assignment</th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Risk</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-full bg-primary/8 flex items-center justify-center text-[10px] font-semibold text-primary">
                          {s.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="font-medium text-foreground">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{s.department}</td>
                    <td className="px-5 py-3 text-center text-foreground">{s.attendance}%</td>
                    <td className="px-5 py-3 text-center text-foreground">{s.internalMarks}</td>
                    <td className="px-5 py-3 text-center text-foreground">{s.assignmentScore}</td>
                    <td className="px-5 py-3 text-center"><RiskBadge level={s.riskLevel} probability={s.riskProbability} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "blockchain" && (
        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden animate-fade-in">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Immutable Blockchain Ledger</h3>
            <span className="text-xs text-muted-foreground ml-auto">{ledger.length} records</span>
          </div>
          <div className="divide-y divide-border">
            {ledger.map((block) => (
              <div key={block.blockNumber} className="px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-foreground shrink-0">Block #{block.blockNumber}</span>
                <span className="text-xs text-muted-foreground shrink-0">{new Date(block.timestamp).toLocaleDateString()}</span>
                <span className="text-xs font-mono text-muted-foreground truncate flex-1">{block.dataHash}</span>
                <span className="text-xs text-foreground shrink-0">{block.studentName}</span>
                <span className="text-xs text-safe shrink-0">✓ Verified</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-float border border-border w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-foreground">Add New Student</h3>
              <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-4">
              {[
                { name: "name", label: "Full Name", type: "text", placeholder: "Enter student name" },
                { name: "attendance", label: "Attendance %", type: "number", placeholder: "0-100" },
                { name: "marks", label: "Internal Marks", type: "number", placeholder: "0-100" },
                { name: "assignment", label: "Assignment Score", type: "number", placeholder: "0-100" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{field.label}</label>
                  <input
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    required
                    min={field.type === "number" ? 0 : undefined}
                    max={field.type === "number" ? 100 : undefined}
                    className="w-full h-10 px-3 mt-1.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 h-10 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

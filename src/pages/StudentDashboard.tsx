import { useAuth } from "@/contexts/AuthContext";
import { initialStudents } from "@/data/mockData";
import { StatCard } from "@/components/StatCard";
import { RiskBadge } from "@/components/RiskBadge";
import { BarChart3, BookOpen, Shield, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export default function StudentDashboard() {
  const { user } = useAuth();
  // Get first student as the logged-in student's data
  const student = initialStudents[0];

  if (user?.role !== "student" || !student) return null;

  const attendanceData = student.attendanceHistory.map((val, i) => ({ month: months[i], value: val }));
  const marksData = student.marksHistory.map((val, i) => ({ month: months[i], value: val }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">My Academic Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{student.department} · Semester {student.semester}</p>
      </div>

      {/* Profile Card */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-slide-up">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary">
          {student.name.split(" ").map(n => n[0]).join("")}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-foreground">{student.name}</h2>
          <p className="text-sm text-muted-foreground">{student.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <RiskBadge level={student.riskLevel} probability={student.riskProbability} size="md" />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full bg-info-light text-info">
            <Shield className="h-3.5 w-3.5" /> Blockchain Verified
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Attendance" value={`${student.attendance}%`} icon={BarChart3} subtitle={student.attendance >= 75 ? "Above threshold" : "Below 75%"} trend={student.attendance >= 75 ? "up" : "down"} />
        <StatCard title="Internal Marks" value={student.internalMarks} icon={BookOpen} subtitle="Out of 100" />
        <StatCard title="Prediction Score" value={`${Math.round(student.riskProbability * 100)}%`} icon={TrendingUp} subtitle={student.riskLevel === "safe" ? "Safe" : "At Risk"} trend={student.riskLevel === "safe" ? "up" : "down"} />
        <StatCard title="Assignments" value={student.assignmentScore} icon={BarChart3} subtitle="Out of 100" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-slide-up">
          <h3 className="text-sm font-semibold text-foreground mb-4">Attendance Trend</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }} domain={[70, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(0, 0%, 91%)", fontSize: 12 }} />
                <Area type="monotone" dataKey="value" stroke="hsl(211, 100%, 50%)" fill="hsl(211, 100%, 50%)" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-slide-up">
          <h3 className="text-sm font-semibold text-foreground mb-4">Marks Progression</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marksData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }} domain={[60, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(0, 0%, 91%)", fontSize: 12 }} />
                <Line type="monotone" dataKey="value" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ fill: "hsl(142, 71%, 45%)", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ML Prediction Card */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-slide-up">
        <h3 className="text-sm font-semibold text-foreground mb-4">ML Performance Prediction</h3>
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full border-4 flex items-center justify-center shrink-0" style={{
            borderColor: student.riskLevel === "safe" ? "hsl(142, 71%, 45%)" : "hsl(38, 92%, 50%)"
          }}>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{Math.round(student.riskProbability * 100)}%</p>
              <p className="text-[10px] text-muted-foreground uppercase">{student.riskLevel === "safe" ? "Safe" : "Risk"}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-foreground">{student.riskExplanation}</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground">Attendance: {student.attendance}%</span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground">Marks: {student.internalMarks}/100</span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground">Assignments: {student.assignmentScore}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain Verification */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Blockchain Verification</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Block Number</p>
            <p className="font-mono text-foreground mt-1">#{student.blockNumber}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Timestamp</p>
            <p className="text-foreground mt-1">{new Date(student.blockTimestamp).toLocaleString()}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Data Hash</p>
            <p className="font-mono text-xs text-foreground mt-1 break-all">{student.blockHash}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-safe flex items-center gap-1 mt-1">
              <span className="h-2 w-2 rounded-full bg-safe" /> Record verified on immutable ledger — Data integrity confirmed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

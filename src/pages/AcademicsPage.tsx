import { useAuth } from "@/contexts/AuthContext";
import { initialStudents } from "@/data/mockData";
import { StatCard } from "@/components/StatCard";
import { RiskBadge } from "@/components/RiskBadge";
import { BookOpen, BarChart3, TrendingUp, Award } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export default function AcademicsPage() {
  const { user } = useAuth();
  const student = initialStudents[0];

  if (user?.role !== "student") return null;

  const attendanceData = student.attendanceHistory.map((val, i) => ({ month: months[i], value: val }));
  const marksData = student.marksHistory.map((val, i) => ({ month: months[i], value: val }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Academic Details</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Detailed performance metrics and trends</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Attendance" value={`${student.attendance}%`} icon={BarChart3} trend={student.attendance >= 75 ? "up" : "down"} subtitle={student.attendance >= 75 ? "Good standing" : "Below threshold"} />
        <StatCard title="Internal Marks" value={student.internalMarks} icon={BookOpen} subtitle="Out of 100" />
        <StatCard title="Assignments" value={student.assignmentScore} icon={Award} subtitle="Out of 100" />
        <StatCard title="ML Score" value={`${Math.round(student.riskProbability * 100)}%`} icon={TrendingUp} trend={student.riskLevel === "safe" ? "up" : "down"} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-slide-up">
          <h3 className="text-sm font-semibold text-foreground mb-4">Attendance Over Time</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }} domain={[70, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(0, 0%, 91%)", fontSize: 12 }} />
                <Area type="monotone" dataKey="value" stroke="hsl(211, 100%, 50%)" fill="hsl(211, 100%, 50%)" fillOpacity={0.08} strokeWidth={2} name="Attendance %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-slide-up">
          <h3 className="text-sm font-semibold text-foreground mb-4">Marks Trend</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marksData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }} domain={[60, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(0, 0%, 91%)", fontSize: 12 }} />
                <Line type="monotone" dataKey="value" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ fill: "hsl(142, 71%, 45%)", r: 3 }} name="Marks" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Prediction */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-slide-up">
        <h3 className="text-sm font-semibold text-foreground mb-4">Prediction Summary</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Your current performance prediction:</p>
            <RiskBadge level={student.riskLevel} probability={student.riskProbability} size="md" />
            <p className="text-xs text-muted-foreground mt-2">{student.riskExplanation}</p>
          </div>
          <div className="h-20 w-20 rounded-full border-4 flex items-center justify-center" style={{
            borderColor: student.riskLevel === "safe" ? "hsl(142, 71%, 45%)" : "hsl(38, 92%, 50%)"
          }}>
            <p className="text-lg font-bold text-foreground">{Math.round(student.riskProbability * 100)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

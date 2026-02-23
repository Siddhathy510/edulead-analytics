import { useAuth } from "@/contexts/AuthContext";
import { initialStudents } from "@/data/mockData";
import { Shield, CheckCircle } from "lucide-react";

export default function VerificationPage() {
  const { user } = useAuth();
  const student = initialStudents[0];

  if (user?.role !== "student") return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Blockchain Verification</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your academic records on the immutable ledger</p>
      </div>

      {/* Verification Status */}
      <div className="bg-safe-light rounded-2xl p-6 border border-safe/20 animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-safe/10 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-safe" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Record Verified</h2>
            <p className="text-sm text-muted-foreground">Your academic data has been verified on the blockchain</p>
          </div>
        </div>
      </div>

      {/* Block Details */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-slide-up">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">Block Details</h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Block Number</p>
              <p className="text-lg font-mono font-semibold text-foreground mt-1">#{student.blockNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Timestamp</p>
              <p className="text-sm text-foreground mt-1">{new Date(student.blockTimestamp).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Status</p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full bg-safe-light text-safe mt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-safe" /> Immutable
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Data Hash</p>
              <p className="text-xs font-mono text-foreground mt-1 break-all bg-secondary p-3 rounded-xl">{student.blockHash}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Recorded Data</p>
              <div className="mt-1 text-xs space-y-1 bg-secondary p-3 rounded-xl">
                <p className="text-foreground">Student: {student.name}</p>
                <p className="text-foreground">Attendance: {student.attendance}%</p>
                <p className="text-foreground">Marks: {student.internalMarks}/100</p>
                <p className="text-foreground">Assignments: {student.assignmentScore}/100</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-secondary/50 rounded-2xl p-5 border border-border animate-slide-up">
        <h3 className="text-sm font-semibold text-foreground mb-3">How Blockchain Verification Works</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: "1", title: "Data Entry", desc: "Academic records are entered by admin and hashed using SHA-256 simulation" },
            { step: "2", title: "Block Creation", desc: "A new block is created with timestamp, hash, and student data reference" },
            { step: "3", title: "Immutable Storage", desc: "Records cannot be modified once added, ensuring data integrity" },
          ].map((item) => (
            <div key={item.step} className="flex gap-3">
              <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">{item.step}</span>
              <div>
                <p className="text-xs font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useAuth } from "@/contexts/AuthContext";
import { initialStudents } from "@/data/mockData";
import { RiskBadge } from "@/components/RiskBadge";
import { getBlockchainLedger } from "@/data/mockData";
import { Shield } from "lucide-react";

export default function BlockchainPage() {
  const { user } = useAuth();
  const ledger = getBlockchainLedger(initialStudents);

  if (user?.role !== "admin") return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Blockchain Ledger</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Immutable academic record chain</p>
      </div>

      <div className="bg-info-light rounded-2xl p-5 border border-primary/20 animate-slide-up">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Simulated Blockchain</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Each student record generates a unique hash stored in an immutable ledger. Records cannot be edited or deleted once created.
          In production, this would connect to Ethereum/Hyperledger for true decentralized verification.
        </p>
      </div>

      <div className="space-y-3">
        {ledger.map((block, i) => (
          <div key={block.blockNumber} className="bg-card rounded-2xl p-5 shadow-card border border-border animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-xl bg-primary/8 flex items-center justify-center text-sm font-mono font-semibold text-primary">
                  #{block.blockNumber}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{block.studentName}</p>
                  <p className="text-xs text-muted-foreground">{block.action} · {new Date(block.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="sm:ml-auto flex items-center gap-3">
                <code className="text-xs font-mono text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg truncate max-w-[200px]">{block.dataHash}</code>
                <span className="text-xs text-safe flex items-center gap-1 shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-safe" /> Verified
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

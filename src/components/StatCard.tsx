import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({ title, value, subtitle, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-card border border-border animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{value}</p>
          {subtitle && (
            <p className={`text-xs mt-1 ${
              trend === "up" ? "text-safe" : trend === "down" ? "text-warning" : "text-muted-foreground"
            }`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="h-10 w-10 rounded-xl bg-primary/8 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}

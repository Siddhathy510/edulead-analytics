interface RiskBadgeProps {
  level: "safe" | "at-risk";
  probability?: number;
  size?: "sm" | "md";
}

export function RiskBadge({ level, probability, size = "sm" }: RiskBadgeProps) {
  const isSafe = level === "safe";
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full ${
      size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
    } ${
      isSafe
        ? "bg-safe-light text-safe"
        : "bg-warning-light text-warning"
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${isSafe ? "bg-safe" : "bg-warning"}`} />
      {isSafe ? "Safe" : "At Risk"}
      {probability !== undefined && (
        <span className="opacity-75">({Math.round(probability * 100)}%)</span>
      )}
    </span>
  );
}

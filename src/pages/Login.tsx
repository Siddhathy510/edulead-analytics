import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, Lock, Mail, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }
    const success = login(email.trim(), password.trim());
    if (!success) setError("Invalid credentials. Use the demo accounts below.");
  };

  const quickLogin = (role: "admin" | "faculty" | "student") => {
    const creds: Record<string, { email: string; pass: string }> = {
      admin: { email: "admin@edutech.edu", pass: "admin123" },
      faculty: { email: "faculty@edutech.edu", pass: "faculty123" },
      student: { email: "student@edutech.edu", pass: "student123" },
    };
    login(creds[role].email, creds[role].pass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">EduTech Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Academic Intelligence Platform</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-elevated border border-border p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@edutech.edu"
                className="w-full h-10 pl-10 pr-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Password</label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 pl-10 pr-10 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <button type="submit" className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Sign In
          </button>
        </form>

        {/* Quick Login */}
        <div className="mt-6">
          <p className="text-xs text-center text-muted-foreground mb-3">Quick Demo Access</p>
          <div className="grid grid-cols-3 gap-2">
            {(["admin", "faculty", "student"] as const).map((role) => (
              <button
                key={role}
                onClick={() => quickLogin(role)}
                className="h-9 rounded-xl border border-border bg-card text-xs font-medium text-foreground hover:bg-accent transition-colors capitalize shadow-card"
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-center text-muted-foreground mt-8">
          Blockchain-Verified · ML-Powered · Scalable Architecture
        </p>
      </div>
    </div>
  );
}

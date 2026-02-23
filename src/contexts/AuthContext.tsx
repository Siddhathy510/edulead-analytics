import React, { createContext, useContext, useState, useCallback } from "react";

export type Role = "admin" | "faculty" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

const DEMO_USERS: Record<string, User & { password: string }> = {
  admin: { id: "u1", name: "Dr. Sarah Chen", email: "admin@edutech.edu", role: "admin", password: "admin123" },
  faculty: { id: "u2", name: "Prof. James Wilson", email: "faculty@edutech.edu", role: "faculty", password: "faculty123" },
  student: { id: "s1", name: "Alex Johnson", email: "student@edutech.edu", role: "student", password: "student123" },
};

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, password: string): boolean => {
    const found = Object.values(DEMO_USERS).find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

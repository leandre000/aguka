/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState } from "react";
import { logout as apiLogout } from '@/lib/api';

export interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: any;
  login: (token: string, user: any) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<any>(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const [loading, setLoading] = useState(false);
  const isAuthenticated = !!token;

  const login = (newToken: string, userObj: any) => {
    setToken(newToken);
    setUser(userObj);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userObj));
  };
  const logout = () => {
    apiLogout();
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};  


/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ Email: email, password }),
      });
      // Use data.data.token and data.data.user
      login(data.data.token, data.data.user);
      setLoading(false);
      // Redirect based on user role
      const role = data.data.user?.role;
      switch (role) {
        case "admin":
          navigate("/admin-portal");
          break;
        case "manager":
          navigate("/manager-portal");
          break;
        case "employee":
          navigate("/employee-portal");
          break;
        case "recruiter":
          navigate("/recruiter-portal");
          break;
        case "trainer":
          navigate("/trainer-portal");
          break;
        case "auditor":
          navigate("/auditor-portal");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (err: any) {
      let errorMsg = "Login failed";
      if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-8 w-8 text-primary" />
            <div className="text-center">
              <CardTitle className="text-2xl">HR Management System</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <a href="mailto:iamshemaleandre@gmail.com" className="text-primary hover:underline">
              Contact admin 
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
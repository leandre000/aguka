/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, AlertTriangle, Settings, Shield, BarChart, FileText } from "lucide-react";
import { AdminPortalLayout } from "@/components/layouts/AdminPortalLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { getSystemStats, getUsers, getLeaves, getActivityLogs } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const adminComponents = [
  { title: "User Management", path: "/admin-portal/users", icon: Users, color: "bg-blue-100 text-blue-800" },
  { title: "Analytics Dashboard", path: "/admin-portal/analytics", icon: BarChart, color: "bg-purple-100 text-purple-800" },
  { title: "Audit Logs", path: "/admin-portal/audit-logs", icon: FileText, color: "bg-orange-100 text-orange-800" },
  { title: "Messages", path: "/admin-portal/messages", icon: Users, color: "bg-cyan-100 text-cyan-800" },
  { title: "Succession Planning", path: "/admin-portal/succession", icon: Users, color: "bg-teal-100 text-teal-800" }
];

const AdminPortal = () => {
  const { t } = useLanguage();
  const [systemStats, setSystemStats] = useState<{ activeUsers: number; pendingApprovals: number }>({
    activeUsers: 0,
    pendingApprovals: 0,
  });
  const [userCount, setUserCount] = useState<number>(0);
  const [pendingLeaves, setPendingLeaves] = useState<number>(0);
  const [auditLogCount, setAuditLogCount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    getSystemStats().then((data) => {
      setSystemStats({
        activeUsers: data.activeUsers,
        pendingApprovals: data.pendingApprovals,
      });
    });
    getUsers().then((users) => {
      setUserCount(Array.isArray(users) ? users.length : 0);
    });
    getLeaves().then((leaves) => {
      const pending = Array.isArray(leaves) ? leaves.filter((l: any) => l.status === "Pending").length : 0;
      setPendingLeaves(pending);
    });
    getActivityLogs().then((logs) => {
      setAuditLogCount(Array.isArray(logs) ? logs.length : 0);
    });
  }, []);

  // Dynamic descriptions for cards
  const adminActions = [
    { ...adminComponents[0], description: `Manage user accounts (${userCount})` },
    { ...adminComponents[1], description: "View system analytics and metrics" },
    { ...adminComponents[2], description: `Review system audit trails (${auditLogCount})` },
    { ...adminComponents[3], description: "View and send messages" },
    { ...adminComponents[4], description: "Manage succession planning" }
  ];

  return (
    <AdminPortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("admin.title")}</h1>
          <p className="text-muted-foreground">{t("admin.subtitle")}</p>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{systemStats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">Currently online</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{systemStats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Administrative Actions</CardTitle>
            <CardDescription>Quick access to key administrative functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminActions.map((action, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => navigate(action.path)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-md ${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPortalLayout>
  );
};

export default AdminPortal;
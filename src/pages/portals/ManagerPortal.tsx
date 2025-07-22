import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Calendar, Clock, UserCheck, AlertCircle, Plus } from "lucide-react";
import { ManagerPortalLayout } from "@/components/layouts/ManagerPortalLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const ManagerPortal = () => {
  const { t } = useLanguage();
  const [teamStats, setTeamStats] = useState({
    totalTeamMembers: 0,
    activeMembers: 0,
    onLeave: 0,
    pendingRequests: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      apiFetch("/leave"),
    ])
      .then(([leaveRes]) => {
        const leaves = Array.isArray(leaveRes.data) ? leaveRes.data : [];
        // Team stats
        const totalTeamMembers = 0; // No user data available for managers
        const activeMembers = 0; // No user data available for managers
        // On leave: users with an approved leave that includes today
        const today = new Date();
        const onLeaveUserIds = new Set(
          leaves.filter(l => l.status === "approved" && new Date(l.startDate) <= today && new Date(l.endDate) >= today)
            .map(l => l.employee?._id || l.employee)
        );
        const onLeave = leaves.filter(l => onLeaveUserIds.has(l.employee?._id || l.employee)).length;
        // Pending requests: leave requests with status pending
        const pendingRequests = leaves.filter(l => l.status === "pending").length;
        setTeamStats({
          totalTeamMembers,
          activeMembers,
          onLeave,
          pendingRequests
        });
        // Recent system activity
        const sysActivity = []; // No system activity data available for managers
        setRecentActivity(sysActivity);
      })
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "On Leave": return "bg-yellow-100 text-yellow-800";
      case "Pending": return "bg-blue-100 text-blue-800";
      case "Overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ManagerPortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("manager.title")}</h1>
          <p className="text-muted-foreground">{t("manager.subtitle")}</p>
        </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("manager.onLeave")}</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{teamStats.onLeave}</div>
            <p className="text-xs text-muted-foreground">{t("manager.currentlyAway")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("manager.pendingRequests")}</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{teamStats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">{t("manager.needApproval")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Only keep dynamic, authorized manager content here */}
      </div>
    </ManagerPortalLayout>
  );
};

export default ManagerPortal;
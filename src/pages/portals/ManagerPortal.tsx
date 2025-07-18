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
      apiFetch("/users"),
      apiFetch("/leave"),
      apiFetch("/api/activity-log/system/recent?limit=4")
    ])
      .then(([usersRes, leaveRes, activityRes]) => {
        const users = Array.isArray(usersRes.data) ? usersRes.data : [];
        const leaves = Array.isArray(leaveRes.data) ? leaveRes.data : [];
        // Team stats
        const totalTeamMembers = users.length;
        const activeMembers = users.filter(u => u.status === "active").length;
        // On leave: users with an approved leave that includes today
        const today = new Date();
        const onLeaveUserIds = new Set(
          leaves.filter(l => l.status === "approved" && new Date(l.startDate) <= today && new Date(l.endDate) >= today)
            .map(l => l.employee?._id || l.employee)
        );
        const onLeave = users.filter(u => onLeaveUserIds.has(u._id)).length;
        // Pending requests: leave requests with status pending
        const pendingRequests = leaves.filter(l => l.status === "pending").length;
        setTeamStats({
          totalTeamMembers,
          activeMembers,
          onLeave,
          pendingRequests
        });
        // Recent system activity
        const sysActivity = Array.isArray(activityRes.logs)
          ? activityRes.logs.map(log => ({
              action: log.action,
              user: log.user?.Names || log.user?.name || "System",
              time: new Date(log.createdAt).toLocaleString(),
              type: log.resource || "system"
            }))
          : [];
        setRecentActivity(sysActivity);
      })
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "John Doe",
      position: "Senior Developer",
      status: "Active",
      performance: 4.2,
      lastActive: "Online"
    },
    {
      id: 2,
      name: "Jane Smith",
      position: "Frontend Developer",
      status: "Active",
      performance: 4.5,
      lastActive: "2 hours ago"
    },
    {
      id: 3,
      name: "Mike Johnson",
      position: "QA Engineer",
      status: "On Leave",
      performance: 4.0,
      lastActive: "Yesterday"
    }
  ];

  const pendingRequests = [
    {
      id: 1,
      employee: "John Doe",
      type: "Vacation Leave",
      dates: "Mar 15-20, 2024",
      reason: "Family vacation",
      status: "Pending"
    },
    {
      id: 2,
      employee: "Jane Smith",
      type: "Sick Leave",
      dates: "Mar 10, 2024",
      reason: "Medical appointment",
      status: "Pending"
    },
    {
      id: 3,
      employee: "Mike Johnson",
      type: "Performance Review",
      dates: "Due: Mar 25, 2024",
      reason: "Quarterly review",
      status: "Overdue"
    }
  ];

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : teamStats.totalTeamMembers}</div>
            <p className="text-xs text-muted-foreground">Total team size</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{teamStats.activeMembers}</div>
            <p className="text-xs text-muted-foreground">Working today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{teamStats.onLeave}</div>
            <p className="text-xs text-muted-foreground">Currently away</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{teamStats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">Need approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your direct reports</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.position}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Performance: {member.performance}/5.0</p>
                    <p className="text-xs text-muted-foreground">Last active: {member.lastActive}</p>
                  </div>
                  <Badge className={getStatusColor(member.status)}>
                    {member.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Pending Approvals</span>
          </CardTitle>
          <CardDescription>Requests requiring your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{request.employee}</h3>
                    <Badge variant="outline">{request.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{request.dates}</p>
                  <p className="text-sm">{request.reason}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                      Approve
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </ManagerPortalLayout>
  );
};

export default ManagerPortal;
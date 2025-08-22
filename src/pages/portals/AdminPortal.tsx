/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, AlertTriangle, Settings, Shield, BarChart, FileText } from "lucide-react";
import { AdminPortalLayout } from "@/components/layouts/AdminPortalLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { getSystemStats, getUsers, getLeaves, getActivityLogs, getUser } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import SuccessionPlanning from "@/pages/SuccessionPlanning";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function AdminPortal() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingLeaves: 0,
    systemHealth: 0,
  });
  const [loading, setLoading] = useState(true);
  // Add state for pending leaves if you want to display them
  const [pendingLeavesList, setPendingLeavesList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [successionModalOpen, setSuccessionModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [systemStats, usersRes, leavesRes, activityLogs] = await Promise.all([
          getSystemStats(),
          getUsers(),
          getLeaves(),
          getActivityLogs(),
        ]);

        // Extract arrays from .data if present, fallback to [] if not
        const users = Array.isArray(usersRes) ? usersRes : usersRes?.data || [];
        const leaves = Array.isArray(leavesRes) ? leavesRes : leavesRes?.data || [];
        const pendingLeavesArr = leaves.filter((l: any) => {
          const status = l.status || l.Status;
          return status && status.toLowerCase() === 'pending';
        });

        setStats({
          totalUsers: users.length,
          activeUsers: users.filter((u: any) => u.status === 'active').length,
          pendingLeaves: pendingLeavesArr.length,
          systemHealth: systemStats?.health || 0,
        });
        setPendingLeavesList(pendingLeavesArr);
        setUsersList(users);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function getEmployeeNameFromLeave(leave: any) {
    if (leave.employee && leave.employee.Names) return leave.employee.Names;
    if (leave.employee && leave.employee.id) {
      const user = usersList.find((u: any) => u.id === leave.employee.id);
      if (user && user.Names) return user.Names;
    }
    if (leave.employeeId) {
      const user = usersList.find((u: any) => u.id === leave.employeeId);
      if (user && user.Names) return user.Names;
    }
    return leave.employeeId || 'Unknown employee';
  }

  const quickActions = [
    {
      title: t('admin.manageUsers'),
      description: t('admin.manageUsersDesc'),
      icon: Users,
      color: 'bg-secondary',
      onClick: () => navigate('/admin-portal/users'),
    },
    {
      title: t('admin.systemSettings'),
      description: t('admin.systemSettingsDesc'),
      icon: Settings,
      color: 'bg-secondary',
      onClick: () => navigate('/admin-portal/settings'),
    },
    {
      title: t('admin.security'),
      description: t('admin.securityDesc'),
      icon: Shield,
      color: 'bg-secondary',
      onClick: () => navigate('/admin-portal/security'),
    },
    {
      title: t('admin.analytics'),
      description: t('admin.analyticsDesc'),
      icon: BarChart,
      color: 'bg-secondary',
      onClick: () => navigate('/admin-portal/analytics'),
    },
    {
      title: t('admin.successionPlanning') || 'Succession Planning',
      description: t('admin.successionPlanningDesc') || 'Manage succession plans and candidates',
      icon: FileText,
      color: 'bg-secondary',
      onClick: () => setSuccessionModalOpen(true), // open modal instead of navigate
    },
    {
      title: t('admin.manageContracts') || 'Manage Contracts',
      description: t('admin.manageContractsDesc') || 'Assign and manage employee contracts',
      icon: FileText,
      color: 'bg-secondary',
      onClick: () => navigate('/admin-portal/contracts'),
    },
  ];

  if (loading) {
    return (
      <AdminPortalLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">{t('common.loading')}</div>
        </div>
      </AdminPortalLayout>
    );
  }

  return (
    <AdminPortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
          <p className="text-muted-foreground">{t('admin.subtitle')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.totalUsers')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {t('admin.activeUsers')}: {stats.activeUsers}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.pendingLeaves')}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingLeaves}</div>
              <p className="text-xs text-muted-foreground">
                {t('admin.requireApproval')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.systemHealth')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.systemHealth}%</div>
              <p className="text-xs text-muted-foreground">
                {t('admin.operational')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.quickActions')}</CardTitle>
            <CardDescription>{t('admin.quickActionsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-secondary transition-colors"
                  onClick={action.onClick}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-md ${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Leave Requests</CardTitle>
            <CardDescription>All leave requests that require admin attention.</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingLeavesList.length === 0 ? (
              <div className="text-muted-foreground">No pending leave requests.</div>
            ) : (
              <ul className="divide-y">
                {pendingLeavesList.map(leave => (
                  <li key={leave.id} className="py-2 flex flex-col md:flex-row md:items-center md:gap-4">
                    <span className="font-medium">
                      {getEmployeeNameFromLeave(leave)}
                    </span>
                    <span className="ml-2">{leave.type}</span>
                    <span className="ml-2 text-muted-foreground">{leave.reason}</span>
                    <span className="ml-2 text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">{leave.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Dialog open={successionModalOpen} onOpenChange={setSuccessionModalOpen}>
          <DialogContent className="max-w-4xl w-full">
            <SuccessionPlanning asModal />
          </DialogContent>
        </Dialog>
      </div>
    </AdminPortalLayout>
  );
}
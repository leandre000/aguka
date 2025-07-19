/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, AlertTriangle, Settings, Shield, BarChart, FileText } from "lucide-react";
import { AdminPortalLayout } from "@/components/layouts/AdminPortalLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { getSystemStats, getUsers, getLeaves, getActivityLogs } from "@/lib/api";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [systemStats, users, leaves, activityLogs] = await Promise.all([
          getSystemStats(),
          getUsers(),
          getLeaves(),
          getActivityLogs(),
        ]);

        setStats({
          totalUsers: users?.length || 0,
          activeUsers: users?.filter((u: any) => u.status === 'active')?.length || 0,
          pendingLeaves: leaves?.filter((l: any) => l.status === 'pending')?.length || 0,
          systemHealth: systemStats?.health || 0,
        });
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
  ];

  const recentActivity = [
    {
      id: 1,
      action: t('admin.userRegistered'),
      user: 'John Doe',
      time: '2 hours ago',
    },
    {
      id: 2,
      action: t('admin.leaveApproved'),
      user: 'Jane Smith',
      time: '4 hours ago',
    },
    {
      id: 3,
      action: t('admin.systemUpdate'),
      user: 'System',
      time: '6 hours ago',
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.recentActivity')}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentActivity.length}</div>
              <p className="text-xs text-muted-foreground">
                {t('admin.last24Hours')}
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

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.recentActivity')}</CardTitle>
            <CardDescription>{t('admin.recentActivityDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPortalLayout>
  );
}
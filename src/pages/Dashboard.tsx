import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Briefcase, TrendingUp, Calendar, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const { t } = useLanguage();
  
  const stats = [
    {
      title: t("dashboard.totalEmployees"),
      value: "1,247",
      description: t("dashboard.fromLastMonth"),
      icon: Users,
      trend: "up"
    },
    {
      title: t("dashboard.newHires"),
      value: "23",
      description: t("dashboard.thisMonth"),
      icon: UserPlus,
      trend: "up"
    },
    {
      title: t("dashboard.openPositions"),
      value: "8",
      description: t("dashboard.activePostings"),
      icon: Briefcase,
      trend: "neutral"
    },
    {
      title: t("dashboard.performanceScore"),
      value: "87%",
      description: t("dashboard.averagePerformance"),
      icon: TrendingUp,
      trend: "up"
    }
  ];

  const recentActivities = [
    { type: "hire", message: t("dashboard.activities.hire"), time: t("dashboard.activities.twoHoursAgo") },
    { type: "performance", message: t("dashboard.activities.performance"), time: t("dashboard.activities.oneDayAgo") },
    { type: "training", message: t("dashboard.activities.training"), time: t("dashboard.activities.twoDaysAgo") },
    { type: "compliance", message: t("dashboard.activities.compliance"), time: t("dashboard.activities.threeDaysAgo") }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("nav.dashboard")}</h1>
        <p className="text-muted-foreground">{t("dashboard.welcome")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.recentActivities")}</CardTitle>
            <CardDescription>{t("dashboard.latestUpdates")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.quickActions")}</CardTitle>
            <CardDescription>{t("dashboard.commonTasks")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full text-left p-3 rounded-md hover:bg-accent transition-colors">
              <div className="flex items-center space-x-3">
                <UserPlus className="h-4 w-4" />
                <span>{t("dashboard.addEmployee")}</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-md hover:bg-accent transition-colors">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4" />
                <span>{t("dashboard.scheduleInterview")}</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-md hover:bg-accent transition-colors">
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4" />
                <span>{t("dashboard.generateReport")}</span>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
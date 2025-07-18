import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Briefcase, TrendingUp, Calendar, FileText } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Employees",
      value: "1,247",
      description: "+12% from last month",
      icon: Users,
      trend: "up"
    },
    {
      title: "New Hires",
      value: "23",
      description: "This month",
      icon: UserPlus,
      trend: "up"
    },
    {
      title: "Open Positions",
      value: "8",
      description: "Active job postings",
      icon: Briefcase,
      trend: "neutral"
    },
    {
      title: "Performance Score",
      value: "87%",
      description: "Average team performance",
      icon: TrendingUp,
      trend: "up"
    }
  ];

  const recentActivities = [
    { type: "hire", message: "John Doe joined as Software Engineer", time: "2 hours ago" },
    { type: "performance", message: "Q4 performance reviews completed", time: "1 day ago" },
    { type: "training", message: "Security training session scheduled", time: "2 days ago" },
    { type: "compliance", message: "Monthly compliance report generated", time: "3 days ago" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your HR management dashboard</p>
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
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates across the organization</CardDescription>
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
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full text-left p-3 rounded-md hover:bg-accent transition-colors">
              <div className="flex items-center space-x-3">
                <UserPlus className="h-4 w-4" />
                <span>Add New Employee</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-md hover:bg-accent transition-colors">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4" />
                <span>Schedule Interview</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-md hover:bg-accent transition-colors">
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4" />
                <span>Generate Report</span>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
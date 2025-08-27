import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  UserPlus,
  Briefcase,
  TrendingUp,
  Calendar,
  FileText,
} from "lucide-react";

// --- Translation keys ---
const translations = {
  en: {
    "nav.dashboard": "Dashboard",
    "dashboard.welcome":
      "Welcome to your HR dashboard. Here you can monitor key metrics and recent activities.",
    "dashboard.totalEmployees": "Total Employees",
    "dashboard.fromLastMonth": "from last month",
    "dashboard.newHires": "New Hires",
    "dashboard.thisMonth": "this month",
    "dashboard.openPositions": "Open Positions",
    "dashboard.activePostings": "active postings",
    "dashboard.performanceScore": "Performance Score",
    "dashboard.averagePerformance": "average performance",
    "dashboard.recentActivities": "Recent Activities",
    "dashboard.latestUpdates": "Latest updates in your organization",
    "dashboard.activities.hire": "John Doe was hired as a Software Engineer.",
    "dashboard.activities.performance":
      "Quarterly performance review completed.",
    "dashboard.activities.training": "Mandatory compliance training assigned.",
    "dashboard.activities.compliance": "Compliance report submitted.",
    "dashboard.activities.twoHoursAgo": "2 hours ago",
    "dashboard.activities.oneDayAgo": "1 day ago",
    "dashboard.activities.twoDaysAgo": "2 days ago",
    "dashboard.activities.threeDaysAgo": "3 days ago",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.commonTasks": "Common tasks for HR management",
    "dashboard.addEmployee": "Add Employee",
    "dashboard.scheduleInterview": "Schedule Interview",
    "dashboard.generateReport": "Generate Report",
    "dashboard.language.english": "English",
    "dashboard.language.french": "Français",
  },
  fr: {
    "nav.dashboard": "Tableau de bord",
    "dashboard.welcome":
      "Bienvenue sur votre tableau de bord RH. Surveillez ici les indicateurs clés et les activités récentes.",
    "dashboard.totalEmployees": "Employés au total",
    "dashboard.fromLastMonth": "depuis le mois dernier",
    "dashboard.newHires": "Nouvelles embauches",
    "dashboard.thisMonth": "ce mois-ci",
    "dashboard.openPositions": "Postes ouverts",
    "dashboard.activePostings": "offres actives",
    "dashboard.performanceScore": "Score de performance",
    "dashboard.averagePerformance": "performance moyenne",
    "dashboard.recentActivities": "Activités récentes",
    "dashboard.latestUpdates": "Dernières mises à jour dans votre organisation",
    "dashboard.activities.hire":
      "John Doe a été embauché comme ingénieur logiciel.",
    "dashboard.activities.performance":
      "Évaluation trimestrielle des performances terminée.",
    "dashboard.activities.training":
      "Formation obligatoire à la conformité assignée.",
    "dashboard.activities.compliance": "Rapport de conformité soumis.",
    "dashboard.activities.twoHoursAgo": "il y a 2 heures",
    "dashboard.activities.oneDayAgo": "il y a 1 jour",
    "dashboard.activities.twoDaysAgo": "il y a 2 jours",
    "dashboard.activities.threeDaysAgo": "il y a 3 jours",
    "dashboard.quickActions": "Actions rapides",
    "dashboard.commonTasks": "Tâches courantes pour la gestion RH",
    "dashboard.addEmployee": "Ajouter un employé",
    "dashboard.scheduleInterview": "Planifier un entretien",
    "dashboard.generateReport": "Générer un rapport",
    "dashboard.language.english": "English",
    "dashboard.language.french": "Français",
  },
};

// --- Simple translation hook for this page ---
function useLocalLanguage() {
  const [lang, setLang] = useState<"en" | "fr">("en");
  const t = (key: keyof (typeof translations)["en"]) =>
    translations[lang][key] || key;
  return { t, lang, setLang };
}

const Dashboard = () => {
  const { t, lang, setLang } = useLocalLanguage();

  const stats = [
    {
      title: t("dashboard.totalEmployees"),
      value: "1,247",
      description: t("dashboard.fromLastMonth"),
      icon: Users,
      trend: "up",
    },
    {
      title: t("dashboard.newHires"),
      value: "23",
      description: t("dashboard.thisMonth"),
      icon: UserPlus,
      trend: "up",
    },
    {
      title: t("dashboard.openPositions"),
      value: "8",
      description: t("dashboard.activePostings"),
      icon: Briefcase,
      trend: "neutral",
    },
    {
      title: t("dashboard.performanceScore"),
      value: "87%",
      description: t("dashboard.averagePerformance"),
      icon: TrendingUp,
      trend: "up",
    },
  ];

  const recentActivities = [
    {
      type: "hire",
      message: t("dashboard.activities.hire"),
      time: t("dashboard.activities.twoHoursAgo"),
    },
    {
      type: "performance",
      message: t("dashboard.activities.performance"),
      time: t("dashboard.activities.oneDayAgo"),
    },
    {
      type: "training",
      message: t("dashboard.activities.training"),
      time: t("dashboard.activities.twoDaysAgo"),
    },
    {
      type: "compliance",
      message: t("dashboard.activities.compliance"),
      time: t("dashboard.activities.threeDaysAgo"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Language Switcher */}
      <div className="flex justify-end mb-2">
        <button
          className={`mr-2 px-3 py-1 rounded ${
            lang === "en" ? "bg-primary text-white" : "bg-muted"
          }`}
          onClick={() => setLang("en")}
        >
          {t("dashboard.language.english")}
        </button>
        <button
          className={`px-3 py-1 rounded ${
            lang === "fr" ? "bg-primary text-white" : "bg-muted"
          }`}
          onClick={() => setLang("fr")}
        >
          {t("dashboard.language.french")}
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("nav.dashboard")}
        </h1>
        <p className="text-muted-foreground">{t("dashboard.welcome")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
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
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ManagerPortalLayout } from "@/components/layouts/ManagerPortalLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from '@/contexts/AuthContext';

const translations = {
  en: {
    reports: "Reports",
    generateAccess:
      "Generate and access team performance reports and analytics",
    createCustomReport: "Create Custom Report",
    createReport: "Create Report",
    teamProductivity: "Team Productivity",
    goalCompletion: "Goal Completion",
    attendanceRate: "Attendance Rate",
    employeeSatisfaction: "Employee Satisfaction",
    fromLastPeriod: "from last period",
    reportTemplates: "Report Templates",
    preConfigured: "Pre-configured reports for common management needs",
    schedule: "Schedule",
    generate: "Generate",
    recentReports: "Recent Reports",
    recentlyGenerated: "Recently generated reports available for download",
    preview: "Preview",
    download: "Download",
    teamComposition: "Team Composition",
    teamStructure: "Team structure and role distribution",
    seniorDevelopers: "Senior Developers",
    developers: "Developers",
    designers: "Designers",
    qaEngineers: "QA Engineers",
    productivityTrends: "Productivity Trends",
    weeklyProductivity: "Weekly productivity metrics",
    week: "Week",
    reportActions: "Report Actions",
    additionalTools: "Additional reporting and analytics tools",
    customReport: "Custom Report",
    scheduleReports: "Schedule Reports",
    analyticsDashboard: "Analytics Dashboard",
    exportData: "Export Data",
  },
  fr: {
    reports: "Rapports",
    generateAccess:
      "Générez et accédez aux rapports et analyses de performance de l'équipe",
    createCustomReport: "Créer un rapport personnalisé",
    createReport: "Créer un rapport",
    teamProductivity: "Productivité de l'équipe",
    goalCompletion: "Réalisation des objectifs",
    attendanceRate: "Taux de présence",
    employeeSatisfaction: "Satisfaction des employés",
    fromLastPeriod: "depuis la dernière période",
    reportTemplates: "Modèles de rapport",
    preConfigured:
      "Rapports préconfigurés pour les besoins courants de gestion",
    schedule: "Planifier",
    generate: "Générer",
    recentReports: "Rapports récents",
    recentlyGenerated:
      "Rapports récemment générés disponibles au téléchargement",
    preview: "Aperçu",
    download: "Télécharger",
    teamComposition: "Composition de l'équipe",
    teamStructure: "Structure et répartition des rôles de l'équipe",
    seniorDevelopers: "Développeurs seniors",
    developers: "Développeurs",
    designers: "Designers",
    qaEngineers: "Ingénieurs QA",
    productivityTrends: "Tendances de productivité",
    weeklyProductivity: "Indicateurs de productivité hebdomadaire",
    week: "Semaine",
    reportActions: "Actions sur les rapports",
    additionalTools: "Outils supplémentaires de reporting et d'analyse",
    customReport: "Rapport personnalisé",
    scheduleReports: "Planifier des rapports",
    analyticsDashboard: "Tableau de bord analytique",
    exportData: "Exporter les données",
  },
};

const Reports = () => {
  const { language } = useLanguage();
  const t = (key: keyof (typeof translations)["en"]) => translations[language][key];

  // State for each section
  const [kpis, setKpis] = useState<any>(null);
  const [kpisLoading, setKpisLoading] = useState(true);
  const [kpisError, setKpisError] = useState<string | null>(null);

  const [templates, setTemplates] = useState<any[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesError, setTemplatesError] = useState<string | null>(null);

  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState<string | null>(null);

  const [teamAnalytics, setTeamAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  const { user } = useAuth();
  const managerId = user?._id;

  useEffect(() => {
    setKpisLoading(true);
    setKpisError(null);
    apiFetch(`/reports/manager/kpis?manager=${managerId}`)
      .then((data) => setKpis(data))
      .catch(() => setKpisError("Failed to load KPIs."))
      .finally(() => setKpisLoading(false));

    setTemplatesLoading(true);
    setTemplatesError(null);
    apiFetch(`/reports/manager/templates`)
      .then((data) => setTemplates(data))
      .catch(() => setTemplatesError("Failed to load report templates."))
      .finally(() => setTemplatesLoading(false));

    setRecentLoading(true);
    setRecentError(null);
    apiFetch(`/reports/manager/recent?manager=${managerId}`)
      .then((data) => setRecentReports(data))
      .catch(() => setRecentError("Failed to load recent reports."))
      .finally(() => setRecentLoading(false));

    setAnalyticsLoading(true);
    setAnalyticsError(null);
    apiFetch(`/reports/manager/analytics?manager=${managerId}`)
      .then((data) => setTeamAnalytics(data))
      .catch(() => setAnalyticsError("Failed to load team analytics."))
      .finally(() => setAnalyticsLoading(false));
  }, []);

  return (
    <ManagerPortalLayout>
      <div className="space-y-4 md:space-y-6 p-2 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t("reports")}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {t("generateAccess")}
            </p>
          </div>
          <Button className="flex items-center gap-2 w-full sm:w-auto">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">{t("createCustomReport")}</span>
            <span className="sm:hidden">{t("createReport")}</span>
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpisLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse h-24" />
            ))
          ) : kpisError ? (
            <div className="col-span-4 text-red-500 text-sm">{kpisError}</div>
          ) : kpis ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">{t("teamProductivity")}</CardTitle>
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">{kpis.teamProductivity}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">{t("goalCompletion")}</CardTitle>
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">{kpis.goalCompletion}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">{t("attendanceRate")}</CardTitle>
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">{kpis.attendanceRate}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">{t("employeeSatisfaction")}</CardTitle>
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">{kpis.employeeSatisfaction}/5</div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>

        {/* Report Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">{t("reportTemplates")}</CardTitle>
            <CardDescription>{t("preConfigured")}</CardDescription>
          </CardHeader>
          <CardContent>
            {templatesLoading ? (
              <div className="animate-pulse h-8 w-full bg-muted rounded" />
            ) : templatesError ? (
              <div className="text-xs text-red-500">{templatesError}</div>
            ) : templates.length === 0 ? (
              <div className="text-muted-foreground text-sm">No templates found.</div>
            ) : (
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                          <Badge variant="outline" className="text-xs">{template.category}</Badge>
                          <span className="text-xs text-muted-foreground">{template.frequency} • Last: {template.lastGenerated}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">{t("schedule")}</span>
                      <span className="sm:hidden">{t("schedule")}</span>
                    </Button>
                    <Button size="sm" className="text-xs">{t("generate")}</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">{t("recentReports")}</CardTitle>
            <CardDescription>{t("recentlyGenerated")}</CardDescription>
          </CardHeader>
          <CardContent>
            {recentLoading ? (
              <div className="animate-pulse h-8 w-full bg-muted rounded" />
            ) : recentError ? (
              <div className="text-xs text-red-500">{recentError}</div>
            ) : recentReports.length === 0 ? (
              <div className="text-muted-foreground text-sm">No recent reports found.</div>
            ) : (
              <div className="space-y-4">
                {recentReports.map((report, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium">{report.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                          <Badge variant="outline" className="text-xs">{report.type}</Badge>
                          <span className="text-xs text-muted-foreground">{report.date} • {report.size} • {report.format}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs">{t("preview")}</Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline ml-1">{t("download")}</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Users className="h-5 w-5" />
              {t("teamComposition")}
            </CardTitle>
            <CardDescription>{t("teamStructure")}</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="animate-pulse h-8 w-full bg-muted rounded" />
            ) : analyticsError ? (
              <div className="text-xs text-red-500">{analyticsError}</div>
            ) : teamAnalytics && teamAnalytics.teamAnalytics ? (
              <div className="space-y-4">
                {teamAnalytics.teamAnalytics.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-secondary rounded-full">
                        <div className={`h-2 bg-primary rounded-full`} style={{ width: `${item.value * 10}px` }}></div>
                      </div>
                      <span className="text-sm">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">No analytics found.</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Clock className="h-5 w-5" />
              {t("productivityTrends")}
            </CardTitle>
            <CardDescription>{t("weeklyProductivity")}</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="animate-pulse h-8 w-full bg-muted rounded" />
            ) : analyticsError ? (
              <div className="text-xs text-red-500">{analyticsError}</div>
            ) : teamAnalytics && teamAnalytics.productivityTrends ? (
              <div className="space-y-4">
                {teamAnalytics.productivityTrends.map((w: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm">{t("week")} {w.week}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-secondary rounded-full">
                        <div className={`h-2 bg-green-500 rounded-full`} style={{ width: `${w.value}px` }}></div>
                      </div>
                      <span className="text-sm">{w.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">No productivity data found.</div>
            )}
          </CardContent>
        </Card>

        {/* Report Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {t("reportActions")}
            </CardTitle>
            <CardDescription>{t("additionalTools")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <FileText className="h-6 w-6" />
                <span className="text-xs text-center">{t("customReport")}</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Calendar className="h-6 w-6" />
                <span className="text-xs text-center">
                  {t("scheduleReports")}
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <TrendingUp className="h-6 w-6" />
                <span className="text-xs text-center">
                  {t("analyticsDashboard")}
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Download className="h-6 w-6" />
                <span className="text-xs text-center">{t("exportData")}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ManagerPortalLayout>
  );
};

export default Reports;

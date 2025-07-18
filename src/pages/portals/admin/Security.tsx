import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminPortalLayout } from "@/components/layouts/AdminPortalLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Shield,
  AlertTriangle,
  Eye,
  Lock,
  Activity,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

const translations = {
  en: {
    security: "Security",
    securityDesc: "Security monitoring, permissions, and access control",
    securityScore: "Security Score",
    excellentSecurity: "Excellent security",
    activeSessions: "Active Sessions",
    currentlyLoggedIn: "Currently logged in",
    failedAttempts: "Failed Attempts",
    last24Hours: "Last 24 hours",
    twoFAEnabled: "2FA Enabled",
    usersWith2FA: "Users with 2FA",
    recentEvents: "Recent Security Events",
    monitorIncidents: "Monitor security incidents and suspicious activities",
    details: "Details",
    rolePermissions: "Role Permissions",
    manageRoles: "Manage user roles and access permissions",
    users: "users",
    edit: "Edit",
    securityActions: "Security Actions",
    quickActions: "Quick security management actions",
    forcePasswordReset: "Force Password Reset",
    viewAllSessions: "View All Sessions",
    securityScan: "Security Scan",
    high: "High",
    medium: "Medium",
    low: "Low",
    failedLogin: "Failed login attempt",
    passwordChanged: "Password changed",
    multipleFailed: "Multiple failed logins",
  },
  fr: {
    security: "Sécurité",
    securityDesc: "Surveillance, permissions et contrôle d'accès",
    securityScore: "Score de sécurité",
    excellentSecurity: "Sécurité excellente",
    activeSessions: "Sessions actives",
    currentlyLoggedIn: "Connectés actuellement",
    failedAttempts: "Tentatives échouées",
    last24Hours: "24 dernières heures",
    twoFAEnabled: "2FA activé",
    usersWith2FA: "Utilisateurs avec 2FA",
    recentEvents: "Événements de sécurité récents",
    monitorIncidents: "Surveillez les incidents et activités suspectes",
    details: "Détails",
    rolePermissions: "Permissions des rôles",
    manageRoles: "Gérer les rôles et les accès",
    users: "utilisateurs",
    edit: "Modifier",
    securityActions: "Actions de sécurité",
    quickActions: "Actions rapides de gestion de la sécurité",
    forcePasswordReset: "Forcer la réinitialisation du mot de passe",
    viewAllSessions: "Voir toutes les sessions",
    securityScan: "Analyse de sécurité",
    high: "Élevé",
    medium: "Moyen",
    low: "Faible",
    failedLogin: "Tentative de connexion échouée",
    passwordChanged: "Mot de passe modifié",
    multipleFailed: "Connexions échouées multiples",
  },
};

const Security = () => {
  const { language } = useLanguage();
  const t = (key: keyof (typeof translations)["en"]) =>
    translations[language][key];

  // Dynamic state for security events and permissions
  // const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  // const [permissions, setPermissions] = useState<any[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   setLoading(true);
  //   Promise.all([
  //     getSecurityEvents(),
  //     getPermissions()
  //   ])
  //     .then(([events, perms]) => {
  //       setSecurityEvents(Array.isArray(events) ? events : events.data || []);
  //       setPermissions(Array.isArray(perms) ? perms : perms.data || []);
  //       setError(null);
  //     })
  //     .catch(() => setError("Failed to load security data"))
  //     .finally(() => setLoading(false));
  // }, []);

  // If backend endpoint is not available, show a placeholder message
  // Remove static arrays for securityEvents and permissions
  const securityEvents = [
    {
      id: 1,
      event: t("failedLogin"),
      user: "john@company.com",
      time: "2 minutes ago",
      severity: "medium",
    },
    {
      id: 2,
      event: t("passwordChanged"),
      user: "jane@company.com",
      time: "1 hour ago",
      severity: "low",
    },
    {
      id: 3,
      event: t("multipleFailed"),
      user: "unknown@external.com",
      time: "3 hours ago",
      severity: "high",
    },
  ];

  const permissions = [
    {
      role: "Administrator",
      users: 3,
      permissions: ["Full Access", "User Management", "System Settings"],
    },
    {
      role: "Manager",
      users: 12,
      permissions: ["Team Management", "Reports", "Approvals"],
    },
    {
      role: "Employee",
      users: 140,
      permissions: ["Self Service", "Time Tracking", "Documents"],
    },
  ];

  return (
    <AdminPortalLayout>
      <div className="space-y-4 md:space-y-6 p-2 md:p-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t("security")}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {t("securityDesc")}
          </p>
        </div>

        {/* Security Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("securityScore")}
              </CardTitle>
              <Shield className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-green-600">
                92%
              </div>
              <p className="text-xs text-muted-foreground">
                {t("excellentSecurity")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("activeSessions")}
              </CardTitle>
              <Activity className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">
                {t("currentlyLoggedIn")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("failedAttempts")}
              </CardTitle>
              <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                {t("last24Hours")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("twoFAEnabled")}
              </CardTitle>
              <UserCheck className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">
                {t("usersWith2FA")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Security Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Eye className="h-4 w-4 md:h-5 md:w-5" />
              {t("recentEvents")}
            </CardTitle>
            <CardDescription className="text-sm">
              {t("monitorIncidents")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {securityEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg gap-4"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        event.severity === "high"
                          ? "bg-red-500"
                          : event.severity === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-sm md:text-base">
                        {event.event}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">
                        {event.user}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <Badge
                      variant={
                        event.severity === "high"
                          ? "destructive"
                          : event.severity === "medium"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {t(event.severity as "high" | "medium" | "low")}
                    </Badge>
                    <span className="text-xs md:text-sm text-muted-foreground">
                      {event.time}
                    </span>
                    <Button variant="outline" size="sm" className="text-xs">
                      {t("details")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Lock className="h-4 w-4 md:h-5 md:w-5" />
              {t("rolePermissions")}
            </CardTitle>
            <CardDescription className="text-sm">
              {t("manageRoles")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 md:space-y-6">
              {permissions.map((role, index) => (
                <div key={index} className="border rounded-lg p-3 md:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                    <div>
                      <h3 className="font-medium text-sm md:text-base">
                        {role.role}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {role.users} {t("users")}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs w-full sm:w-auto"
                    >
                      {t("edit")}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {role.permissions.map((permission, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {t("securityActions")}
            </CardTitle>
            <CardDescription className="text-sm">
              {t("quickActions")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              <Button
                variant="outline"
                className="h-auto p-3 md:p-4 flex flex-col items-center gap-2"
              >
                <Shield className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-xs md:text-sm">
                  {t("forcePasswordReset")}
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-3 md:p-4 flex flex-col items-center gap-2"
              >
                <Activity className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-xs md:text-sm">
                  {t("viewAllSessions")}
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-3 md:p-4 flex flex-col items-center gap-2"
              >
                <Lock className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-xs md:text-sm">{t("securityScan")}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPortalLayout>
  );
};

export default Security;

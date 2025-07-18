import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AdminPortalLayout } from "@/components/layouts/AdminPortalLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Settings, Database, Mail, Shield } from "lucide-react";
import { useEffect, useState } from "react";

const translations = {
  en: {
    systemSettings: "System Settings",
    systemSettingsDesc: "Configure system-wide settings and preferences",
    generalSettings: "General Settings",
    generalSettingsDesc: "Basic system configuration and preferences",
    maintenanceMode: "Maintenance Mode",
    maintenanceModeDesc: "Temporarily disable system access",
    autoBackup: "Auto Backup",
    autoBackupDesc: "Automatically backup data daily",
    multiLanguage: "Multi-language Support",
    multiLanguageDesc: "Enable multiple language interface",
    emailConfig: "Email Configuration",
    emailConfigDesc: "Configure email templates and notifications",
    smtpServer: "SMTP Server",
    port: "Port",
    emailNotifications: "Email Notifications",
    emailNotificationsDesc: "Send automated email notifications",
    securityConfig: "Security Configuration",
    securityConfigDesc: "Security policies and access controls",
    twoFA: "Two-Factor Authentication",
    twoFADesc: "Require 2FA for all admin accounts",
    sessionTimeout: "Session Timeout",
    sessionTimeoutDesc: "Auto-logout after inactivity",
    passwordMinLength: "Password Minimum Length",
    sessionDuration: "Session Duration (hours)",
    integrations: "Third-party Integrations",
    integrationsDesc: "Configure external service integrations",
    iremboPay: "IremboPay Integration",
    iremboPayDesc: "Enable payroll disbursement",
    aiFeatures: "AI Features",
    aiFeaturesDesc: "Enable AI-powered recommendations",
    jobBoardSync: "Job Board Sync",
    jobBoardSyncDesc: "Sync job postings with external boards",
    saveChanges: "Save Changes",
  },
  fr: {
    systemSettings: "Paramètres du système",
    systemSettingsDesc: "Configurer les paramètres et préférences globales",
    generalSettings: "Paramètres généraux",
    generalSettingsDesc: "Configuration et préférences de base du système",
    maintenanceMode: "Mode maintenance",
    maintenanceModeDesc: "Désactiver temporairement l'accès au système",
    autoBackup: "Sauvegarde automatique",
    autoBackupDesc: "Sauvegarder automatiquement les données chaque jour",
    multiLanguage: "Support multilingue",
    multiLanguageDesc: "Activer l'interface multilingue",
    emailConfig: "Configuration email",
    emailConfigDesc: "Configurer les modèles et notifications email",
    smtpServer: "Serveur SMTP",
    port: "Port",
    emailNotifications: "Notifications email",
    emailNotificationsDesc: "Envoyer des notifications email automatiques",
    securityConfig: "Configuration sécurité",
    securityConfigDesc: "Politiques de sécurité et contrôles d'accès",
    twoFA: "Authentification à deux facteurs",
    twoFADesc: "Exiger 2FA pour tous les comptes admin",
    sessionTimeout: "Expiration de session",
    sessionTimeoutDesc: "Déconnexion automatique après inactivité",
    passwordMinLength: "Longueur minimale du mot de passe",
    sessionDuration: "Durée de session (heures)",
    integrations: "Intégrations tierces",
    integrationsDesc: "Configurer les intégrations de services externes",
    iremboPay: "Intégration IremboPay",
    iremboPayDesc: "Activer le paiement des salaires",
    aiFeatures: "Fonctionnalités IA",
    aiFeaturesDesc: "Activer les recommandations IA",
    jobBoardSync: "Synchronisation des offres d'emploi",
    jobBoardSyncDesc: "Synchroniser les offres avec des sites externes",
    saveChanges: "Enregistrer les modifications",
  },
};

const SystemSettings = () => {
  const { language } = useLanguage();
  const t = (key: keyof (typeof translations)["en"]) =>
    translations[language][key];

  // Dynamic state for system settings
  // const [settings, setSettings] = useState<any>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   setLoading(true);
  //   getSystemSettings()
  //     .then((data) => { setSettings(data); setError(null); })
  //     .catch(() => setError("Failed to load system settings"))
  //     .finally(() => setLoading(false));
  // }, []);

  // If backend endpoint is not available, show a placeholder message
  return (
    <AdminPortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("systemSettings")}
          </h1>
          <p className="text-muted-foreground">{t("systemSettingsDesc")}</p>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t("generalSettings")}
            </CardTitle>
            <CardDescription>{t("generalSettingsDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t("maintenanceMode")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("maintenanceModeDesc")}
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t("autoBackup")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("autoBackupDesc")}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t("multiLanguage")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("multiLanguageDesc")}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {t("emailConfig")}
            </CardTitle>
            <CardDescription>{t("emailConfigDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("smtpServer")}
                </label>
                <input
                  className="w-full p-2 border border-input rounded-md bg-background"
                  placeholder={t("smtpServer")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("port")}
                </label>
                <input
                  className="w-full p-2 border border-input rounded-md bg-background"
                  placeholder={t("port")}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t("emailNotifications")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("emailNotificationsDesc")}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t("securityConfig")}
            </CardTitle>
            <CardDescription>{t("securityConfigDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t("twoFA")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("twoFADesc")}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t("sessionTimeout")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("sessionTimeoutDesc")}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("passwordMinLength")}
                </label>
                <input
                  className="w-full p-2 border border-input rounded-md bg-background"
                  type="number"
                  defaultValue="8"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("sessionDuration")}
                </label>
                <input
                  className="w-full p-2 border border-input rounded-md bg-background"
                  type="number"
                  defaultValue="8"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              {t("integrations")}
            </CardTitle>
            <CardDescription>{t("integrationsDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t("iremboPay")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("iremboPayDesc")}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t("aiFeatures")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("aiFeaturesDesc")}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t("jobBoardSync")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("jobBoardSyncDesc")}
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>{t("saveChanges")}</Button>
        </div>
      </div>
    </AdminPortalLayout>
  );
};

export default SystemSettings;

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AdminPortalLayout } from "@/components/layouts/AdminPortalLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Database,
  Download,
  Upload,
  Shield,
  Clock,
  HardDrive,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getBackups, createBackup, restoreBackup, deleteBackup } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const translations = {
  en: {
    backup: "Backup",
    backupDesc: "Backup and recovery management for system data protection",
    createBackup: "Create Backup",
    lastBackup: "Last Backup",
    lastBackupTime: "6 hours ago",
    automaticBackup: "Automatic backup",
    totalBackups: "Total Backups",
    availableBackups: "Available backups",
    storageUsed: "Storage Used",
    storageCapacity: "67% of capacity",
    successRate: "Success Rate",
    last30Days: "Last 30 days",
    backupConfig: "Backup Configuration",
    backupConfigDesc:
      "Configure automatic backup schedules and retention policies",
    autoDailyBackup: "Automatic Daily Backup",
    autoDailyBackupDesc: "Create daily system backups at 2:00 AM",
    backupFrequency: "Backup Frequency",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    retentionPeriod: "Retention Period",
    days30: "30 days",
    days60: "60 days",
    days90: "90 days",
    year1: "1 year",
    encryptBackups: "Encrypt Backups",
    encryptBackupsDesc: "Enable AES-256 encryption for all backups",
    cloudSync: "Cloud Storage Sync",
    cloudSyncDesc: "Automatically sync backups to cloud storage",
    backupHistory: "Backup History",
    backupHistoryDesc: "Recent backup files and recovery options",
    automatic: "Automatic",
    manual: "Manual",
    completed: "Completed",
    restore: "Restore",
    recoveryRestore: "Recovery & Restore",
    recoveryRestoreDesc: "System recovery options and data restoration tools",
    fullRestore: "Full System Restore",
    fullRestoreDesc: "Complete system recovery",
    selectiveRestore: "Selective Restore",
    selectiveRestoreDesc: "Restore specific data",
    testRecovery: "Test Recovery",
    testRecoveryDesc: "Verify backup integrity",
    disasterPlan: "Disaster Recovery Plan",
    disasterPlanDesc: "Emergency procedures and recovery protocols",
    rto: "Recovery Time Objective (RTO)",
    rtoDesc: "Target system recovery time: 4 hours",
    rpo: "Recovery Point Objective (RPO)",
    rpoDesc: "Maximum data loss tolerance: 1 hour",
    backupStatus: "Backup Status",
    backupStatusDesc: "All critical systems backed up within RPO",
  },
  fr: {
    backup: "Sauvegarde",
    backupDesc:
      "Gestion des sauvegardes et de la restauration pour la protection des données système",
    createBackup: "Créer une sauvegarde",
    lastBackup: "Dernière sauvegarde",
    lastBackupTime: "il y a 6 heures",
    automaticBackup: "Sauvegarde automatique",
    totalBackups: "Nombre total de sauvegardes",
    availableBackups: "Sauvegardes disponibles",
    storageUsed: "Stockage utilisé",
    storageCapacity: "67% de la capacité",
    successRate: "Taux de réussite",
    last30Days: "30 derniers jours",
    backupConfig: "Configuration de la sauvegarde",
    backupConfigDesc: "Configurer les horaires automatiques et la rétention",
    autoDailyBackup: "Sauvegarde automatique quotidienne",
    autoDailyBackupDesc: "Créer des sauvegardes quotidiennes à 2h00",
    backupFrequency: "Fréquence de sauvegarde",
    daily: "Quotidien",
    weekly: "Hebdomadaire",
    monthly: "Mensuel",
    retentionPeriod: "Période de rétention",
    days30: "30 jours",
    days60: "60 jours",
    days90: "90 jours",
    year1: "1 an",
    encryptBackups: "Chiffrer les sauvegardes",
    encryptBackupsDesc:
      "Activer le chiffrement AES-256 pour toutes les sauvegardes",
    cloudSync: "Synchronisation cloud",
    cloudSyncDesc: "Synchroniser automatiquement les sauvegardes vers le cloud",
    backupHistory: "Historique des sauvegardes",
    backupHistoryDesc: "Fichiers récents et options de restauration",
    automatic: "Automatique",
    manual: "Manuel",
    completed: "Terminé",
    restore: "Restaurer",
    recoveryRestore: "Récupération & restauration",
    recoveryRestoreDesc: "Options de récupération et outils de restauration",
    fullRestore: "Restauration complète",
    fullRestoreDesc: "Récupération complète du système",
    selectiveRestore: "Restauration sélective",
    selectiveRestoreDesc: "Restaurer des données spécifiques",
    testRecovery: "Test de récupération",
    testRecoveryDesc: "Vérifier l'intégrité des sauvegardes",
    disasterPlan: "Plan de reprise après sinistre",
    disasterPlanDesc: "Procédures d'urgence et protocoles de récupération",
    rto: "Objectif de temps de récupération (RTO)",
    rtoDesc: "Temps cible de récupération : 4 heures",
    rpo: "Objectif de point de récupération (RPO)",
    rpoDesc: "Tolérance maximale de perte de données : 1 heure",
    backupStatus: "Statut des sauvegardes",
    backupStatusDesc: "Tous les systèmes critiques sauvegardés dans le RPO",
  },
};

const Backup = () => {
  const { language } = useLanguage();
  const t = (key: keyof (typeof translations)["en"]) =>
    translations[language][key];
  const navigate = useNavigate();

  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBackups = () => {
    setLoading(true);
    getBackups()
      .then((data) => { setBackups(Array.isArray(data) ? data : data.data || []); setError(null); })
      .catch(() => setError("Failed to load backups"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateBackup = async () => {
    try {
      await createBackup({ name: "Manual Backup" });
      toast({ title: t("createBackup"), description: "Backup created successfully." });
      fetchBackups();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to create backup", variant: "destructive" });
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreBackup(id);
      toast({ title: t("restore"), description: "Backup restored successfully." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to restore backup", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this backup?")) return;
    try {
      await deleteBackup(id);
      toast({ title: t("delete"), description: "Backup deleted successfully." });
      fetchBackups();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to delete backup", variant: "destructive" });
    }
  };

  if (loading && !backups.length) {
    return (
      <AdminPortalLayout>
        <div className="space-y-4 md:space-y-6 p-2 md:p-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {t("backup")}
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                {t("backupDesc")}
              </p>
            </div>
            <Button className="flex items-center gap-2 w-full sm:w-auto" onClick={handleCreateBackup}>
              <Database className="h-4 w-4" />
              {t("createBackup")}
            </Button>
          </div>

          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {t("backupHistoryDesc")}
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              (No backup history available from backend)
            </p>
          </div>
        </div>
      </AdminPortalLayout>
    );
  }

  if (error) {
    return (
      <AdminPortalLayout>
        <div className="space-y-4 md:space-y-6 p-2 md:p-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {t("backup")}
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                {t("backupDesc")}
              </p>
            </div>
            <Button className="flex items-center gap-2 w-full sm:w-auto" onClick={handleCreateBackup}>
              <Database className="h-4 w-4" />
              {t("createBackup")}
            </Button>
          </div>

          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {t("backupHistoryDesc")}
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Error: {error}
            </p>
          </div>
        </div>
      </AdminPortalLayout>
    );
  }

  return (
    <AdminPortalLayout>
      <div className="space-y-4 md:space-y-6 p-2 md:p-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t("backup")}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {t("backupDesc")}
            </p>
            <Button className="mt-2" onClick={() => navigate('/admin-portal/succession-planning')}>
              Manage Succession Plans
            </Button>
          </div>
          <Button className="flex items-center gap-2 w-full sm:w-auto" onClick={handleCreateBackup}>
            <Database className="h-4 w-4" />
            {t("createBackup")}
          </Button>
        </div>

        {/* Backup Status */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("lastBackup")}
              </CardTitle>
              <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {t("lastBackupTime")}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("automaticBackup")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("totalBackups")}
              </CardTitle>
              <Database className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{backups.length}</div>
              <p className="text-xs text-muted-foreground">
                {t("availableBackups")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("storageUsed")}
              </CardTitle>
              <HardDrive className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">89.2 GB</div>
              <p className="text-xs text-muted-foreground">
                {t("storageCapacity")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("successRate")}
              </CardTitle>
              <Shield className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-green-600">
                99.8%
              </div>
              <p className="text-xs text-muted-foreground">{t("last30Days")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Backup Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {t("backupConfig")}
            </CardTitle>
            <CardDescription className="text-sm">
              {t("backupConfigDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-medium text-sm md:text-base">
                  {t("autoDailyBackup")}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {t("autoDailyBackupDesc")}
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label
                  htmlFor="backup-frequency"
                  className="block text-xs md:text-sm font-medium mb-2"
                >
                  {t("backupFrequency")}
                </label>
                <select
                  id="backup-frequency"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option>{t("daily")}</option>
                  <option>{t("weekly")}</option>
                  <option>{t("monthly")}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium mb-2">
                  {t("retentionPeriod")}
                </label>
                <label
                  htmlFor="retention-period"
                  className="block text-xs md:text-sm font-medium mb-2"
                >
                  {t("retentionPeriod")}
                </label>
                <select
                  id="retention-period"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option>{t("days30")}</option>
                  <option>{t("days60")}</option>
                  <option>{t("days90")}</option>
                  <option>{t("year1")}</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-medium text-sm md:text-base">
                  {t("encryptBackups")}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {t("encryptBackupsDesc")}
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-medium text-sm md:text-base">
                  {t("cloudSync")}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {t("cloudSyncDesc")}
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Backup History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {t("backupHistory")}
            </CardTitle>
            <CardDescription className="text-sm">
              {t("backupHistoryDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {loading ? (
                <p className="text-center py-8 text-muted-foreground">
                  Loading backup history...
                </p>
              ) : backups.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No backup history available.
                </p>
              ) : (
                backups.map((backup) => (
                  <div
                    key={backup.id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-3 md:p-4 border rounded-lg gap-4"
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Database className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm md:text-base">
                          {backup.name}
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {backup.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="text-left sm:text-right">
                        <p className="text-xs md:text-sm font-medium">
                          {backup.size}
                        </p>
                        <Badge
                          variant={
                            backup.type === t("automatic")
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {backup.type}
                        </Badge>
                      </div>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 text-xs"
                      >
                        {backup.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs" onClick={() => handleRestore(backup.id)}>
                          <Download className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs" onClick={() => handleDelete(backup.id)}>
                          {t("delete")}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recovery Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Upload className="h-4 w-4 md:h-5 md:w-5" />
              {t("recoveryRestore")}
            </CardTitle>
            <CardDescription className="text-sm">
              {t("recoveryRestoreDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              <Button
                variant="outline"
                className="h-auto p-3 md:p-4 flex flex-col items-center gap-2"
              >
                <Database className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-xs md:text-sm font-medium">
                  {t("fullRestore")}
                </span>
                <span className="text-xs text-muted-foreground text-center">
                  {t("fullRestoreDesc")}
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-3 md:p-4 flex flex-col items-center gap-2"
              >
                <Upload className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-xs md:text-sm font-medium">
                  {t("selectiveRestore")}
                </span>
                <span className="text-xs text-muted-foreground text-center">
                  {t("selectiveRestoreDesc")}
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-3 md:p-4 flex flex-col items-center gap-2"
              >
                <Shield className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-xs md:text-sm font-medium">
                  {t("testRecovery")}
                </span>
                <span className="text-xs text-muted-foreground text-center">
                  {t("testRecoveryDesc")}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Disaster Recovery Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {t("disasterPlan")}
            </CardTitle>
            <CardDescription className="text-sm">
              {t("disasterPlanDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <div className="p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-medium text-yellow-800 text-sm md:text-base">
                  {t("rto")}
                </h3>
                <p className="text-xs md:text-sm text-yellow-700">
                  {t("rtoDesc")}
                </p>
              </div>
              <div className="p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 text-sm md:text-base">
                  {t("rpo")}
                </h3>
                <p className="text-xs md:text-sm text-blue-700">
                  {t("rpoDesc")}
                </p>
              </div>
              <div className="p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-800 text-sm md:text-base">
                  {t("backupStatus")}
                </h3>
                <p className="text-xs md:text-sm text-green-700">
                  {t("backupStatusDesc")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPortalLayout>
  );
};

export default Backup;

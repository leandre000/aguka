/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Download, UserX, Eye } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  exportUserData,
  anonymizeUserData,
  deleteUserAccount,
} from "@/lib/api";

// --- Translation keys ---
const translations = {
  en: {
    "gdpr.title": "GDPR & Privacy",
    "gdpr.description": "Manage your personal data and privacy settings.",
    "gdpr.exportData": "Export Data",
    "gdpr.exportDataDesc": "Download a copy of all your personal data.",
    "gdpr.export": "Export",
    "gdpr.exportSuccess": "Export Successful",
    "gdpr.exportSuccessDesc": "Your data has been exported.",
    "gdpr.anonymizeData": "Anonymize Data",
    "gdpr.anonymizeDataDesc":
      "Remove all personal identifiers from your account.",
    "gdpr.anonymize": "Anonymize",
    "gdpr.anonymizeConfirmTitle": "Confirm Anonymization",
    "gdpr.anonymizeConfirmDesc":
      "Are you sure you want to anonymize your data? This cannot be undone.",
    "gdpr.confirmAnonymize": "Yes, Anonymize",
    "gdpr.anonymizeSuccess": "Anonymization Successful",
    "gdpr.anonymizeSuccessDesc": "Your data has been anonymized.",
    "gdpr.deleteAccount": "Delete Account",
    "gdpr.deleteAccountDesc":
      "Permanently delete your account and all associated data.",
    "gdpr.delete": "Delete",
    "gdpr.deleteConfirmTitle": "Confirm Deletion",
    "gdpr.deleteConfirmDesc":
      "Are you sure you want to delete your account? This action is irreversible.",
    "gdpr.confirmDelete": "Yes, Delete",
    "gdpr.deleteSuccess": "Account Deleted",
    "gdpr.deleteSuccessDesc": "Your account has been deleted.",
    "gdpr.privacyNotice": "Privacy Notice",
    "gdpr.yourRights": "Your Rights",
    "gdpr.rightAccess": "Right to access your data",
    "gdpr.rightRectification": "Right to rectify inaccurate data",
    "gdpr.rightErasure": "Right to erasure (right to be forgotten)",
    "gdpr.rightPortability": "Right to data portability",
    "gdpr.dataProtection": "Data Protection",
    "gdpr.encryption": "Data is encrypted at rest and in transit",
    "gdpr.accessControl": "Strict access controls",
    "gdpr.auditTrail": "Comprehensive audit trails",
    "gdpr.regularBackups": "Regular data backups",
    "common.loading": "Loading...",
    "common.cancel": "Cancel",
    "common.error": "Error",
  },
  fr: {
    "gdpr.title": "RGPD & Confidentialité",
    "gdpr.description":
      "Gérez vos données personnelles et paramètres de confidentialité.",
    "gdpr.exportData": "Exporter les données",
    "gdpr.exportDataDesc":
      "Téléchargez une copie de toutes vos données personnelles.",
    "gdpr.export": "Exporter",
    "gdpr.exportSuccess": "Exportation réussie",
    "gdpr.exportSuccessDesc": "Vos données ont été exportées.",
    "gdpr.anonymizeData": "Anonymiser les données",
    "gdpr.anonymizeDataDesc":
      "Supprimez tous les identifiants personnels de votre compte.",
    "gdpr.anonymize": "Anonymiser",
    "gdpr.anonymizeConfirmTitle": "Confirmer l'anonymisation",
    "gdpr.anonymizeConfirmDesc":
      "Voulez-vous vraiment anonymiser vos données ? Cette action est irréversible.",
    "gdpr.confirmAnonymize": "Oui, anonymiser",
    "gdpr.anonymizeSuccess": "Anonymisation réussie",
    "gdpr.anonymizeSuccessDesc": "Vos données ont été anonymisées.",
    "gdpr.deleteAccount": "Supprimer le compte",
    "gdpr.deleteAccountDesc":
      "Supprimez définitivement votre compte et toutes les données associées.",
    "gdpr.delete": "Supprimer",
    "gdpr.deleteConfirmTitle": "Confirmer la suppression",
    "gdpr.deleteConfirmDesc":
      "Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.",
    "gdpr.confirmDelete": "Oui, supprimer",
    "gdpr.deleteSuccess": "Compte supprimé",
    "gdpr.deleteSuccessDesc": "Votre compte a été supprimé.",
    "gdpr.privacyNotice": "Avis de confidentialité",
    "gdpr.yourRights": "Vos droits",
    "gdpr.rightAccess": "Droit d'accès à vos données",
    "gdpr.rightRectification": "Droit de rectification des données inexactes",
    "gdpr.rightErasure": "Droit à l'effacement (droit à l'oubli)",
    "gdpr.rightPortability": "Droit à la portabilité des données",
    "gdpr.dataProtection": "Protection des données",
    "gdpr.encryption": "Les données sont chiffrées au repos et en transit",
    "gdpr.accessControl": "Contrôles d'accès stricts",
    "gdpr.auditTrail": "Traçabilité complète",
    "gdpr.regularBackups": "Sauvegardes régulières des données",
    "common.loading": "Chargement...",
    "common.cancel": "Annuler",
    "common.error": "Erreur",
  },
};

// --- Simple translation hook for this page ---
function useLocalLanguage() {
  const [lang, setLang] = useState<"en" | "fr">("en");
  const t = (key: keyof (typeof translations)["en"]) =>
    translations[lang][key] || key;
  return { t, lang, setLang };
}

export default function GDPR() {
  // Use local translation for this page
  const { t, lang, setLang } = useLocalLanguage();
  const [loading, setLoading] = useState<string | null>(null);

  const handleExportData = async () => {
    setLoading("export");
    try {
      const data = await exportUserData();
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user-data-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast({
        title: t("gdpr.exportSuccess"),
        description: t("gdpr.exportSuccessDesc"),
      });
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleAnonymize = async () => {
    setLoading("anonymize");
    try {
      await anonymizeUserData();
      toast({
        title: t("gdpr.anonymizeSuccess"),
        description: t("gdpr.anonymizeSuccessDesc"),
      });
      // Optionally, log out user here
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading("delete");
    try {
      await deleteUserAccount();
      toast({
        title: t("gdpr.deleteSuccess"),
        description: t("gdpr.deleteSuccessDesc"),
      });
      // Optionally, log out user here
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Language Switcher */}
      <div className="flex justify-end mb-2">
        <Button
          variant={lang === "en" ? "default" : "outline"}
          onClick={() => setLang("en")}
          className="mr-2"
        >
          English
        </Button>
        <Button
          variant={lang === "fr" ? "default" : "outline"}
          onClick={() => setLang("fr")}
        >
          Français
        </Button>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{t("gdpr.title")}</h1>
        <p className="text-muted-foreground">{t("gdpr.description")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Data Export */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-blue-600" />
              <CardTitle>{t("gdpr.exportData")}</CardTitle>
            </div>
            <CardDescription>{t("gdpr.exportDataDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleExportData}
              disabled={loading === "export"}
              className="w-full"
            >
              {loading === "export" ? t("common.loading") : t("gdpr.export")}
            </Button>
          </CardContent>
        </Card>

        {/* Data Anonymization */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-orange-600" />
              <CardTitle>{t("gdpr.anonymizeData")}</CardTitle>
            </div>
            <CardDescription>{t("gdpr.anonymizeDataDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={loading === "anonymize"}
                  className="w-full"
                >
                  {loading === "anonymize"
                    ? t("common.loading")
                    : t("gdpr.anonymize")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("gdpr.anonymizeConfirmTitle")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("gdpr.anonymizeConfirmDesc")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleAnonymize}>
                    {t("gdpr.confirmAnonymize")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* Account Deletion */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <UserX className="h-5 w-5 text-red-600" />
              <CardTitle>{t("gdpr.deleteAccount")}</CardTitle>
            </div>
            <CardDescription>{t("gdpr.deleteAccountDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={loading === "delete"}
                  className="w-full"
                >
                  {loading === "delete"
                    ? t("common.loading")
                    : t("gdpr.delete")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("gdpr.deleteConfirmTitle")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("gdpr.deleteConfirmDesc")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {t("gdpr.confirmDelete")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Notice */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <CardTitle>{t("gdpr.privacyNotice")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">{t("gdpr.yourRights")}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {t("gdpr.rightAccess")}</li>
                <li>• {t("gdpr.rightRectification")}</li>
                <li>• {t("gdpr.rightErasure")}</li>
                <li>• {t("gdpr.rightPortability")}</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">{t("gdpr.dataProtection")}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {t("gdpr.encryption")}</li>
                <li>• {t("gdpr.accessControl")}</li>
                <li>• {t("gdpr.auditTrail")}</li>
                <li>• {t("gdpr.regularBackups")}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

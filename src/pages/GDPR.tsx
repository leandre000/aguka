/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Download, UserX, Eye, AlertTriangle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
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
import { exportUserData, anonymizeUserData, deleteUserAccount } from "@/lib/api";

export default function GDPR() {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleExportData = async () => {
    setLoading("export");
    try {
      const data = await exportUserData();
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user-data-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: t("gdpr.exportSuccess"), description: t("gdpr.exportSuccessDesc") });
    } catch (error: any) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleAnonymize = async () => {
    setLoading("anonymize");
    try {
      await anonymizeUserData();
      toast({ title: t("gdpr.anonymizeSuccess"), description: t("gdpr.anonymizeSuccessDesc") });
      logout();
    } catch (error: any) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading("delete");
    try {
      await deleteUserAccount();
      toast({ title: t("gdpr.deleteSuccess"), description: t("gdpr.deleteSuccessDesc") });
      logout();
    } catch (error: any) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
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
                  {loading === "anonymize" ? t("common.loading") : t("gdpr.anonymize")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("gdpr.anonymizeConfirmTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>{t("gdpr.anonymizeConfirmDesc")}</AlertDialogDescription>
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
                  {loading === "delete" ? t("common.loading") : t("gdpr.delete")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("gdpr.deleteConfirmTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>{t("gdpr.deleteConfirmDesc")}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
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
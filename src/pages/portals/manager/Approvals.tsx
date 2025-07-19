/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Clock,
  Check,
  X,
  DollarSign,
  Calendar,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { getLeaves, approveLeave, rejectLeave } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { useEffect, useState } from "react";

const translations = {
  en: {
    approvals: "Approvals",
    reviewApprove: "Review and approve team requests and applications",
    approvalHistory: "Approval History",
    history: "History",
    pending: "Pending",
    awaitingReview: "Awaiting review",
    approvedToday: "Approved Today",
    completed: "Completed",
    highPriority: "High Priority",
    urgentRequests: "Urgent requests",
    avgResponse: "Avg Response",
    responseTime: "Response time",
    pendingApprovals: "Pending Approvals",
    requestsAttention: "Requests requiring your immediate attention",
    approve: "Approve",
    reject: "Reject",
    approvalStatistics: "Approval Statistics",
    monthlyMetrics: "Monthly approval metrics by category",
    pendingStat: "Pending",
    approvedStat: "Approved",
    rejectedStat: "Rejected",
    approvalRate: "approval rate",
    guidelines: "Approval Guidelines",
    guidelinesPolicies: "Guidelines and policies for different approval types",
    timeOff: "Time Off Requests",
    timeOff1: "• Check team coverage requirements",
    timeOff2: "• Verify available leave balance",
    timeOff3: "• Consider business impact",
    timeOff4: "• Approve within 48 hours",
    expenseClaims: "Expense Claims",
    expense1: "• Verify receipts and documentation",
    expense2: "• Check budget allocation",
    expense3: "• Ensure business relevance",
    expense4: "• Maximum $500 without pre-approval",
    overtime: "Overtime Requests",
    overtime1: "• Justify business necessity",
    overtime2: "• Check budget implications",
    overtime3: "• Ensure work-life balance",
    overtime4: "• Pre-approval required",
    training: "Training Requests",
    training1: "• Align with career development",
    training2: "• Check training budget",
    training3: "• Evaluate business benefit",
    training4: "• Require completion commitment",
    quickActions: "Quick Actions",
    commonTasks: "Common approval management tasks",
    bulkApprove: "Bulk Approve",
    viewHistory: "View History",
    setDelegates: "Set Delegates",
    autoRules: "Auto Rules",
    submitted: "Submitted",
  },
  fr: {
    approvals: "Approbations",
    reviewApprove:
      "Examiner et approuver les demandes et candidatures de l'équipe",
    approvalHistory: "Historique des approbations",
    history: "Historique",
    pending: "En attente",
    awaitingReview: "En attente d'examen",
    approvedToday: "Approuvé aujourd'hui",
    completed: "Terminé",
    highPriority: "Haute priorité",
    urgentRequests: "Demandes urgentes",
    avgResponse: "Réponse moy.",
    responseTime: "Temps de réponse",
    pendingApprovals: "Approbations en attente",
    requestsAttention: "Demandes nécessitant votre attention immédiate",
    approve: "Approuver",
    reject: "Rejeter",
    approvalStatistics: "Statistiques d'approbation",
    monthlyMetrics: "Statistiques mensuelles par catégorie",
    pendingStat: "En attente",
    approvedStat: "Approuvé",
    rejectedStat: "Rejeté",
    approvalRate: "taux d'approbation",
    guidelines: "Directives d'approbation",
    guidelinesPolicies:
      "Directives et politiques pour différents types d'approbation",
    timeOff: "Demandes de congé",
    timeOff1: "• Vérifier la couverture de l'équipe",
    timeOff2: "• Vérifier le solde de congés disponible",
    timeOff3: "• Considérer l'impact sur l'entreprise",
    timeOff4: "• Approuver sous 48 heures",
    expenseClaims: "Notes de frais",
    expense1: "• Vérifier les reçus et la documentation",
    expense2: "• Vérifier l'allocation budgétaire",
    expense3: "• Assurer la pertinence professionnelle",
    expense4: "• Maximum 500 $ sans pré-approbation",
    overtime: "Demandes d'heures supplémentaires",
    overtime1: "• Justifier la nécessité professionnelle",
    overtime2: "• Vérifier les implications budgétaires",
    overtime3: "• Assurer l'équilibre vie pro/perso",
    overtime4: "• Pré-approbation requise",
    training: "Demandes de formation",
    training1: "• Aligner avec le développement de carrière",
    training2: "• Vérifier le budget formation",
    training3: "• Évaluer le bénéfice pour l'entreprise",
    training4: "• Engagement de complétion requis",
    quickActions: "Actions rapides",
    commonTasks: "Tâches courantes de gestion des approbations",
    bulkApprove: "Approbation en masse",
    viewHistory: "Voir l'historique",
    setDelegates: "Définir des délégués",
    autoRules: "Règles automatiques",
    submitted: "Soumis",
  },
};

const Approvals = () => {
  const { language } = useLanguage();
  const t = (key: keyof (typeof translations)["en"]) =>
    translations[language][key];

  const { user } = useAuth();
  const managerId = user?._id;
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  useEffect(() => {
    setLoading(true);
    getLeaves()
      .then(data => setPendingApprovals(Array.isArray(data) ? data.filter((r: any) => r.status === 'Pending') : []))
      .finally(() => setLoading(false));
  }, [managerId]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await approveLeave(id);
      setPendingApprovals(prev => prev.filter(r => r._id !== id));
      toast({ title: 'Request approved' });
    } catch (err: any) {
      let errorMsg = 'Failed to approve request';
      if (err?.message) errorMsg = err.message;
      toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };
  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await rejectLeave(id);
      setPendingApprovals(prev => prev.filter(r => r._id !== id));
      toast({ title: 'Request rejected' });
    } catch (err: any) {
      let errorMsg = 'Failed to reject request';
      if (err?.message) errorMsg = err.message;
      toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  const approvalStats = [
    { type: t("timeOff"), pending: 3, approved: 12, rejected: 1 },
    { type: t("expenseClaims"), pending: 2, approved: 28, rejected: 2 },
    { type: t("overtime"), pending: 1, approved: 8, rejected: 0 },
    { type: t("training"), pending: 1, approved: 5, rejected: 1 },
  ];

  return (
    <ManagerPortalLayout>
      <div className="space-y-4 md:space-y-6 p-2 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t("approvals")}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {t("reviewApprove")}
            </p>
          </div>
          <Button className="flex items-center gap-2 w-full sm:w-auto">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">{t("approvalHistory")}</span>
            <span className="sm:hidden">{t("history")}</span>
          </Button>
        </div>

        {/* Approval Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("pending")}
              </CardTitle>
              <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">
                {t("awaitingReview")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("approvedToday")}
              </CardTitle>
              <Check className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">{t("completed")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("highPriority")}
              </CardTitle>
              <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">
                {t("urgentRequests")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("avgResponse")}
              </CardTitle>
              <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">2.3h</div>
              <p className="text-xs text-muted-foreground">
                {t("responseTime")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {t("pendingApprovals")}
            </CardTitle>
            <CardDescription>{t("requestsAttention")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((approval) => {
                const IconComponent = approval.icon;
                return (
                  <div
                    key={approval.id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                          <h3 className="font-medium">{approval.type}</h3>
                          {approval.priority === "High" && (
                            <Badge
                              variant="destructive"
                              className="text-xs self-start"
                            >
                              {t("highPriority")}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {approval.employee}
                        </p>
                        <p className="text-sm">{approval.description}</p>
                        {approval.amount && (
                          <p className="text-sm font-medium text-primary">
                            {approval.amount}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="text-left sm:text-right">
                        <p className="text-sm font-medium">{approval.period}</p>
                        <p className="text-xs text-muted-foreground">
                          {t("submitted")}: {approval.submitted}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(approval._id)}
                          disabled={actionLoading === approval._id}
                        >
                          <Check className="h-4 w-4" />
                          <span className="hidden sm:inline ml-1">
                            {t("approve")}
                          </span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(approval._id)}
                          disabled={actionLoading === approval._id}
                        >
                          <X className="h-4 w-4" />
                          <span className="hidden sm:inline ml-1">
                            {t("reject")}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Approval Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {t("approvalStatistics")}
            </CardTitle>
            <CardDescription>{t("monthlyMetrics")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {approvalStats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                >
                  <div className="font-medium w-full sm:w-24">{stat.type}</div>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-8 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
                      <span className="text-sm">
                        {t("pendingStat")}: {stat.pending}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-sm">
                        {t("approvedStat")}: {stat.approved}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                      <span className="text-sm">
                        {t("rejectedStat")}: {stat.rejected}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground sm:text-right">
                    {Math.round(
                      (stat.approved /
                        (stat.approved + stat.rejected + stat.pending)) *
                        100
                    )}
                    % {t("approvalRate")}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Approval Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {t("guidelines")}
            </CardTitle>
            <CardDescription>{t("guidelinesPolicies")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">{t("timeOff")}</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>{t("timeOff1")}</li>
                  <li>{t("timeOff2")}</li>
                  <li>{t("timeOff3")}</li>
                  <li>{t("timeOff4")}</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">{t("expenseClaims")}</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>{t("expense1")}</li>
                  <li>{t("expense2")}</li>
                  <li>{t("expense3")}</li>
                  <li>{t("expense4")}</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">{t("overtime")}</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>{t("overtime1")}</li>
                  <li>{t("overtime2")}</li>
                  <li>{t("overtime3")}</li>
                  <li>{t("overtime4")}</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">{t("training")}</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>{t("training1")}</li>
                  <li>{t("training2")}</li>
                  <li>{t("training3")}</li>
                  <li>{t("training4")}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {t("quickActions")}
            </CardTitle>
            <CardDescription>{t("commonTasks")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Check className="h-6 w-6" />
                <span className="text-xs text-center">{t("bulkApprove")}</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <FileText className="h-6 w-6" />
                <span className="text-xs text-center">{t("viewHistory")}</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <AlertTriangle className="h-6 w-6" />
                <span className="text-xs text-center">{t("setDelegates")}</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Clock className="h-6 w-6" />
                <span className="text-xs text-center">{t("autoRules")}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ManagerPortalLayout>
  );
};

export default Approvals;

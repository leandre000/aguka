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
import { getLeaves, approveLeave, rejectLeave, getExpenseClaims, approveExpense, rejectExpense, getOvertimeRequests, approveOvertime, rejectOvertime, getTrainingRequests, approveTraining, rejectTraining } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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

const ApprovalCard = ({ approval, onApprove, onReject, selectedIds, setSelectedIds, loadingId, t, Icon }) => (
  <div className="flex items-center gap-2" key={approval._id}>
    <input
      type="checkbox"
      checked={selectedIds.includes(approval._id)}
      onChange={(e) =>
        setSelectedIds((prev) =>
          e.target.checked ? [...prev, approval._id] : prev.filter((id) => id !== approval._id)
        )
      }
    />
    <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg gap-4">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h3 className="font-medium">{approval.type}</h3>
            {approval.priority === "High" && (
              <Badge variant="destructive" className="text-xs self-start">
                {t("highPriority")}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{approval.employee}</p>
          <p className="text-sm">{approval.description}</p>
          {approval.amount && (
            <p className="text-sm font-medium text-primary">{approval.amount}</p>
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
            onClick={() => onApprove(approval._id)}
            disabled={loadingId === approval._id}
          >
            <Check className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">{t("approve")}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReject(approval._id)}
            disabled={loadingId === approval._id}
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">{t("reject")}</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
);

const Approvals = () => {
  const { language } = useLanguage();
  // Update t to support dot notation
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value ?? key;
  };

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('leave');
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [expenseApprovals, setExpenseApprovals] = useState<any[]>([]);
  const [overtimeApprovals, setOvertimeApprovals] = useState<any[]>([]);
  const [trainingApprovals, setTrainingApprovals] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      if (activeTab === 'leave') {
        await approveLeave(id);
        setPendingApprovals(prev => prev.filter(r => r._id !== id));
      } else if (activeTab === 'expense') {
        await approveExpense(id);
        setExpenseApprovals(prev => prev.filter(r => r._id !== id));
      } else if (activeTab === 'overtime') {
        await approveOvertime(id);
        setOvertimeApprovals(prev => prev.filter(r => r._id !== id));
      } else if (activeTab === 'training') {
        await approveTraining(id);
        setTrainingApprovals(prev => prev.filter(r => r._id !== id));
      }
      toast({ title: 'Request approved' });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message ?? 'Failed to approve request',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      if (activeTab === 'leave') {
        await rejectLeave(id);
        setPendingApprovals(prev => prev.filter(r => r._id !== id));
      } else if (activeTab === 'expense') {
        await rejectExpense(id);
        setExpenseApprovals(prev => prev.filter(r => r._id !== id));
      } else if (activeTab === 'overtime') {
        await rejectOvertime(id);
        setOvertimeApprovals(prev => prev.filter(r => r._id !== id));
      } else if (activeTab === 'training') {
        await rejectTraining(id);
        setTrainingApprovals(prev => prev.filter(r => r._id !== id));
      }
      toast({ title: 'Request rejected' });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message ?? 'Failed to reject request',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    setSelectedIds([]);
  }, [activeTab]);

  return (
    <ManagerPortalLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="expense">Expense</TabsTrigger>
          <TabsTrigger value="overtime">Overtime</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>
        <TabsContent value="leave">
          <Card>
            <CardHeader>
              <CardTitle>Pending Leave Requests</CardTitle>
              <CardDescription>Approve or reject leave requests.</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingApprovals.map((leave) => (
                <ApprovalCard
                  key={leave._id}
                  approval={leave}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  loadingId={actionLoading}
                  t={t}
                  Icon={Clock}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expense">
          <Card>
            <CardHeader>
              <CardTitle>Pending Expense Claims</CardTitle>
              <CardDescription>Approve or reject expense claims.</CardDescription>
            </CardHeader>
            <CardContent>
              {expenseApprovals.map((expense) => (
                <ApprovalCard
                  key={expense._id}
                  approval={expense}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  loadingId={actionLoading}
                  t={t}
                  Icon={DollarSign}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="overtime">
          <Card>
            <CardHeader>
              <CardTitle>Pending Overtime Requests</CardTitle>
              <CardDescription>Approve or reject overtime requests.</CardDescription>
            </CardHeader>
            <CardContent>
              {overtimeApprovals.map((overtime) => (
                <ApprovalCard
                  key={overtime._id}
                  approval={overtime}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  loadingId={actionLoading}
                  t={t}
                  Icon={Clock}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>Pending Training Requests</CardTitle>
              <CardDescription>Approve or reject training requests.</CardDescription>
            </CardHeader>
            <CardContent>
              {trainingApprovals.map((training) => (
                <ApprovalCard
                  key={training._id}
                  approval={training}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  loadingId={actionLoading}
                  t={t}
                  Icon={FileText}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ManagerPortalLayout>
  );
};

export default Approvals;

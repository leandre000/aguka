import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, TrendingUp, Shield, Eye, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuditorPortalLayout } from "@/components/layouts/AuditorPortalLayout";
import { useEffect, useState } from "react";
import { getRiskAssessments } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";
import { createRiskAssessment, updateRiskAssessment, deleteRiskAssessment } from "@/lib/api";

export default function RiskAssessment() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Risk Assessment",
      description: "Identify and evaluate organizational risks",
      overallRisk: "Overall Risk Score",
      highRisk: "High Risk",
      mediumRisk: "Medium Risk",
      lowRisk: "Low Risk",
      riskCategory: "Risk Category",
      allCategories: "All Categories",
      operational: "Operational",
      financial: "Financial",
      compliance: "Compliance",
      cybersecurity: "Cybersecurity",
      reputation: "Reputation",
      impact: "Impact",
      probability: "Probability",
      riskScore: "Risk Score",
      mitigation: "Mitigation Status",
      viewDetails: "View Details",
      updateAssessment: "Update Assessment",
      newAssessment: "New Assessment",
      inProgress: "In Progress",
      completed: "Completed",
      notStarted: "Not Started",
    },
    es: {
      title: "Evaluación de Riesgos",
      description: "Identificar y evaluar riesgos organizacionales",
      overallRisk: "Puntuación General de Riesgo",
      highRisk: "Alto Riesgo",
      mediumRisk: "Riesgo Medio",
      lowRisk: "Bajo Riesgo",
      riskCategory: "Categoría de Riesgo",
      allCategories: "Todas las Categorías",
      operational: "Operacional",
      financial: "Financiero",
      compliance: "Cumplimiento",
      cybersecurity: "Ciberseguridad",
      reputation: "Reputación",
      impact: "Impacto",
      probability: "Probabilidad",
      riskScore: "Puntuación de Riesgo",
      mitigation: "Estado de Mitigación",
      viewDetails: "Ver Detalles",
      updateAssessment: "Actualizar Evaluación",
      newAssessment: "Nueva Evaluación",
      inProgress: "En Progreso",
      completed: "Completado",
      notStarted: "No Iniciado",
    },
    fr: {
      title: "Évaluation des risques",
      description: "Identifier et évaluer les risques organisationnels",
      overallRisk: "Score de risque global",
      highRisk: "Risque élevé",
      mediumRisk: "Risque moyen",
      lowRisk: "Risque faible",
      riskCategory: "Catégorie de risque",
      allCategories: "Toutes les catégories",
      operational: "Opérationnel",
      financial: "Financier",
      compliance: "Conformité",
      cybersecurity: "Cybersécurité",
      reputation: "Réputation",
      impact: "Impact",
      probability: "Probabilité",
      riskScore: "Score de risque",
      mitigation: "Statut de mitigation",
      viewDetails: "Voir les détails",
      updateAssessment: "Mettre à jour l'évaluation",
      newAssessment: "Nouvelle évaluation",
      inProgress: "En cours",
      completed: "Terminé",
      notStarted: "Non commencé",
    },
  };

  const t = content[language];

  const [risks, setRisks] = useState<any[]>([]);
  const [risksLoading, setRisksLoading] = useState(false);
  const [risksError, setRisksError] = useState<string | null>(null);
  const [riskModalOpen, setRiskModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<any | null>(null);
  const [riskDeleteId, setRiskDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setRisksLoading(true);
    getRiskAssessments()
      .then((data) => { setRisks(data); setRisksError(null); })
      .catch(() => setRisksError("Failed to load risks"))
      .finally(() => setRisksLoading(false));
  }, []);

  // Update stats to use dynamic risks
  const riskStats = [
    { label: t.highRisk, value: risks.filter(r => r.riskScore >= 50).length, color: "text-red-600" },
    { label: t.mediumRisk, value: risks.filter(r => r.riskScore >= 25 && r.riskScore < 50).length, color: "text-yellow-600" },
    { label: t.lowRisk, value: risks.filter(r => r.riskScore < 25).length, color: "text-green-600" },
  ];

  const getRiskLevel = (score: number) => {
    if (score >= 50)
      return { label: t.highRisk, variant: "destructive" as const };
    if (score >= 25)
      return { label: t.mediumRisk, variant: "outline" as const };
    return { label: t.lowRisk, variant: "default" as const };
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in-progress":
        return "outline";
      case "not-started":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return t.completed;
      case "in-progress":
        return t.inProgress;
      case "not-started":
        return t.notStarted;
      default:
        return status;
    }
  };

  return (
    <AuditorPortalLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t.title}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {t.description}
            </p>
          </div>
          <Button className="w-full sm:w-auto" onClick={() => { setEditingRisk(null); setRiskModalOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t.newAssessment}</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t.overallRisk}
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.2/10</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +5% from last month
              </p>
            </CardContent>
          </Card>
          {riskStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <AlertTriangle className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t.riskCategory} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allCategories}</SelectItem>
              <SelectItem value="operational">{t.operational}</SelectItem>
              <SelectItem value="financial">{t.financial}</SelectItem>
              <SelectItem value="compliance">{t.compliance}</SelectItem>
              <SelectItem value="cybersecurity">{t.cybersecurity}</SelectItem>
              <SelectItem value="reputation">{t.reputation}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {risksLoading && <p>Loading risks...</p>}
          {risksError && <p style={{ color: "red" }}>{risksError}</p>}
          {!risksLoading && !risksError && risks.length === 0 && (
            <p>No risks found for this assessment.</p>
          )}
          {!risksLoading && !risksError && risks.length > 0 && (
            risks.map((risk) => {
              const riskLevel = getRiskLevel(risk.riskScore);
              return (
                <Card key={risk.id}>
                  <CardHeader className="pb-4">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg break-words">
                          {risk.title}
                        </CardTitle>
                        <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge variant="outline">{risk.category}</Badge>
                          <span className="text-xs">
                            Last updated: {risk.lastUpdated}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={riskLevel.variant}>
                          {riskLevel.label}
                        </Badge>
                        <Badge variant={getStatusVariant(risk.status)}>
                          {getStatusLabel(risk.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium">{t.impact}</p>
                        <p className="text-lg font-bold">{risk.impact}/10</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t.probability}</p>
                        <p className="text-lg font-bold">{risk.probability}/10</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t.riskScore}</p>
                        <p className="text-lg font-bold">{risk.riskScore}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">{t.mitigation}</p>
                        <Progress value={risk.mitigation} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {risk.mitigation}%
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => { setEditingRisk(risk); setRiskModalOpen(true); }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">{t.viewDetails}</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                      <Button size="sm" className="w-full sm:w-auto" onClick={() => { setEditingRisk(risk); setRiskModalOpen(true); }}>
                        <span className="hidden sm:inline">
                          {t.updateAssessment}
                        </span>
                        <span className="sm:hidden">Update</span>
                      </Button>
                      <Button size="sm" variant="destructive" className="w-full sm:w-auto" onClick={() => setRiskDeleteId(risk._id)}>
                        <span className="hidden sm:inline">Delete</span>
                        <span className="sm:hidden">Del</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <Dialog open={riskModalOpen} onOpenChange={setRiskModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRisk ? 'Edit Assessment' : 'New Assessment'}</DialogTitle>
            <DialogDescription>Enter risk assessment details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const impact = Number(formData.get('impact'));
            const probability = Number(formData.get('probability'));
            const riskScore = impact * probability;
            const data = {
              title: formData.get('title'),
              category: formData.get('category'),
              impact,
              probability,
              riskScore,
              mitigation: Number(formData.get('mitigation')),
              status: formData.get('status'),
              lastUpdated: formData.get('lastUpdated'),
            };
            try {
              if (editingRisk) {
                await updateRiskAssessment(editingRisk._id, data);
                toast.success('Assessment updated');
              } else {
                await createRiskAssessment(data);
                toast.success('Assessment created');
              }
              setRiskModalOpen(false);
              setEditingRisk(null);
              setRisksLoading(true);
              getRiskAssessments().then(setRisks).finally(() => setRisksLoading(false));
            } catch (err) {
              toast.error('Failed to save assessment');
            }
          }}>
            <input name="title" placeholder="Title" defaultValue={editingRisk?.title || ''} required className="input mb-2 w-full" />
            <input name="category" placeholder="Category" defaultValue={editingRisk?.category || ''} required className="input mb-2 w-full" />
            <input name="impact" type="number" min="1" max="10" placeholder="Impact (1-10)" defaultValue={editingRisk?.impact || ''} required className="input mb-2 w-full" />
            <input name="probability" type="number" min="1" max="10" placeholder="Probability (1-10)" defaultValue={editingRisk?.probability || ''} required className="input mb-2 w-full" />
            <input name="mitigation" type="number" min="0" max="100" placeholder="Mitigation (%)" defaultValue={editingRisk?.mitigation || ''} className="input mb-2 w-full" />
            <select name="status" defaultValue={editingRisk?.status || 'not-started'} required className="input mb-2 w-full">
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <input name="lastUpdated" type="date" defaultValue={editingRisk?.lastUpdated?.slice(0,10) || ''} required className="input mb-4 w-full" />
            <DialogFooter>
              <Button type="submit">{editingRisk ? 'Update' : 'Create'}</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!riskDeleteId} onOpenChange={open => !open && setRiskDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assessment?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRiskDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => {
              try {
                await deleteRiskAssessment(riskDeleteId);
                toast.success('Assessment deleted');
                setRiskDeleteId(null);
                setRisksLoading(true);
                getRiskAssessments().then(setRisks).finally(() => setRisksLoading(false));
              } catch {
                toast.error('Failed to delete assessment');
              }
            }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuditorPortalLayout>
  );
}

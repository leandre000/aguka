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
import { Calendar, FileText, Clock, Users, Eye, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuditorPortalLayout } from "@/components/layouts/AuditorPortalLayout";
import { useEffect, useState } from "react";
import { getAudits } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";
import { createAudit, updateAudit, deleteAudit } from "@/lib/api";

export default function InternalAudits() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Internal Audits",
      description: "Manage and track internal audit processes",
      totalAudits: "Total Audits",
      completedAudits: "Completed",
      inProgress: "In Progress",
      planned: "Planned",
      auditType: "Audit Type",
      allTypes: "All Types",
      financial: "Financial",
      operational: "Operational",
      compliance: "Compliance",
      it: "IT Security",
      status: "Status",
      progress: "Progress",
      startDate: "Start Date",
      endDate: "End Date",
      auditor: "Lead Auditor",
      department: "Department",
      viewAudit: "View Audit",
      updateProgress: "Update Progress",
      newAudit: "New Audit",
      completed: "Completed",
      scheduled: "Scheduled",
    },
    es: {
      title: "Auditorías Internas",
      description: "Gestionar y rastrear procesos de auditoría interna",
      totalAudits: "Total de Auditorías",
      completedAudits: "Completadas",
      inProgress: "En Progreso",
      planned: "Planificadas",
      auditType: "Tipo de Auditoría",
      allTypes: "Todos los Tipos",
      financial: "Financiera",
      operational: "Operacional",
      compliance: "Cumplimiento",
      it: "Seguridad TI",
      status: "Estado",
      progress: "Progreso",
      startDate: "Fecha de Inicio",
      endDate: "Fecha de Fin",
      auditor: "Auditor Principal",
      department: "Departamento",
      viewAudit: "Ver Auditoría",
      updateProgress: "Actualizar Progreso",
      newAudit: "Nueva Auditoría",
      completed: "Completado",
      scheduled: "Programado",
    },
    fr: {
      title: "Audits internes",
      description: "Gérer et suivre les processus d'audit interne",
      totalAudits: "Nombre total d'audits",
      completedAudits: "Terminés",
      inProgress: "En cours",
      planned: "Planifiés",
      auditType: "Type d'audit",
      allTypes: "Tous les types",
      financial: "Financier",
      operational: "Opérationnel",
      compliance: "Conformité",
      it: "Sécurité informatique",
      status: "Statut",
      progress: "Progression",
      startDate: "Date de début",
      endDate: "Date de fin",
      auditor: "Auditeur principal",
      department: "Département",
      viewAudit: "Voir l'audit",
      updateProgress: "Mettre à jour la progression",
      newAudit: "Nouvel audit",
      completed: "Terminé",
      scheduled: "Prévu",
    },
  };

  const t = content[language];

  const [audits, setAudits] = useState<any[]>([]);
  const [auditsLoading, setAuditsLoading] = useState(false);
  const [auditsError, setAuditsError] = useState<string | null>(null);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [editingAudit, setEditingAudit] = useState<any | null>(null);
  const [auditDeleteId, setAuditDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setAuditsLoading(true);
    getAudits()
      .then((data) => { setAudits(data); setAuditsError(null); })
      .catch(() => setAuditsError("Failed to load audits"))
      .finally(() => setAuditsLoading(false));
  }, []);

  // Update stats to use dynamic audits
  const auditStats = [
    { label: t.totalAudits, value: audits.length, icon: FileText },
    { label: t.completedAudits, value: audits.filter(a => a.status === "completed").length, icon: FileText },
    { label: t.inProgress, value: audits.filter(a => a.status === "in-progress").length, icon: Clock },
    { label: t.planned, value: audits.filter(a => a.status === "planned" || a.status === "scheduled").length, icon: Calendar },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in-progress":
        return "outline";
      case "scheduled":
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
      case "scheduled":
        return t.scheduled;
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
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t.newAudit}</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {auditStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t.auditType} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allTypes}</SelectItem>
              <SelectItem value="financial">{t.financial}</SelectItem>
              <SelectItem value="operational">{t.operational}</SelectItem>
              <SelectItem value="compliance">{t.compliance}</SelectItem>
              <SelectItem value="it">{t.it}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {auditsLoading && <p>Loading audits...</p>}
          {auditsError && <p style={{ color: "red" }}>{auditsError}</p>}
          {!auditsLoading && !auditsError && audits.length === 0 && (
            <p>No audits found.</p>
          )}
          {!auditsLoading && !auditsError && audits.length > 0 && (
            audits.map((audit) => (
              <Card key={audit.id}>
                <CardHeader className="pb-4">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg break-words">
                        {audit.title}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="outline">{audit.type}</Badge>
                        <span className="text-sm">{audit.department}</span>
                      </CardDescription>
                    </div>
                    <Badge
                      variant={getStatusVariant(audit.status)}
                      className="w-fit"
                    >
                      {getStatusLabel(audit.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">{t.auditor}</p>
                      <p className="text-sm text-muted-foreground">
                        {audit.auditor}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.startDate}</p>
                      <p className="text-sm text-muted-foreground">
                        {audit.startDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.endDate}</p>
                      <p className="text-sm text-muted-foreground">
                        {audit.endDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Findings</p>
                      <p className="text-sm text-muted-foreground">
                        {audit.findings}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>{t.progress}</span>
                      <span>{audit.progress}%</span>
                    </div>
                    <Progress value={audit.progress} className="h-2" />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">{t.viewAudit}</span>
                      <span className="sm:hidden">View</span>
                    </Button>
                    {audit.status === "in-progress" && (
                      <Button size="sm" className="w-full sm:w-auto">
                        <span className="hidden sm:inline">
                          {t.updateProgress}
                        </span>
                        <span className="sm:hidden">Update</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={auditModalOpen} onOpenChange={setAuditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAudit ? 'Edit Audit' : 'New Audit'}</DialogTitle>
            <DialogDescription>Enter audit details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const data = {
              title: formData.get('title'),
              description: formData.get('description'),
              auditDate: formData.get('auditDate'),
              status: formData.get('status'),
            };
            try {
              if (editingAudit) {
                await updateAudit(editingAudit._id, data);
                toast.success('Audit updated');
              } else {
                await createAudit(data);
                toast.success('Audit created');
              }
              setAuditModalOpen(false);
              setEditingAudit(null);
              setAuditsLoading(true);
              getAudits().then(setAudits).finally(() => setAuditsLoading(false));
            } catch (err) {
              toast.error('Failed to save audit');
            }
          }}>
            <input name="title" placeholder="Title" defaultValue={editingAudit?.title || ''} required className="input mb-2 w-full" />
            <textarea name="description" placeholder="Description" defaultValue={editingAudit?.description || ''} required className="input mb-2 w-full" />
            <input name="auditDate" type="date" defaultValue={editingAudit?.auditDate?.slice(0,10) || ''} required className="input mb-2 w-full" />
            <select name="status" defaultValue={editingAudit?.status || 'planned'} required className="input mb-4 w-full">
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <DialogFooter>
              <Button type="submit">{editingAudit ? 'Update' : 'Create'}</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!auditDeleteId} onOpenChange={open => !open && setAuditDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Audit?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAuditDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => {
              try {
                await deleteAudit(auditDeleteId);
                toast.success('Audit deleted');
                setAuditDeleteId(null);
                setAuditsLoading(true);
                getAudits().then(setAudits).finally(() => setAuditsLoading(false));
              } catch {
                toast.error('Failed to delete audit');
              }
            }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuditorPortalLayout>
  );
}

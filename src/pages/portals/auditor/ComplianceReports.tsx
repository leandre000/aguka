/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuditorPortalLayout } from "@/components/layouts/AuditorPortalLayout";
import { useEffect, useState } from "react";
import { getComplianceReports, createComplianceReport, updateComplianceReport, deleteComplianceReport } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ComplianceReports() {
  const { t } = useLanguage();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [form, setForm] = useState<any>({ title: '', type: '', status: '', reportDate: '', nextReview: '', issues: '', recommendations: '' });
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getComplianceReports()
      .then((data) => {
        // If backend returns { audits, incidents }
        if (data && typeof data === 'object' && (Array.isArray(data.audits) || Array.isArray(data.incidents))) {
          const audits = (data.audits || []).map((a: any) => ({ ...a, type: 'audit' }));
          const incidents = (data.incidents || []).map((i: any) => ({ ...i, type: 'incident' }));
          setReports([...audits, ...incidents]);
        } else {
          setReports(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => setError(err.message || "Failed to load compliance reports"))
      .finally(() => setLoading(false));
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setForm({ title: '', type: '', status: '', reportDate: '', nextReview: '', issues: '', recommendations: '' });
    setModalOpen(true);
    setSelectedReport(null);
    setFormError(null);
  };
  const openEditModal = (report: any) => {
    setModalMode('edit');
    setForm({
      title: report.title,
      type: report.type,
      status: report.status,
      reportDate: report.reportDate,
      nextReview: report.nextReview,
      issues: report.issues,
      recommendations: report.recommendations,
    });
    setModalOpen(true);
    setSelectedReport(report);
    setFormError(null);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedReport(null);
    setFormError(null);
  };
  const handleFormChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      if (!form.title.trim() || !form.type.trim() || !form.status.trim() || !form.reportDate.trim() || !form.nextReview.trim()) {
        setFormError(t("auditor.allFieldsRequired") || "All fields are required.");
        setFormLoading(false);
        return;
      }
      if (modalMode === 'create') {
        await createComplianceReport(form);
      } else if (modalMode === 'edit' && selectedReport) {
        await updateComplianceReport(selectedReport._id, form);
      }
      setModalOpen(false);
      setLoading(true);
      getComplianceReports().then(setReports).finally(() => setLoading(false));
    } catch (err: any) {
      setFormError(err.message || t("auditor.failedToSave") || "Failed to save report");
    } finally {
      setFormLoading(false);
    }
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteComplianceReport(deleteId);
      setDeleteId(null);
      setLoading(true);
      getComplianceReports().then(setReports).finally(() => setLoading(false));
    } catch (err: any) {
      // Optionally show error toast
      setDeleteId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-4 w-4" />;
      case "non-compliant":
        return <AlertTriangle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "compliant":
        return "default";
      case "non-compliant":
        return "destructive";
      case "pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "compliant":
        return t("auditor.compliant");
      case "non-compliant":
        return t("auditor.nonCompliant");
      case "pending":
        return t("auditor.pending");
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
              {t("auditor.complianceReports")}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {t("auditor.generateAndReview")}
            </p>
          </div>
          <Button onClick={openCreateModal} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t("auditor.newReport")}</span>
            <span className="sm:hidden">{t("auditor.new")}</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t("auditor.filterByType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("auditor.allTypes")}</SelectItem>
              <SelectItem value="financial">{t("auditor.financial")}</SelectItem>
              <SelectItem value="safety">{t("auditor.safety")}</SelectItem>
              <SelectItem value="data-protection">
                {t("auditor.dataProtection")}
              </SelectItem>
              <SelectItem value="hr">{t("auditor.hrPolicies")}</SelectItem>
              <SelectItem value="environmental">{t("auditor.environmental")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading compliance reports...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No compliance reports found.</div>
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report._id}>
                <CardHeader className="pb-4">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg break-words">
                        {report.title}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="outline">{report.type}</Badge>
                      </CardDescription>
                    </div>
                    <Badge
                      variant={getStatusVariant(report.status)}
                      className="flex items-center gap-1 w-fit"
                    >
                      {getStatusIcon(report.status)}
                      <span className="hidden sm:inline">
                        {getStatusLabel(report.status)}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">{t("auditor.reportDate")}</p>
                      <p className="text-sm text-muted-foreground">
                        {report.reportDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t("auditor.nextReview")}</p>
                      <p className="text-sm text-muted-foreground">
                        {report.nextReview}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t("auditor.issues")}</p>
                      <p className="text-sm text-muted-foreground">
                        {report.issues}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t("auditor.recommendations")}</p>
                      <p className="text-sm text-muted-foreground">
                        {report.recommendations}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() => openEditModal(report)}
                    >
                      {t("common.edit")}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() => setDeleteId(report._id)}
                    >
                      {t("common.delete")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4 p-1 sm:p-0">
            <DialogHeader>
              <DialogTitle>{modalMode === 'create' ? t("auditor.createReport") : t("auditor.editReport")}</DialogTitle>
              <DialogDescription>{t("auditor.fillDetails")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t("auditor.title")}</label>
              <Input className="w-full" value={form.title} onChange={e => handleFormChange('title', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t("auditor.type")}</label>
              <Input className="w-full" value={form.type} onChange={e => handleFormChange('type', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t("auditor.status")}</label>
              <Input className="w-full" value={form.status} onChange={e => handleFormChange('status', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t("auditor.reportDate")}</label>
              <Input className="w-full" type="date" value={form.reportDate} onChange={e => handleFormChange('reportDate', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t("auditor.nextReview")}</label>
              <Input className="w-full" type="date" value={form.nextReview} onChange={e => handleFormChange('nextReview', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t("auditor.issues")}</label>
              <Input className="w-full" value={form.issues} onChange={e => handleFormChange('issues', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t("auditor.recommendations")}</label>
              <Textarea className="w-full" value={form.recommendations} onChange={e => handleFormChange('recommendations', e.target.value)} />
            </div>
            {formError && <div className="text-red-600 text-sm">{formError}</div>}
            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-2 w-full">
              <Button type="submit" disabled={formLoading} className="w-full sm:w-auto">
                {modalMode === 'create' ? t("common.create") : t("common.update")}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={closeModal} className="w-full sm:w-auto">{t("common.cancel")}</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("auditor.deleteReport")}</AlertDialogTitle>
            <AlertDialogDescription>{t("auditor.cannotBeUndone")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t("common.delete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuditorPortalLayout>
  );
}

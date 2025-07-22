/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, MapPin, Clock, DollarSign } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RecruiterPortalLayout } from "@/components/layouts/RecruiterPortalLayout";
import { getJobPostings } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function JobPostings() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    department: "",
    location: "",
    employmentType: "", // e.g., "Full-time"
    salaryMin: "",
    salaryMax: "",
    requirements: "",
    responsibilities: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getJobPostings()
      .then((data) => setJobs(data))
      .catch((err) => setError(err.message || "Failed to load jobs"))
      .finally(() => setLoading(false));
  }, []);

  if (!isAuthenticated || !["recruiter", "admin", "manager"].includes(user?.role)) {
    return <div className="p-8 text-center text-red-600">Access denied.</div>;
  }

  const translations = {
    en: {
      title: "Job Postings",
      description: "Manage and track all job postings",
      newPosting: "New Job Posting",
      search: "Search jobs...",
      status: "Status",
      all: "All",
      active: "Active",
      closed: "Closed",
      draft: "Draft",
      position: "Position",
      location: "Location",
      salary: "Salary",
      applicants: "Applicants",
      posted: "Posted",
      edit: "Edit",
      view: "View Applications",
      allFieldsRequired: "All fields are required.",
      minDescription: "Description must be at least 10 characters.",
      jobCreated: "Job created successfully.",
      jobUpdated: "Job updated successfully.",
      failedToSave: "Failed to save job.",
      deleteJobTitle: "Delete Job Posting",
      deleteJobDesc: "Are you sure you want to delete this job posting? This action cannot be undone.",
      jobDeleted: "Job deleted successfully.",
      cancel: "Cancel",
      delete: "Delete",
      error: "Error",
      loadingJobs: "Loading jobs...",
      noJobsFound: "No jobs found.",
    },
    es: {
      title: "Ofertas de Trabajo",
      description: "Gestionar y rastrear todas las ofertas de trabajo",
      newPosting: "Nueva Oferta",
      search: "Buscar trabajos...",
      status: "Estado",
      all: "Todos",
      active: "Activo",
      closed: "Cerrado",
      draft: "Borrador",
      position: "Posición",
      location: "Ubicación",
      salary: "Salario",
      applicants: "Candidatos",
      posted: "Publicado",
      edit: "Editar",
      view: "Ver Aplicaciones",
      allFieldsRequired: "Todos los campos son obligatorios.",
      minDescription: "La descripción debe tener al menos 10 caracteres.",
      jobCreated: "Oferta de trabajo creada con éxito.",
      jobUpdated: "Oferta de trabajo actualizada con éxito.",
      failedToSave: "Error al guardar la oferta de trabajo.",
      deleteJobTitle: "Eliminar Oferta de Trabajo",
      deleteJobDesc: "¿Estás seguro de que quieres eliminar esta oferta de trabajo? Esta acción no se puede deshacer.",
      jobDeleted: "Oferta de trabajo eliminada con éxito.",
      cancel: "Cancelar",
      delete: "Eliminar",
      error: "Error",
      loadingJobs: "Cargando trabajos...",
      noJobsFound: "No se encontraron trabajos.",
    },
    fr: {
      title: "Offres d'emploi",
      description: "Gérer et suivre toutes les offres d'emploi",
      newPosting: "Nouvelle offre d'emploi",
      search: "Rechercher des emplois...",
      status: "Statut",
      all: "Tous",
      active: "Actif",
      closed: "Fermé",
      draft: "Brouillon",
      position: "Poste",
      location: "Lieu",
      salary: "Salaire",
      applicants: "Candidats",
      posted: "Publié",
      edit: "Modifier",
      view: "Voir les candidatures",
      allFieldsRequired: "Tous les champs sont requis.",
      minDescription: "La description doit comporter au moins 10 caractères.",
      jobCreated: "Offre d'emploi créée avec succès.",
      jobUpdated: "Offre d'emploi mise à jour avec succès.",
      failedToSave: "Échec de l'enregistrement de l'offre d'emploi.",
      deleteJobTitle: "Supprimer l'offre d'emploi",
      deleteJobDesc: "Êtes-vous sûr de vouloir supprimer cette offre d'emploi ? Cette action ne peut pas être annulée.",
      jobDeleted: "Offre d'emploi supprimée avec succès.",
      cancel: "Annuler",
      delete: "Supprimer",
      error: "Erreur",
      loadingJobs: "Chargement des offres...",
      noJobsFound: "Aucune offre trouvée.",
    },
  };
  const t = (key: keyof typeof translations.en) => translations[language][key] || translations.en[key];

  // Filter jobs by search and status
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && job.status === "Open") ||
      (statusFilter === "closed" && job.status === "Closed") ||
      (statusFilter === "draft" && job.status === "On Hold");
    return matchesSearch && matchesStatus;
  });

  // Delete job posting
  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await axios.delete(`/api/jobs/${deleteId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast({ title: t('jobDeleted') });
      setDeleteId(null);
      getJobPostings()
        .then((data) => setJobs(data))
        .catch((err) => setError(err.message || 'Failed to load jobs'))
        .finally(() => setLoading(false));
    } catch (err: any) {
      toast({ title: t('error'), description: err.response?.data?.message || err.message || t('failedToSave'), variant: 'destructive' });
      setLoading(false);
    }
  };

  return (
    <RecruiterPortalLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t("title")}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {t("description")}
            </p>
          </div>
          <Button className="w-full sm:w-auto" onClick={() => setModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t("newPosting")}</span>
            <span className="sm:hidden">{t("newPosting").substring(0, 4)}</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t("status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="active">{t("active")}</SelectItem>
              <SelectItem value="closed">{t("closed")}</SelectItem>
              <SelectItem value="draft">{t("draft")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">{t("loadingJobs")}</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">{t("noJobsFound")}</div>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job._id}>
              <CardHeader className="pb-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg md:text-xl break-words">
                      {job.title}
                    </CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salaryRange ? `$${job.salaryRange.min} - $${job.salaryRange.max}` : "-"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "-"}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge
                    variant={job.status === "Open" ? "default" : "secondary"}
                    className="w-fit"
                  >
                    {job.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    {job.applicants ? job.applicants.length : 0} {t("applicants")}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <span className="hidden sm:inline">{t("edit")}</span>
                      <span className="sm:hidden">{t("edit").substring(0, 2)}</span>
                    </Button>
                    <Button size="sm" className="w-full sm:w-auto">
                      <span className="hidden sm:inline">{t("view")}</span>
                      <span className="sm:hidden">{t("view").substring(0, 4)}</span>
                    </Button>
                    <Button variant="destructive" onClick={() => setDeleteId(job._id)}>{t("delete")}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Job Creation Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("newPosting")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Job Title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
            />
            <Input
              placeholder="Department"
              value={form.department}
              onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
            />
            <Input
              placeholder="Location"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            />
            <Select
              value={form.employmentType}
              onValueChange={v => setForm(f => ({ ...f, employmentType: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Employment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Salary Min"
              type="number"
              value={form.salaryMin}
              onChange={e => setForm(f => ({ ...f, salaryMin: e.target.value }))}
            />
            <Input
              placeholder="Salary Max"
              type="number"
              value={form.salaryMax}
              onChange={e => setForm(f => ({ ...f, salaryMax: e.target.value }))}
            />
            <Textarea
              placeholder="Requirements (comma separated)"
              value={form.requirements}
              onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))}
              rows={2}
            />
            <Textarea
              placeholder="Responsibilities (comma separated)"
              value={form.responsibilities}
              onChange={e => setForm(f => ({ ...f, responsibilities: e.target.value }))}
            />
            {formError && <div className="text-red-600 text-sm">{formError}</div>}
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                // --- Validation for all required fields ---
                if (!form.title.trim() || !form.description.trim() || !form.department.trim() || !form.location.trim() || !form.employmentType.trim() || !form.salaryMin.trim() || !form.salaryMax.trim() || !form.requirements.trim() || !form.responsibilities.trim()) {
                  setFormError(t("allFieldsRequired"));
                  return;
                }
                // --- Description length validation ---
                if (form.description.trim().length < 10) {
                  setFormError(t("minDescription"));
                  return;
                }
                setFormError(null);
                setFormLoading(true);
                try {
                  // --- API call to backend ---
                  await axios.post("/api/jobs/create", {
                    title: form.title,
                    description: form.description,
                    department: form.department,
                    location: form.location,
                    employmentType: form.employmentType,
                    salaryRange: { min: Number(form.salaryMin), max: Number(form.salaryMax) },
                    requirements: (form.requirements || "").split(",").map(r => r.trim()).filter(Boolean),
                    responsibilities: (form.responsibilities || "").split(",").map(r => r.trim()).filter(Boolean),
                  }, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                  });
                  toast({ title: t("jobCreated") });
                  setModalOpen(false);
                  setForm({ title: "", description: "", department: "", location: "", employmentType: "", salaryMin: "", salaryMax: "", requirements: "", responsibilities: "" });
                  setLoading(true);
                  getJobPostings()
                    .then((data) => setJobs(data))
                    .catch((err) => setError(err.message || "Failed to load jobs"))
                    .finally(() => setLoading(false));
                } catch (err: any) {
                  toast({ title: t("error"), description: err.response?.data?.message || err.message || t("failedToSave"), variant: "destructive" });
                } finally {
                  setFormLoading(false);
                }
              }}
              disabled={formLoading}
            >
              {formLoading ? "Creating..." : "Create Job"}
            </Button>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={formLoading}>
              {t("cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteJobTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteJobDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t("delete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RecruiterPortalLayout>
  );
}

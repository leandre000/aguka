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
    requirements: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

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

  const content = {
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
    },
  };

  const t = content[language];

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

  return (
    <RecruiterPortalLayout>
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
          <Button className="w-full sm:w-auto" onClick={() => setModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t.newPosting}</span>
            <span className="sm:hidden">New Job</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t.status} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.all}</SelectItem>
              <SelectItem value="active">{t.active}</SelectItem>
              <SelectItem value="closed">{t.closed}</SelectItem>
              <SelectItem value="draft">{t.draft}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading jobs...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No jobs found.</div>
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
                    {job.applicants ? job.applicants.length : 0} {t.applicants}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <span className="hidden sm:inline">{t.edit}</span>
                      <span className="sm:hidden">Edit</span>
                    </Button>
                    <Button size="sm" className="w-full sm:w-auto">
                      <span className="hidden sm:inline">{t.view}</span>
                      <span className="sm:hidden">View Apps</span>
                    </Button>
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
            <DialogTitle>{t.newPosting}</DialogTitle>
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
            <Textarea
              placeholder="Requirements (comma separated)"
              value={form.requirements}
              onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))}
              rows={2}
            />
            {formError && <div className="text-red-600 text-sm">{formError}</div>}
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                // Validation
                if (!form.title.trim() || !form.description.trim() || !form.department.trim() || !form.requirements.trim()) {
                  setFormError("All fields are required.");
                  return;
                }
                setFormError(null);
                setFormLoading(true);
                try {
                  await axios.post("/jobs/create", {
                    ...form,
                    requirements: form.requirements.split(",").map(r => r.trim()).filter(Boolean)
                  });
                  toast({ title: "Job created successfully" });
                  setModalOpen(false);
                  setForm({ title: "", description: "", department: "", requirements: "" });
                  setLoading(true);
                  getJobPostings()
                    .then((data) => setJobs(data))
                    .catch((err) => setError(err.message || "Failed to load jobs"))
                    .finally(() => setLoading(false));
                } catch (err: any) {
                  toast({ title: "Error", description: err.response?.data?.message || err.message || "Failed to create job", variant: "destructive" });
                } finally {
                  setFormLoading(false);
                }
              }}
              disabled={formLoading}
            >
              {formLoading ? "Creating..." : "Create Job"}
            </Button>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={formLoading}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RecruiterPortalLayout>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Star, Eye, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RecruiterPortalLayout } from "@/components/layouts/RecruiterPortalLayout";
import { getApplications } from "@/lib/api";

export default function CandidateScreening() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getApplications()
      .then((data) => setApplications(data))
      .catch((err) => setError(err.message || "Failed to load candidates"))
      .finally(() => setLoading(false));
  }, []);

  const content = {
    en: {
      title: "Candidate Screening",
      description: "Review and evaluate job candidates",
      search: "Search candidates...",
      stage: "Stage",
      all: "All Stages",
      applied: "Applied",
      screening: "Screening",
      interview: "Interview",
      offer: "Offer",
      rejected: "Rejected",
      experience: "years exp",
      rating: "Rating",
      viewProfile: "View Profile",
      schedule: "Schedule Interview",
      notes: "Add Notes",
    },
    es: {
      title: "Evaluación de Candidatos",
      description: "Revisar y evaluar candidatos",
      search: "Buscar candidatos...",
      stage: "Etapa",
      all: "Todas las Etapas",
      applied: "Aplicado",
      screening: "Evaluación",
      interview: "Entrevista",
      offer: "Oferta",
      rejected: "Rechazado",
      experience: "años exp",
      rating: "Calificación",
      viewProfile: "Ver Perfil",
      schedule: "Programar Entrevista",
      notes: "Agregar Notas",
    },
    fr: {
      title: "Sélection des candidats",
      description: "Examiner et évaluer les candidats",
      search: "Rechercher des candidats...",
      stage: "Étape",
      all: "Toutes les étapes",
      applied: "Candidature reçue",
      screening: "Pré-sélection",
      interview: "Entretien",
      offer: "Offre",
      rejected: "Rejeté",
      experience: "ans exp",
      rating: "Note",
      viewProfile: "Voir le profil",
      schedule: "Planifier un entretien",
      notes: "Ajouter des notes",
    },
  };

  const t = content[language];

  // Filter applications by search and stage
  const filteredApplications = applications.filter((app) => {
    const candidateName = app.applicant?.Names || "";
    const jobTitle = app.job?.title || "";
    const matchesSearch =
      candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage =
      stageFilter === "all" ||
      (stageFilter === "applied" && app.status === "Applied") ||
      (stageFilter === "screening" && app.status === "Under Review") ||
      (stageFilter === "interview" && app.status === "Interview Scheduled") ||
      (stageFilter === "offer" && app.status === "Offer Extended") ||
      (stageFilter === "rejected" && app.status === "Rejected");
    return matchesSearch && matchesStage;
  });

  const getStageVariant = (stage: string) => {
    switch (stage) {
      case "Applied":
        return "secondary";
      case "Under Review":
        return "outline";
      case "Interview Scheduled":
        return "default";
      case "Offer Extended":
        return "default";
      case "Rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <RecruiterPortalLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t.title}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {t.description}
          </p>
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
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t.stage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.all}</SelectItem>
              <SelectItem value="applied">{t.applied}</SelectItem>
              <SelectItem value="screening">{t.screening}</SelectItem>
              <SelectItem value="interview">{t.interview}</SelectItem>
              <SelectItem value="offer">{t.offer}</SelectItem>
              <SelectItem value="rejected">{t.rejected}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading candidates...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No candidates found.</div>
        ) : (
          filteredApplications.map((app) => (
            <Card key={app._id}>
              <CardHeader className="pb-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src={"/placeholder.svg"} />
                      <AvatarFallback>
                        {app.applicant?.Names
                          ? app.applicant.Names.split(" ").map((n: string) => n[0]).join("")
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg break-words">
                        {app.applicant?.Names || "Unknown"}
                      </CardTitle>
                      <CardDescription className="break-words">
                        {app.job?.title || "Unknown Position"}
                      </CardDescription>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant="outline">
                          {app.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                          <span className="text-sm">-</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={getStageVariant(app.status)}
                    className="w-fit"
                  >
                    {t[app.status.toLowerCase().replace(/ /g, "") as keyof typeof t] || app.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex flex-wrap gap-1">
                      {/* Skills could be added if available in the applicant model */}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">{t.viewProfile}</span>
                      <span className="sm:hidden">View</span>
                    </Button>
                    <Button size="sm" className="w-full sm:w-auto">
                      <span className="hidden sm:inline">{t.schedule}</span>
                      <span className="sm:hidden">Schedule</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">{t.notes}</span>
                      <span className="sm:hidden">Notes</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </RecruiterPortalLayout>
  );
}

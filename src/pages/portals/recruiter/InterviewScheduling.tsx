/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Clock, Users, Video, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RecruiterPortalLayout } from "@/components/layouts/RecruiterPortalLayout";
import { getInterviews } from "@/lib/api";

export default function InterviewScheduling() {
  const { language } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getInterviews()
      .then((data) => setInterviews(data))
      .catch((err) => setError(err.message || "Failed to load interviews"))
      .finally(() => setLoading(false));
  }, []);

  const content = {
    en: {
      title: "Interview Scheduling",
      description: "Manage interview schedules and appointments",
      today: "Today's Interviews",
      upcoming: "Upcoming Interviews",
      reschedule: "Reschedule",
      cancel: "Cancel",
      join: "Join Interview",
      viewCandidate: "View Candidate",
      interviewType: "Interview Type",
      phone: "Phone",
      video: "Video",
      inPerson: "In-Person",
      duration: "Duration",
      interviewer: "Interviewer",
    },
    es: {
      title: "Programación de Entrevistas",
      description: "Gestionar horarios de entrevistas y citas",
      today: "Entrevistas de Hoy",
      upcoming: "Próximas Entrevistas",
      reschedule: "Reprogramar",
      cancel: "Cancelar",
      join: "Unirse a Entrevista",
      viewCandidate: "Ver Candidato",
      interviewType: "Tipo de Entrevista",
      phone: "Teléfono",
      video: "Video",
      inPerson: "En Persona",
      duration: "Duración",
      interviewer: "Entrevistador",
    },
    fr: {
      title: "Planification des entretiens",
      description: "Gérer les horaires et rendez-vous d'entretien",
      today: "Entretiens d'aujourd'hui",
      upcoming: "Entretiens à venir",
      reschedule: "Replanifier",
      cancel: "Annuler",
      join: "Rejoindre l'entretien",
      viewCandidate: "Voir le candidat",
      interviewType: "Type d'entretien",
      phone: "Téléphone",
      video: "Vidéo",
      inPerson: "En personne",
      duration: "Durée",
      interviewer: "Interviewer",
    },
  };

  const t = content[language];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "phone":
        return <CalendarDays className="h-4 w-4" />;
      case "in-person":
        return <MapPin className="h-4 w-4" />;
      default:
        return <CalendarDays className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "video":
        return t.video;
      case "phone":
        return t.phone;
      case "in-person":
        return t.inPerson;
      default:
        return type;
    }
  };

  // Split interviews into today and upcoming
  const today = new Date();
  const todayInterviews = interviews.filter((i) => {
    const interviewDate = new Date(i.date);
    return (
      interviewDate.getFullYear() === today.getFullYear() &&
      interviewDate.getMonth() === today.getMonth() &&
      interviewDate.getDate() === today.getDate()
    );
  });
  const upcomingInterviews = interviews.filter((i) => {
    const interviewDate = new Date(i.date);
    return interviewDate > today;
  });

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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  {t.today}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="p-8 text-center text-muted-foreground">Loading interviews...</div>
                ) : error ? (
                  <div className="p-8 text-center text-red-500">{error}</div>
                ) : todayInterviews.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No interviews scheduled for today.</div>
                ) : (
                  todayInterviews.map((interview) => (
                    <div
                      key={interview._id}
                      className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg gap-4 mb-2"
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <Avatar className="flex-shrink-0">
                          <AvatarImage src={"/placeholder.svg"} />
                          <AvatarFallback>
                            {interview.candidate?.Names
                              ? interview.candidate.Names.split(" ").map((n: string) => n[0]).join("")
                              : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium break-words">
                            {interview.candidate?.Names || "Unknown"}
                          </h4>
                          <p className="text-sm text-muted-foreground break-words">
                            {interview.job?.title || "Unknown Position"}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                            <span className="flex items-center gap-1 text-sm">
                              <Clock className="h-3 w-3" />
                              {interview.time}
                            </span>
                            <span className="flex items-center gap-1 text-sm">
                              {getTypeIcon(interview.type)}
                              {getTypeLabel(interview.type)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {interview.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <span className="hidden sm:inline">{t.reschedule}</span>
                        <span className="sm:hidden">Reschedule</span>
                      </Button>
                      <Button size="sm" className="w-full sm:w-auto">
                        <span className="hidden sm:inline">{t.join}</span>
                        <span className="sm:hidden">Join</span>
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.upcoming}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="p-8 text-center text-muted-foreground">Loading interviews...</div>
                ) : error ? (
                  <div className="p-8 text-center text-red-500">{error}</div>
                ) : upcomingInterviews.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No upcoming interviews scheduled
                  </div>
                ) : (
                  upcomingInterviews.map((interview) => (
                    <div
                      key={interview._id}
                      className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg gap-4 mb-2"
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <Avatar className="flex-shrink-0">
                          <AvatarImage src={"/placeholder.svg"} />
                          <AvatarFallback>
                            {interview.candidate?.Names
                              ? interview.candidate.Names.split(" ").map((n: string) => n[0]).join("")
                              : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium break-words">
                            {interview.candidate?.Names || "Unknown"}
                          </h4>
                          <p className="text-sm text-muted-foreground break-words">
                            {interview.job?.title || "Unknown Position"}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                            <span className="flex items-center gap-1 text-sm">
                              <Clock className="h-3 w-3" />
                              {interview.time}
                            </span>
                            <span className="flex items-center gap-1 text-sm">
                              {getTypeIcon(interview.type)}
                              {getTypeLabel(interview.type)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {interview.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <span className="hidden sm:inline">{t.reschedule}</span>
                        <span className="sm:hidden">Reschedule</span>
                      </Button>
                      <Button size="sm" className="w-full sm:w-auto">
                        <span className="hidden sm:inline">{t.join}</span>
                        <span className="sm:hidden">Join</span>
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="order-first xl:order-last">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border w-full"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RecruiterPortalLayout>
  );
}

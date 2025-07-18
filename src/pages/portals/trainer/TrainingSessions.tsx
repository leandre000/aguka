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
import { CalendarDays, Clock, Users, Video, MapPin, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrainerPortalLayout } from "@/components/layouts/TrainerPortalLayout";

export default function TrainingSessions() {
  const { language } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const content = {
    en: {
      title: "Training Sessions",
      description: "Schedule and manage training sessions",
      today: "Today's Sessions",
      upcoming: "Upcoming Sessions",
      completed: "Completed",
      scheduled: "Scheduled",
      cancelled: "Cancelled",
      attendees: "Attendees",
      duration: "Duration",
      startSession: "Start Session",
      viewDetails: "View Details",
      reschedule: "Reschedule",
      cancel: "Cancel",
      online: "Online",
      inPerson: "In-Person",
    },
    es: {
      title: "Sesiones de Formación",
      description: "Programar y gestionar sesiones de formación",
      today: "Sesiones de Hoy",
      upcoming: "Próximas Sesiones",
      completed: "Completado",
      scheduled: "Programado",
      cancelled: "Cancelado",
      attendees: "Asistentes",
      duration: "Duración",
      startSession: "Iniciar Sesión",
      viewDetails: "Ver Detalles",
      reschedule: "Reprogramar",
      cancel: "Cancelar",
      online: "En Línea",
      inPerson: "Presencial",
    },
    fr: {
      title: "Sessions de formation",
      description: "Planifier et gérer les sessions de formation",
      today: "Sessions d'aujourd'hui",
      upcoming: "Sessions à venir",
      completed: "Terminée",
      scheduled: "Planifiée",
      cancelled: "Annulée",
      attendees: "Participants",
      duration: "Durée",
      startSession: "Démarrer la session",
      viewDetails: "Voir les détails",
      reschedule: "Replanifier",
      cancel: "Annuler",
      online: "En ligne",
      inPerson: "Présentiel",
    },
  };

  const t = content[language];

  // Dynamic state for sessions
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Uncomment if available
    // getTrainingSessions()
    //   .then((data) => { setSessions(Array.isArray(data) ? data : data.data || []); setError(null); })
    //   .catch(() => setError("Failed to load training sessions"))
    //   .finally(() => setLoading(false));
    // If backend endpoint is not available, show a placeholder message
    // Remove static sessions array
    setSessions([
      {
        id: 1,
        title: "React Development Workshop",
        time: "9:00 AM",
        duration: "3 hours",
        attendees: 12,
        maxAttendees: 15,
        type: "online",
        status: "scheduled",
        instructor: "John Smith",
        avatar: "/placeholder.svg",
      },
      {
        id: 2,
        title: "Leadership Training",
        time: "2:00 PM",
        duration: "2 hours",
        attendees: 8,
        maxAttendees: 10,
        type: "in-person",
        status: "scheduled",
        instructor: "Jane Doe",
        avatar: "/placeholder.svg",
      },
      {
        id: 3,
        title: "Data Privacy Compliance",
        time: "4:00 PM",
        duration: "1.5 hours",
        attendees: 20,
        maxAttendees: 25,
        type: "online",
        status: "completed",
        instructor: "Mike Johnson",
        avatar: "/placeholder.svg",
      },
    ]);
    setLoading(false);
  }, []);

  const getTypeIcon = (type: string) => {
    return type === "online" ? (
      <Video className="h-4 w-4" />
    ) : (
      <MapPin className="h-4 w-4" />
    );
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "scheduled":
        return "default";
      case "completed":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <TrainerPortalLayout>
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
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">Loading sessions...</div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">{error}</div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-8">
                    No sessions scheduled for today.
                  </div>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium break-words">
                            {session.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {session.time}
                            </span>
                            <span className="flex items-center gap-1">
                              {getTypeIcon(session.type)}
                              {session.type === "online" ? t.online : t.inPerson}
                            </span>
                            <span>{session.duration}</span>
                          </div>
                        </div>
                        <Badge
                          variant={getStatusVariant(session.status)}
                          className="w-fit"
                        >
                          {t[session.status as keyof typeof t]}
                        </Badge>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={session.avatar} />
                            <AvatarFallback>
                              {session.instructor
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{session.instructor}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-4 w-4" />
                          {session.attendees}/{session.maxAttendees} {t.attendees}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        {session.status === "scheduled" && (
                          <Button size="sm" className="w-full sm:w-auto">
                            <Play className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">
                              {t.startSession}
                            </span>
                            <span className="sm:hidden">Start</span>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          <span className="hidden sm:inline">
                            {t.viewDetails}
                          </span>
                          <span className="sm:hidden">Details</span>
                        </Button>
                        {session.status === "scheduled" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                            >
                              <span className="hidden sm:inline">
                                {t.reschedule}
                              </span>
                              <span className="sm:hidden">Reschedule</span>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full sm:w-auto"
                            >
                              <span className="hidden sm:inline">{t.cancel}</span>
                              <span className="sm:hidden">Cancel</span>
                            </Button>
                          </>
                        )}
                      </div>
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
                <div className="text-center text-muted-foreground py-8">
                  No upcoming sessions scheduled
                </div>
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
    </TrainerPortalLayout>
  );
}

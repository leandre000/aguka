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
import { CalendarDays, Clock, Users, Video, MapPin, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrainerPortalLayout } from "@/components/layouts/TrainerPortalLayout";
import { getTrainingSessions, startTrainingSession, completeTrainingSession, cancelTrainingSession } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function TrainingSessions() {
  const { language } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();

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
    setError(null);
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    getTrainingSessions({ 
      startDate: today, 
      endDate: today,
      status: 'scheduled,in-progress'
    })
      .then((data) => { 
        setSessions(Array.isArray(data) ? data : []); 
        setError(null); 
      })
      .catch(() => setError("Failed to load training sessions"))
      .finally(() => setLoading(false));
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
      case "in-progress":
        return "default";
      case "completed":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Session management functions
  const handleStartSession = async (sessionId: string) => {
    try {
      await startTrainingSession(sessionId);
      toast({ title: "Session started successfully" });
      // Refresh sessions
      const today = new Date().toISOString().split('T')[0];
      const data = await getTrainingSessions({ 
        startDate: today, 
        endDate: today,
        status: 'scheduled,in-progress'
      });
      setSessions(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to start session", 
        variant: "destructive" 
      });
    }
  };

  const handleCompleteSession = async (sessionId: string) => {
    try {
      await completeTrainingSession(sessionId);
      toast({ title: "Session completed successfully" });
      // Refresh sessions
      const today = new Date().toISOString().split('T')[0];
      const data = await getTrainingSessions({ 
        startDate: today, 
        endDate: today,
        status: 'scheduled,in-progress'
      });
      setSessions(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to complete session", 
        variant: "destructive" 
      });
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    try {
      await cancelTrainingSession(sessionId);
      toast({ title: "Session cancelled successfully" });
      // Refresh sessions
      const today = new Date().toISOString().split('T')[0];
      const data = await getTrainingSessions({ 
        startDate: today, 
        endDate: today,
        status: 'scheduled,in-progress'
      });
      setSessions(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to cancel session", 
        variant: "destructive" 
      });
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
                      key={session._id}
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
                              {session.startTime}
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
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>
                              {session.instructor?.Names
                                ? session.instructor.Names.split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                : "IN"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{session.instructor?.Names || "Instructor"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-4 w-4" />
                          {session.attendeeCount || 0}/{session.maxAttendees} {t.attendees}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        {session.status === "scheduled" && (
                          <Button 
                            size="sm" 
                            className="w-full sm:w-auto"
                            onClick={() => handleStartSession(session._id)}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">
                              {t.startSession}
                            </span>
                            <span className="sm:hidden">Start</span>
                          </Button>
                        )}
                        {session.status === "in-progress" && (
                          <Button 
                            size="sm" 
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                            onClick={() => handleCompleteSession(session._id)}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">
                              Complete Session
                            </span>
                            <span className="sm:hidden">Complete</span>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => navigate(`/portals/trainer/training-sessions/${session._id}`)}
                        >
                          <span className="hidden sm:inline">
                            {t.viewDetails}
                          </span>
                          <span className="sm:hidden">Details</span>
                        </Button>
                        {(session.status === "scheduled" || session.status === "in-progress") && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => handleCancelSession(session._id)}
                          >
                            <span className="hidden sm:inline">{t.cancel}</span>
                            <span className="sm:hidden">Cancel</span>
                          </Button>
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

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Clock, Award, TrendingUp, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrainerPortalLayout } from "@/components/layouts/TrainerPortalLayout";
import { getEnrollments } from "@/lib/api";
import { useEffect, useState } from "react";

export default function EmployeeProgress() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Employee Progress",
      description: "Track learning progress and performance",
      totalEmployees: "Total Employees",
      completedCourses: "Completed Courses",
      averageScore: "Average Score",
      hoursLearned: "Hours Learned",
      progress: "Progress",
      lastActivity: "Last Activity",
      coursesCompleted: "Courses Completed",
      currentCourse: "Current Course",
      viewProfile: "View Profile",
      sendMessage: "Send Message",
      inProgress: "In Progress",
      completed: "Completed",
      notStarted: "Not Started",
    },
    es: {
      title: "Progreso de Empleados",
      description: "Rastrear progreso de aprendizaje y rendimiento",
      totalEmployees: "Total de Empleados",
      completedCourses: "Cursos Completados",
      averageScore: "Puntuación Promedio",
      hoursLearned: "Horas Aprendidas",
      progress: "Progreso",
      lastActivity: "Última Actividad",
      coursesCompleted: "Cursos Completados",
      currentCourse: "Curso Actual",
      viewProfile: "Ver Perfil",
      sendMessage: "Enviar Mensaje",
      inProgress: "En Progreso",
      completed: "Completado",
      notStarted: "No Iniciado",
    },
    fr: {
      title: "Progression des employés",
      description: "Suivre la progression et la performance d'apprentissage",
      totalEmployees: "Nombre total d'employés",
      completedCourses: "Cours terminés",
      averageScore: "Score moyen",
      hoursLearned: "Heures apprises",
      progress: "Progression",
      lastActivity: "Dernière activité",
      coursesCompleted: "Cours terminés",
      currentCourse: "Cours actuel",
      viewProfile: "Voir le profil",
      sendMessage: "Envoyer un message",
      inProgress: "En cours",
      completed: "Terminé",
      notStarted: "Non commencé",
    },
  };

  const t = content[language];

  // Dynamic state
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getEnrollments()
      .then((data) => { setEnrollments(Array.isArray(data) ? data : data.data || []); setError(null); })
      .catch(() => setError("Failed to load employee progress"))
      .finally(() => setLoading(false));
  }, []);

  // Calculate stats from enrollments
  const totalEmployees = new Set(enrollments.map(e => e.employee?._id || e.employee)).size;
  const completedCourses = enrollments.filter(e => e.status === "completed").length;
  const averageScore = enrollments.length > 0 ? Math.round(enrollments.reduce((sum, e) => sum + (e.score || 0), 0) / enrollments.length) : 0;
  const hoursLearned = enrollments.reduce((sum, e) => sum + (e.hours || 0), 0);

  const stats = [
    { label: t.totalEmployees, value: totalEmployees, icon: BookOpen },
    { label: t.completedCourses, value: completedCourses, icon: Award },
    { label: t.averageScore, value: `${averageScore}%`, icon: TrendingUp },
    { label: t.hoursLearned, value: hoursLearned, icon: Clock },
  ];

  // Remove static employees array
  const employees = enrollments.map(enrollment => ({
    id: enrollment._id,
    name: enrollment.employee?.name || "Unknown Employee",
    avatar: "/placeholder.svg", // Assuming a placeholder for now
    currentCourse: enrollment.course?.title || "No Course Assigned",
    progress: enrollment.progress || 0,
    coursesCompleted: enrollment.coursesCompleted || 0,
    lastActivity: enrollment.lastActivity || "N/A",
    status: enrollment.status || "unknown",
  }));

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading && <p>Loading stats...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && stats.map((stat, index) => (
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

        <Card>
          <CardHeader>
            <CardTitle>Employee Learning Progress</CardTitle>
            <CardDescription>Individual progress tracking</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <p>Loading employee progress...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && !error && employees.length === 0 && (
              <p>No employee progress data available.</p>
            )}
            {!loading && !error && employees.length > 0 && (
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <Avatar className="flex-shrink-0">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback>
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 space-y-3">
                        <div>
                          <h4 className="font-medium break-words">
                            {employee.name}
                          </h4>
                          <p className="text-sm text-muted-foreground break-words">
                            {employee.currentCourse}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <div className="flex justify-between text-xs mb-1">
                                <span>{t.progress}</span>
                                <span>{employee.progress}%</span>
                              </div>
                              <Progress
                                value={employee.progress}
                                className="h-2"
                              />
                            </div>
                            <Badge
                              variant={getStatusVariant(employee.status)}
                              className="ml-2"
                            >
                              {getStatusLabel(employee.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 lg:items-end xl:items-center">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {employee.coursesCompleted} {t.coursesCompleted}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.lastActivity}: {employee.lastActivity}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">
                            {t.viewProfile}
                          </span>
                          <span className="sm:hidden">View</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TrainerPortalLayout>
  );
}

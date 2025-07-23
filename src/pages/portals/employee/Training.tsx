/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Play, Clock, Award, Star, TrendingUp } from "lucide-react";
import { EmployeePortalLayout } from "@/components/layouts/EmployeePortalLayout";
import { getCourses, enrollInCourse, getEnrollments, updateProgress } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import { Modal } from "@/components/ui/modal";

const translations = {
  en: {
    title: "Training",
    current: "Current Training",
    recommended: "Recommended",
    completed: "Completed",
    progress: "Progress",
    lessons: "Lessons",
    duration: "Duration",
    enroll: "Enroll",
    enrolling: "Enrolling...",
    updateProgress: "Update Progress",
    markComplete: "Mark as Complete",
    updating: "Updating...",
    undo: "Undo",
    close: "Close",
    published: "Published",
    draft: "Draft",
    modules: "Modules",
    error: "Failed to load training data",
    loading: "Loading training data...",
    noCourses: "No courses available.",
    noEnrollments: "No enrollments found.",
  },
  fr: {
    title: "Formation",
    current: "Formation en cours",
    recommended: "Recommandé",
    completed: "Terminé",
    progress: "Progression",
    lessons: "Leçons",
    duration: "Durée",
    enroll: "S'inscrire",
    enrolling: "Inscription...",
    updateProgress: "Mettre à jour la progression",
    markComplete: "Marquer comme terminé",
    updating: "Mise à jour...",
    undo: "Annuler",
    close: "Fermer",
    published: "Publié",
    draft: "Brouillon",
    modules: "Modules",
    error: "Échec du chargement des données de formation",
    loading: "Chargement des données de formation...",
    noCourses: "Aucun cours disponible.",
    noEnrollments: "Aucune inscription trouvée.",
  },
};

export default function Training() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [progressing, setProgressing] = useState<string | null>(null);
  const [progressInputs, setProgressInputs] = useState<Record<string, number>>({});
  const [previewCourse, setPreviewCourse] = useState<any | null>(null);
  const navigate = useNavigate();

  // Fetch courses and enrollments
  const fetchData = () => {
    setLoading(true);
    Promise.all([getCourses(), getEnrollments()])
      .then(([coursesRes, enrollmentsRes]) => {
        setCourses(coursesRes);
        setEnrollments(enrollmentsRes.data || enrollmentsRes);
      })
      .catch(err => setError(err.message || "Failed to load training data"))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  // Find enrollment for a course
  const getEnrollment = (courseId: string) => enrollments.find((e: any) => e.course === courseId || e.course?._id === courseId);

  // Enroll in a course
  const handleEnroll = async (courseId: string) => {
    setEnrolling(courseId);
    try {
      await enrollInCourse({ course: courseId });
      fetchData();
    } catch (err) {
      alert("Failed to enroll in course");
    } finally {
      setEnrolling(null);
    }
  };

  // Add handler for updating progress
  const handleUpdateProgress = async (enrollmentId: string, progress: number) => {
    setProgressing(enrollmentId);
    try {
      await updateProgress(enrollmentId, { progress, status: progress === 100 ? "completed" : "in-progress" });
      setProgressInputs(prev => ({ ...prev, [enrollmentId]: progress }));
      fetchData();
    } catch (err) {
      alert("Failed to update progress");
    } finally {
      setProgressing(null);
    }
  };

  // Split enrollments
  const currentEnrollments = enrollments.filter((e: any) => e.progress < 100);
  const completedEnrollments = enrollments.filter((e: any) => e.progress === 100);
  const recommendedCourses = courses.filter((c: any) => !getEnrollment(c._id));

  return (
    <EmployeePortalLayout>
      <div className="space-y-4 md:space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">{t(translations.en.title)}</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t(translations.en.current)}</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{currentEnrollments.length}</div>
              <p className="text-xs text-muted-foreground">{t(translations.en.activeCourses)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t(translations.en.completed)}</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {completedEnrollments.length}
              </div>
              <p className="text-xs text-muted-foreground">{t(translations.en.finishedCourses)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t(translations.en.certificates)}
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {completedEnrollments.length}
              </div>
              <p className="text-xs text-muted-foreground">{t(translations.en.earned)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t(translations.en.averageProgress)}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {enrollments.length > 0 ? Math.round(enrollments.reduce((sum: number, e: any) => sum + (e.progress || 0), 0) / enrollments.length) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {t(translations.en.overallProgress)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="current" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current" className="text-xs sm:text-sm">{t(translations.en.currentTraining)}</TabsTrigger>
            <TabsTrigger value="recommended" className="text-xs sm:text-sm">{t(translations.en.recommended)}</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm">{t(translations.en.completed)}</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">{t(translations.en.loading)}</div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">{error}</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {currentEnrollments.map((enrollment: any) => {
                  const course = courses.find((c: any) => c._id === (enrollment.course?._id || enrollment.course));
                  if (!course) return null;
                  const progressValue = progressInputs[enrollment._id] ?? enrollment.progress;
                  return (
                    <Card key={enrollment._id}>
                      <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <CardTitle className="text-base md:text-lg cursor-pointer text-primary hover:underline" onClick={() => setPreviewCourse(course)}>{course.title}</CardTitle>
                          <Badge variant="outline">{course.level}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{t(translations.en.progress)}</span>
                            <span>{progressValue}%</span>
                          </div>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[progressValue]}
                            onValueChange={([val]) => setProgressInputs(prev => ({ ...prev, [enrollment._id]: val }))}
                            className="w-full"
                            disabled={progressing === enrollment._id}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
                          <span>
                            {course.modules?.length || 0} {t(translations.en.lessons)}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {course.duration}
                          </span>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => handleUpdateProgress(enrollment._id, progressValue)}
                          disabled={progressing === enrollment._id || progressValue === enrollment.progress}
                        >
                          {progressing === enrollment._id ? t(translations.en.updating) : progressValue === 100 ? t(translations.en.markComplete) : t(translations.en.updateProgress)}
                        </Button>
                        {progressValue !== enrollment.progress && progressing !== enrollment._id && (
                          <Button
                            variant="outline"
                            className="w-full mt-2"
                            onClick={() => setProgressInputs(prev => ({ ...prev, [enrollment._id]: enrollment.progress }))}
                          >
                            {t(translations.en.undo)}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommended" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">{t(translations.en.loading)}</div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {recommendedCourses.map((course: any) => (
                  <Card key={course._id}>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base md:text-lg">{course.title}</CardTitle>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <Badge variant="outline">{course.level}</Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm ml-1">{course.rating || "-"}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{course.modules?.length || 0} {t(translations.en.lessons)}</span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.duration}
                        </span>
                      </div>
                      <Button className="w-full" onClick={() => handleEnroll(course._id)} disabled={enrolling === course._id}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        {enrolling === course._id ? t(translations.en.enrolling) : t(translations.en.enroll)}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">{t(translations.en.loading)}</div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {completedEnrollments.map((enrollment: any) => {
                  const course = courses.find((c: any) => c._id === (enrollment.course?._id || enrollment.course));
                  if (!course) return null;
                  return (
                    <Card key={enrollment._id}>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-base md:text-lg">{course.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {t(translations.en.completed)}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{t(translations.en.finalProgress)}</span>
                          <Badge variant="secondary">{enrollment.progress}%</Badge>
                        </div>
                        <Button variant="outline" className="w-full">
                          <Award className="h-4 w-4 mr-2" />
                          {t(translations.en.downloadCertificate)}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      {previewCourse && (
        <Modal open={!!previewCourse} onClose={() => setPreviewCourse(null)}>
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold mb-2">{previewCourse.title}</h2>
            <p className="text-muted-foreground mb-2">{previewCourse.description}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline">{previewCourse.category}</Badge>
              <Badge variant="outline">{previewCourse.level}</Badge>
              <Badge variant={previewCourse.status === "published" ? "default" : "secondary"}>
                {previewCourse.status === "published" ? t(translations.en.published) : t(translations.en.draft)}
              </Badge>
            </div>
            <div>
              <strong>{t(translations.en.modules)}:</strong>
              <ul className="list-disc ml-6">
                {previewCourse.modules?.map((m: any, i: number) => (
                  <li key={i}>{m.title || m}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setPreviewCourse(null)}>{t(translations.en.close)}</Button>
            </div>
          </div>
        </Modal>
      )}
    </EmployeePortalLayout>
  );
}

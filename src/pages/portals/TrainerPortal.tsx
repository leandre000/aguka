/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, Award, TrendingUp, Plus, Play, FileText } from "lucide-react";
import { TrainerPortalLayout } from "@/components/layouts/TrainerPortalLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiFetch, getCourses, getEnrollments } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Modal } from "@/components/ui/modal";

const TrainerPortal = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [trainingStats, setTrainingStats] = useState({
    totalCourses: 0,
    activeEnrollments: 0,
    completedCourses: 0,
    averageScore: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dynamic states
  const [courses, setCourses] = useState<any[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [previewCourse, setPreviewCourse] = useState<any | null>(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      getCourses(),
      getEnrollments(),
      apiFetch("/activity-log/system/recent?limit=4")
    ])
      .then(([coursesRes, enrollmentsRes, activityRes]) => {
        const courses = Array.isArray(coursesRes) ? coursesRes : Array.isArray(coursesRes.data) ? coursesRes.data : [];
        setCourses(courses);
        // Enrollments
        const enrollments = Array.isArray(enrollmentsRes) ? enrollmentsRes : Array.isArray(enrollmentsRes.data) ? enrollmentsRes.data : [];
        // Aggregate stats
        const activeEnrollments = enrollments.filter(e => ["enrolled", "in-progress"].includes(e.status)).length;
        const completedCourses = enrollments.filter(e => e.status === "completed").length;
        const scores = enrollments.map(e => typeof e.score === "number" ? e.score : null).filter(s => s !== null);
        const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        setTrainingStats({
          totalCourses: courses.length,
          activeEnrollments,
          completedCourses,
          averageScore
        });
        // Recent system activity
        const sysActivity = Array.isArray(activityRes.logs)
          ? activityRes.logs.map(log => ({
              action: log.action,
              user: log.user?.Names || log.user?.name || "System",
              time: new Date(log.createdAt).toLocaleString(),
              type: log.resource || "system"
            }))
          : [];
        setRecentActivity(sysActivity);
      })
      .catch(() => setError(t("errors.loadFailed")))
      .finally(() => setLoading(false));
  }, [t]);

  useEffect(() => {
    setCoursesLoading(true);
    getCourses()
      .then((data) => { setCourses(Array.isArray(data) ? data : data.data || []); setCoursesError(null); })
      .catch(() => setCoursesError(t("errors.loadCoursesFailed")))
      .finally(() => setCoursesLoading(false));
  }, [t]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Draft": return "bg-yellow-100 text-yellow-800";
      case "Archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <TrainerPortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("trainer.title")}</h1>
          <p className="text-muted-foreground">{t("trainer.subtitle")}</p>
        </div>

      {/* Training Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("trainer.totalCourses")}</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : trainingStats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">{t("trainer.availableCourses")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("trainer.activeEnrollments")}</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{trainingStats.activeEnrollments}</div>
            <p className="text-xs text-muted-foreground">{t("trainer.currentlyLearning")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("trainer.completed")}</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{trainingStats.completedCourses}</div>
            <p className="text-xs text-muted-foreground">{t("trainer.thisMonth")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("trainer.averageScore")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{trainingStats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">{t("trainer.coursePerformance")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Training Courses */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("trainer.trainingCourses")}</CardTitle>
              <CardDescription>{t("trainer.manageAndMonitor")}</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("trainer.createCourse")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {coursesLoading ? (
            <div className="text-center py-8">{t("trainer.loadingCourses")}</div>
          ) : coursesError ? (
            <div className="text-center py-8 text-red-500">{coursesError}</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8">{t("trainer.noCoursesAvailable")}</div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">{course.title}</h3>
                        <Badge variant="outline">{course.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{course.description}</p>
                      <p className="text-xs text-muted-foreground">{t("trainer.duration")}: {course.duration}</p>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <Badge className={getStatusColor(course.status)}>
                        {course.status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setPreviewCourse(course)}>
                          <Play className="h-4 w-4 mr-1" />
                          {t("trainer.preview")}
                        </Button>
                        <Button variant="outline" size="sm">
                          {t("common.edit")}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t("trainer.progress")}: {course.completed}/{course.enrolled} {t("trainer.completed")}</span>
                      <span>{course.completionRate}%</span>
                    </div>
                    <Progress value={course.completionRate} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Learning Paths */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("trainer.learningPaths")}</CardTitle>
              <CardDescription>{t("trainer.structuredLearning")}</CardDescription>
            </div>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              {t("trainer.createLearningPath")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="text-center py-8">{t("trainer.learningPathsNotAvailable")}</div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t("trainer.recentLearningActivity")}</CardTitle>
          <CardDescription>{t("trainer.latestEmployeeProgress")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
                <div className="text-right">
                  {activity.score && (
                    <div className="text-sm font-medium text-primary">{activity.score}%</div>
                  )}
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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
                {previewCourse.status === "published" ? t("trainer.published") : t("trainer.draft")}
              </Badge>
            </div>
            <div>
              <strong>{t("trainer.modules")}:</strong>
              <ul className="list-disc ml-6">
                {previewCourse.modules?.map((m: any, i: number) => (
                  <li key={i}>{m.title || m}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setPreviewCourse(null)}>{t("common.close") || "Close"}</Button>
            </div>
          </div>
        </Modal>
      )}
    </TrainerPortalLayout>
  );
};

export default TrainerPortal;
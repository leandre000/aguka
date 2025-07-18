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

const TrainerPortal = () => {
  const { t } = useLanguage();
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

  // If learning paths are available from backend, add similar state here
  // const [learningPaths, setLearningPaths] = useState<any[]>([]);
  // const [learningPathsLoading, setLearningPathsLoading] = useState(false);
  // const [learningPathsError, setLearningPathsError] = useState<string | null>(null);

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
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCoursesLoading(true);
    getCourses()
      .then((data) => { setCourses(Array.isArray(data) ? data : data.data || []); setCoursesError(null); })
      .catch(() => setCoursesError("Failed to load courses"))
      .finally(() => setCoursesLoading(false));
  }, []);

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
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : trainingStats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">Available courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{trainingStats.activeEnrollments}</div>
            <p className="text-xs text-muted-foreground">Currently learning</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{trainingStats.completedCourses}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{trainingStats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">Course performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Training Courses */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Training Courses</CardTitle>
              <CardDescription>Manage and monitor course progress</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {coursesLoading ? (
            <div className="text-center py-8">Loading courses...</div>
          ) : coursesError ? (
            <div className="text-center py-8 text-red-500">{coursesError}</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8">No courses available.</div>
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
                      <p className="text-xs text-muted-foreground">Duration: {course.duration}</p>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <Badge className={getStatusColor(course.status)}>
                        {course.status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress: {course.completed}/{course.enrolled} completed</span>
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
              <CardTitle>Learning Paths</CardTitle>
              <CardDescription>Structured learning programs</CardDescription>
            </div>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create Learning Path
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* This section will be updated if learning paths are fetched from backend */}
            <div className="text-center py-8">Learning paths are not yet available from the backend.</div>
            {/* {learningPaths.map((path) => (
              <div key={path.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{path.title}</h3>
                    <p className="text-sm text-muted-foreground">{path.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>{path.courses} courses</span>
                      <span>•</span>
                      <span>{path.duration}</span>
                      <span>•</span>
                      <span>{path.enrolled} enrolled</span>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <Badge className={getStatusColor(path.status)}>
                      {path.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              </div>
            ))} */}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Learning Activity</CardTitle>
          <CardDescription>Latest employee training progress</CardDescription>
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
    </TrainerPortalLayout>
  );
};

export default TrainerPortal;
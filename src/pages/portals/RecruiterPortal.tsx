/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Briefcase, Calendar, Users, Eye, MapPin, Clock } from "lucide-react";
import { RecruiterPortalLayout } from "@/components/layouts/RecruiterPortalLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const RecruiterPortal = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [recruitmentStats, setRecruitmentStats] = useState({
    activePositions: 0,
    totalApplicants: 0,
    interviewsScheduled: 0,
    offersExtended: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dynamic lists
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [errorLists, setErrorLists] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      apiFetch("/jobs"),
      apiFetch("/applications"),
      apiFetch("/interviews"),
      apiFetch("/offers"),
      apiFetch("/activity-log/system/recent?limit=4")
    ])
      .then(([jobsRes, applicationsRes, interviewsRes, offersRes, activityRes]) => {
        const jobs = Array.isArray(jobsRes) ? jobsRes : Array.isArray(jobsRes.data) ? jobsRes.data : [];
        const applications = Array.isArray(applicationsRes) ? applicationsRes : Array.isArray(applicationsRes.data) ? applicationsRes.data : [];
        const interviews = Array.isArray(interviewsRes) ? interviewsRes : Array.isArray(interviewsRes.data) ? interviewsRes.data : [];
        const offers = Array.isArray(offersRes) ? offersRes : Array.isArray(offersRes.data) ? offersRes.data : [];
        setRecruitmentStats({
          activePositions: jobs.length,
          totalApplicants: applications.length,
          interviewsScheduled: interviews.length,
          offersExtended: offers.length
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
    setLoadingLists(true);
    setErrorLists("");
    Promise.all([
      apiFetch("/jobs"),
      apiFetch("/applications"),
      apiFetch("/interviews")
    ])
      .then(([jobsRes, applicationsRes, interviewsRes]) => {
        setJobs(Array.isArray(jobsRes) ? jobsRes : Array.isArray(jobsRes.data) ? jobsRes.data : []);
        setCandidates(Array.isArray(applicationsRes) ? applicationsRes : Array.isArray(applicationsRes.data) ? applicationsRes.data : []);
        setInterviews(Array.isArray(interviewsRes) ? interviewsRes : Array.isArray(interviewsRes.data) ? interviewsRes.data : []);
      })
      .catch(() => setErrorLists("Failed to load lists"))
      .finally(() => setLoadingLists(false));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": case "In Progress": return "bg-green-100 text-green-800";
      case "Review": case "Under Review": return "bg-yellow-100 text-yellow-800";
      case "Offer Extended": return "bg-blue-100 text-blue-800";
      case "Closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <RecruiterPortalLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("recruiter.title")}</h1>
            <p className="text-muted-foreground">{t("recruiter.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            {user && <span className="text-sm text-muted-foreground">{user.Names || user.name || user.email}</span>}
            <Button variant="outline" size="sm" onClick={logout}>
              {t("common.logout") || "Logout"}
            </Button>
          </div>
        </div>

      {/* Recruitment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("recruiter.activePositions")}</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : recruitmentStats.activePositions}</div>
            <p className="text-xs text-muted-foreground">{t("recruiter.openJobPostings")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("recruiter.totalApplicants")}</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{recruitmentStats.totalApplicants}</div>
            <p className="text-xs text-muted-foreground">{t("recruiter.activeCandidates")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("recruiter.interviewsScheduled")}</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{recruitmentStats.interviewsScheduled}</div>
            <p className="text-xs text-muted-foreground">{t("recruiter.thisWeek")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("recruiter.offersExtended")}</CardTitle>
            <UserPlus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{recruitmentStats.offersExtended}</div>
            <p className="text-xs text-muted-foreground">{t("recruiter.pendingResponse")}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">{t("recruiter.activeJobs")}</TabsTrigger>
          <TabsTrigger value="candidates">{t("recruiter.candidates")}</TabsTrigger>
          <TabsTrigger value="interviews">{t("recruiter.interviews")}</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t("recruiter.activeJobPostings")}</h2>
            <Button>
              <Briefcase className="h-4 w-4 mr-2" />
              {t("recruiter.createNewJob")}
            </Button>
          </div>

          <div className="space-y-4">
            {loadingLists ? (
              <div className="p-4 text-center text-muted-foreground">Loading jobs...</div>
            ) : errorLists ? (
              <div className="p-4 text-center text-red-500">{errorLists}</div>
            ) : jobs.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No jobs found.</div>
            ) : (
              jobs.map((job) => (
                <Card key={job._id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{job.department}</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{job.location}</span>
                          </div>
                          <span>•</span>
                          <span>{job.employmentType}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">{job.applicants ? job.applicants.length : 0} {t("recruiter.applicants")}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t("recruiter.posted")}: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "-"}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            {t("common.view")}
                          </Button>
                          <Button variant="outline" size="sm">
                            {t("common.edit")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <h2 className="text-xl font-semibold">{t("recruiter.candidatePipeline")}</h2>
          <div className="space-y-4">
            {loadingLists ? (
              <div className="p-4 text-center text-muted-foreground">Loading candidates...</div>
            ) : errorLists ? (
              <div className="p-4 text-center text-red-500">{errorLists}</div>
            ) : candidates.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No candidates found.</div>
            ) : (
              candidates.map((candidate) => (
                <Card key={candidate._id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{candidate.applicant?.Names || candidate.applicant?.name || candidate.applicant?.email || "-"}</h3>
                        <p className="text-sm text-muted-foreground">{t("recruiter.appliedFor")}: {candidate.job?.title || "-"}</p>
                        <p className="text-sm">{candidate.applicant?.email || "-"}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="font-medium">{t("recruiter.stage")}:</span>
                          <span>{candidate.stage || "-"}</span>
                          <span className="font-medium">{t("recruiter.status")}:</span>
                          <span className="text-primary font-bold">{candidate.status || "-"}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t("recruiter.applied")}: {candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : "-"}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(candidate.status)}>
                          {candidate.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            {t("recruiter.viewProfile")}
                          </Button>
                          <Button variant="outline" size="sm">
                            {t("recruiter.scheduleInterview")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="interviews" className="space-y-4">
          <h2 className="text-xl font-semibold">{t("recruiter.upcomingInterviews")}</h2>
          <div className="space-y-4">
            {loadingLists ? (
              <div className="p-4 text-center text-muted-foreground">Loading interviews...</div>
            ) : errorLists ? (
              <div className="p-4 text-center text-red-500">{errorLists}</div>
            ) : interviews.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No interviews found.</div>
            ) : (
              interviews.map((interview) => (
                <Card key={interview._id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{interview.candidate?.Names || interview.candidate?.name || interview.candidate?.email || "-"}</h3>
                        <p className="text-sm text-muted-foreground">{interview.job?.title || "-"}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{interview.date ? new Date(interview.date).toLocaleDateString() : "-"}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{interview.time || "-"}</span>
                          </div>
                        </div>
                        <p className="text-sm">
                          <span className="font-medium">{t("recruiter.interviewer")}:</span> {interview.interviewer?.Names || interview.interviewer?.name || interview.interviewer?.email || "-"}
                        </p>
                        <Badge variant="outline">{interview.type || "-"}</Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          {t("recruiter.reschedule")}
                        </Button>
                        <Button size="sm">
                          {t("recruiter.joinInterview")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </RecruiterPortalLayout>
  );
};

export default RecruiterPortal;
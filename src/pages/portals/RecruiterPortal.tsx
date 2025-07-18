import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Briefcase, Calendar, Users, Eye, MapPin, Clock } from "lucide-react";
import { RecruiterPortalLayout } from "@/components/layouts/RecruiterPortalLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiFetch } from "@/lib/api";

const RecruiterPortal = () => {
  const { t } = useLanguage();
  const [recruitmentStats, setRecruitmentStats] = useState({
    activePositions: 0,
    totalApplicants: 0,
    interviewsScheduled: 0,
    offersExtended: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      apiFetch("/api/jobs"),
      apiFetch("/api/applications"),
      apiFetch("/api/interviews"),
      apiFetch("/api/offers"),
      apiFetch("/api/activity-log/system/recent?limit=4")
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
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  const activeJobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      applicants: 15,
      posted: "2024-01-10",
      status: "Active"
    },
    {
      id: 2,
      title: "UX Designer",
      department: "Design",
      location: "New York",
      type: "Full-time",
      applicants: 8,
      posted: "2024-01-15",
      status: "Active"
    },
    {
      id: 3,
      title: "Marketing Manager",
      department: "Marketing",
      location: "San Francisco",
      type: "Full-time",
      applicants: 12,
      posted: "2024-01-05",
      status: "Review"
    }
  ];

  const candidates = [
    {
      id: 1,
      name: "Alice Johnson",
      position: "Senior Software Engineer",
      email: "alice.johnson@email.com",
      stage: "Technical Interview",
      score: 85,
      appliedDate: "2024-01-20",
      status: "In Progress"
    },
    {
      id: 2,
      name: "Bob Martinez",
      position: "UX Designer",
      email: "bob.martinez@email.com",
      stage: "Portfolio Review",
      score: 78,
      appliedDate: "2024-01-22",
      status: "Under Review"
    },
    {
      id: 3,
      name: "Carol Lee",
      position: "Marketing Manager",
      stage: "Final Interview",
      email: "carol.lee@email.com",
      score: 92,
      appliedDate: "2024-01-18",
      status: "Offer Extended"
    }
  ];

  const upcomingInterviews = [
    {
      id: 1,
      candidate: "Alice Johnson",
      position: "Senior Software Engineer",
      date: "2024-01-30",
      time: "10:00 AM",
      interviewer: "John Smith",
      type: "Technical"
    },
    {
      id: 2,
      candidate: "David Wilson",
      position: "UX Designer",
      date: "2024-01-31",
      time: "2:00 PM",
      interviewer: "Sarah Brown",
      type: "Design Review"
    }
  ];

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
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("recruiter.title")}</h1>
          <p className="text-muted-foreground">{t("recruiter.subtitle")}</p>
        </div>

      {/* Recruitment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : recruitmentStats.activePositions}</div>
            <p className="text-xs text-muted-foreground">Open job postings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{recruitmentStats.totalApplicants}</div>
            <p className="text-xs text-muted-foreground">Active candidates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{recruitmentStats.interviewsScheduled}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offers Extended</CardTitle>
            <UserPlus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{recruitmentStats.offersExtended}</div>
            <p className="text-xs text-muted-foreground">Pending response</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Active Job Postings</h2>
            <Button>
              <Briefcase className="h-4 w-4 mr-2" />
              Create New Job
            </Button>
          </div>

          <div className="space-y-4">
            {activeJobs.map((job) => (
              <Card key={job.id}>
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
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{job.applicants} applicants</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Posted: {new Date(job.posted).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <h2 className="text-xl font-semibold">Candidate Pipeline</h2>
          
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <Card key={candidate.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground">Applied for: {candidate.position}</p>
                      <p className="text-sm">{candidate.email}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="font-medium">Stage:</span>
                        <span>{candidate.stage}</span>
                        <span className="font-medium">Score:</span>
                        <span className="text-primary font-bold">{candidate.score}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Applied: {new Date(candidate.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <Badge className={getStatusColor(candidate.status)}>
                        {candidate.status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          Schedule Interview
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interviews" className="space-y-4">
          <h2 className="text-xl font-semibold">Upcoming Interviews</h2>
          
          <div className="space-y-4">
            {upcomingInterviews.map((interview) => (
              <Card key={interview.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{interview.candidate}</h3>
                      <p className="text-sm text-muted-foreground">{interview.position}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(interview.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{interview.time}</span>
                        </div>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Interviewer:</span> {interview.interviewer}
                      </p>
                      <Badge variant="outline">{interview.type}</Badge>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button size="sm">
                        Join Interview
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </RecruiterPortalLayout>
  );
};

export default RecruiterPortal;
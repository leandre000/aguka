/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Briefcase, Users, Calendar, Eye } from "lucide-react";
import { getJobPostings } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const Recruitment = () => {
  const [activeTab, setActiveTab] = useState("positions");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    setLoading(true);
    setError(null);
    getJobPostings()
      .then((data) => setJobs(data))
      .catch((err) => setError(err.message || "Failed to load jobs"))
      .finally(() => setLoading(false));
  }, []);

  const candidates = [
    {
      id: 1,
      name: "Alice Johnson",
      position: "Senior Software Engineer",
      email: "alice.johnson@email.com",
      phone: "+1 (555) 987-6543",
      status: "Interview Scheduled",
      stage: "Technical Interview",
      experience: "5 years",
      appliedDate: "2024-01-20"
    },
    {
      id: 2,
      name: "Bob Martinez",
      position: "UX Designer",
      email: "bob.martinez@email.com",
      phone: "+1 (555) 876-5432",
      status: "Under Review",
      stage: "Portfolio Review",
      experience: "3 years",
      appliedDate: "2024-01-22"
    },
    {
      id: 3,
      name: "Carol Lee",
      position: "Marketing Manager",
      email: "carol.lee@email.com",
      phone: "+1 (555) 765-4321",
      status: "Offer Extended",
      stage: "Final Decision",
      experience: "7 years",
      appliedDate: "2024-01-18"
    }
  ];

  const interviews = [
    {
      id: 1,
      candidate: "Alice Johnson",
      position: "Senior Software Engineer",
      type: "Technical Interview",
      date: "2024-01-30",
      time: "10:00 AM",
      interviewer: "John Smith",
      status: "Scheduled"
    },
    {
      id: 2,
      candidate: "David Wilson",
      position: "UX Designer",
      type: "Design Review",
      date: "2024-01-31",
      time: "2:00 PM",
      interviewer: "Sarah Brown",
      status: "Scheduled"
    },
    {
      id: 3,
      candidate: "Emily Davis",
      position: "Marketing Manager",
      type: "Final Interview",
      date: "2024-02-01",
      time: "11:00 AM",
      interviewer: "Mike Johnson",
      status: "Completed"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": case "Scheduled": return "bg-green-100 text-green-800";
      case "Review": case "Under Review": return "bg-yellow-100 text-yellow-800";
      case "Interview Scheduled": return "bg-blue-100 text-blue-800";
      case "Offer Extended": return "bg-purple-100 text-purple-800";
      case "Completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recruitment</h1>
          <p className="text-muted-foreground">Manage job postings, candidates, and interviews</p>
        </div>
        <div className="flex items-center gap-2">
          {user && <span className="text-sm text-muted-foreground">{user.Names || user.name || user.email}</span>}
          <Button variant="outline" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="positions">Open Positions</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-4">
          <div className="max-w-4xl mx-auto p-4 space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Job Postings</h1>
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading jobs...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : jobs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No jobs found.</div>
            ) : (
              jobs.map((job) => (
                <div key={job._id} className="border rounded-lg p-4 mb-4 bg-card">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-2">
                    <div>
                      <h2 className="text-lg font-semibold">{job.title}</h2>
                      <div className="text-sm text-muted-foreground mb-1">{job.department} • {job.location} • {job.employmentType}</div>
                      <div className="text-xs text-muted-foreground">Posted by: {job.postedBy?.Names || job.postedBy?.name || job.postedBy?.Email || "-"} on {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "-"}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === "Open" ? "bg-green-100 text-green-700" : job.status === "Closed" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{job.status}</span>
                  </div>
                  <div className="mb-2 text-sm">{job.description}</div>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-2">
                    <span>Salary: {job.salaryRange ? `$${job.salaryRange.min} - $${job.salaryRange.max}` : "-"}</span>
                    <span>Requirements: {job.requirements?.join(", ") || "-"}</span>
                    <span>Responsibilities: {job.responsibilities?.join(", ") || "-"}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Applicants: {job.applicants?.length || 0}</div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <div className="grid gap-4">
            {candidates.map((candidate) => (
              <Card key={candidate.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground">Applied for: {candidate.position}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span>{candidate.email}</span>
                        <span>•</span>
                        <span>{candidate.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="font-medium">Experience:</span>
                        <span>{candidate.experience}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={getStatusColor(candidate.status)}>
                        {candidate.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Stage: {candidate.stage}
                      </p>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                    Applied: {new Date(candidate.appliedDate).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interviews" className="space-y-4">
          <div className="grid gap-4">
            {interviews.map((interview) => (
              <Card key={interview.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{interview.candidate}</h3>
                      <p className="text-sm text-muted-foreground">{interview.position}</p>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{interview.type}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span>{new Date(interview.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{interview.time}</span>
                      </div>
                      <p className="text-sm">Interviewer: {interview.interviewer}</p>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={getStatusColor(interview.status)}>
                        {interview.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {interview.status === "Scheduled" ? "Join Interview" : "View Details"}
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
  );
};

export default Recruitment;
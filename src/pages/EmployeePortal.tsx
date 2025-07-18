import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, User, Clock, MessageSquare, BookOpen, Award } from "lucide-react";
import { EmployeePortalLayout } from "@/components/layouts/EmployeePortalLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import { getMyLeaveRequests, getEmployeePayroll, getTrainingEnrollments, getEmployeeDocuments } from "@/lib/api";

const EmployeePortal = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("profile");
  const [benefits, setBenefits] = useState<any[]>([]);
  const [benefitsLoading, setBenefitsLoading] = useState(false);
  const [benefitsError, setBenefitsError] = useState<string | null>(null);

  // Mock employee data
  const employee = {
    name: "John Doe",
    employeeId: "EMP001",
    position: "Senior Software Engineer",
    department: "Engineering",
    manager: "Sarah Wilson",
    startDate: "2023-01-15",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, San Francisco, CA 94105"
  };

  // --- Time Off ---
  const [timeOffRequests, setTimeOffRequests] = useState<any[]>([]);
  const [timeOffLoading, setTimeOffLoading] = useState(false);
  const [timeOffError, setTimeOffError] = useState<string | null>(null);
  useEffect(() => {
    setTimeOffLoading(true);
    getMyLeaveRequests()
      .then((data) => { setTimeOffRequests(data); setTimeOffError(null); })
      .catch(() => setTimeOffError("Failed to load time off requests"))
      .finally(() => setTimeOffLoading(false));
  }, []);

  // --- Payroll ---
  const [payStubs, setPayStubs] = useState<any[]>([]);
  const [payrollLoading, setPayrollLoading] = useState(false);
  const [payrollError, setPayrollError] = useState<string | null>(null);
  useEffect(() => {
    setPayrollLoading(true);
    getEmployeePayroll(employee.employeeId)
      .then((data) => { setPayStubs(data); setPayrollError(null); })
      .catch(() => setPayrollError("Failed to load payroll"))
      .finally(() => setPayrollLoading(false));
  }, [employee.employeeId]);

  // --- Training ---
  const [trainingCourses, setTrainingCourses] = useState<any[]>([]);
  const [trainingLoading, setTrainingLoading] = useState(false);
  const [trainingError, setTrainingError] = useState<string | null>(null);
  useEffect(() => {
    setTrainingLoading(true);
    getTrainingEnrollments()
      .then((data) => { setTrainingCourses(data); setTrainingError(null); })
      .catch(() => setTrainingError("Failed to load training"))
      .finally(() => setTrainingLoading(false));
  }, []);

  // --- Documents ---
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  useEffect(() => {
    setDocumentsLoading(true);
    getEmployeeDocuments(employee.employeeId)
      .then((data) => { setDocuments(data); setDocumentsError(null); })
      .catch(() => setDocumentsError("Failed to load documents"))
      .finally(() => setDocumentsLoading(false));
  }, [employee.employeeId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": case "Completed": return "bg-green-100 text-green-800";
      case "Pending": case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Rejected": case "Not Started": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <EmployeePortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("employee.title")}</h1>
          <p className="text-muted-foreground">Welcome back, {employee.name}</p>
        </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="timeoff">Time Off</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-lg">{employee.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Employee ID</label>
                    <p>{employee.employeeId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Position</label>
                    <p>{employee.position}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Department</label>
                    <p>{employee.department}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Manager</label>
                    <p>{employee.manager}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Start Date</label>
                    <p>{new Date(employee.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p>{employee.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p>{employee.phone}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <p>{employee.address}</p>
                </div>
              </div>
              
              <Button>Update Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeoff" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Time Off Requests</h2>
              <p className="text-sm text-muted-foreground">Available PTO: {benefits.pto.available - benefits.pto.used} days</p>
            </div>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Request Time Off
            </Button>
          </div>

          <div className="space-y-4">
            {timeOffLoading && <p>Loading time off requests...</p>}
            {timeOffError && <p className="text-red-500">{timeOffError}</p>}
            {!timeOffLoading && !timeOffError && timeOffRequests.length === 0 && (
              <p>No time off requests found.</p>
            )}
            {timeOffRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <h3 className="font-semibold">{request.type}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm">Duration: {request.days} day{request.days > 1 ? 's' : ''}</p>
                      <p className="text-sm">Reason: {request.reason}</p>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Pay Stubs</h2>
          </div>

          <div className="space-y-4">
            {payrollLoading && <p>Loading payroll stubs...</p>}
            {payrollError && <p className="text-red-500">{payrollError}</p>}
            {!payrollLoading && !payrollError && payStubs.length === 0 && (
              <p>No pay stubs found.</p>
            )}
            {payStubs.map((stub) => (
              <Card key={stub.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{stub.period}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Gross Pay:</span>
                          <span className="ml-2">${stub.grossPay.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="font-medium">Net Pay:</span>
                          <span className="ml-2 text-primary font-bold">${stub.netPay.toLocaleString()}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Pay Date: {new Date(stub.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          {benefitsLoading && <p>Loading benefits...</p>}
          {benefitsError && <p className="text-red-500">{benefitsError}</p>}
          {!benefitsLoading && !benefitsError && benefits.length === 0 && (
            <p>No benefits found.</p>
          )}
          <div className="grid gap-6">
            {benefits.map((benefit) => (
              <Card key={benefit._id}>
                <CardHeader>
                  <CardTitle>{benefit.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium">Type:</span>
                      <p>{benefit.type}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Status:</span>
                      <p>{benefit.status}</p>
                    </div>
                    {benefit.description && (
                      <div className="col-span-2">
                        <span className="text-sm font-medium">Description:</span>
                        <p>{benefit.description}</p>
                      </div>
                    )}
                    {benefit.startDate && (
                      <div>
                        <span className="text-sm font-medium">Start Date:</span>
                        <p>{new Date(benefit.startDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {benefit.endDate && (
                      <div>
                        <span className="text-sm font-medium">End Date:</span>
                        <p>{new Date(benefit.endDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {benefit.eligibility && (
                      <div className="col-span-2">
                        <span className="text-sm font-medium">Eligibility:</span>
                        <p>{benefit.eligibility}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="space-y-4">
            {documentsLoading && <p>Loading documents...</p>}
            {documentsError && <p className="text-red-500">{documentsError}</p>}
            {!documentsLoading && !documentsError && documents.length === 0 && (
              <p>No documents found.</p>
            )}
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-semibold">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • {doc.size} • Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <div className="space-y-4">
            {trainingLoading && <p>Loading training courses...</p>}
            {trainingError && <p className="text-red-500">{trainingError}</p>}
            {!trainingLoading && !trainingError && trainingCourses.length === 0 && (
              <p>No training courses found.</p>
            )}
            {trainingCourses.map((course) => (
              <Card key={course.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold">{course.title}</h3>
                          {course.certificate && (
                            <Award className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        {course.completedDate && (
                          <p className="text-sm text-muted-foreground">
                            Completed: {new Date(course.completedDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Badge className={getStatusColor(course.status)}>
                        {course.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        {course.certificate && course.status === "Completed" && (
                          <Button variant="outline" size="sm">
                            <Award className="h-4 w-4 mr-1" />
                            Download Certificate
                          </Button>
                        )}
                      </div>
                      <Button size="sm">
                        {course.status === "Completed" ? "Review" : course.status === "In Progress" ? "Continue" : "Start Course"}
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
    </EmployeePortalLayout>
  );
};

export default EmployeePortal;
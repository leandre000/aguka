/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, User, Clock, MessageSquare, BookOpen, Award } from "lucide-react";
import { EmployeePortalLayout } from "@/components/layouts/EmployeePortalLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import { getMyLeaveRequests, getTrainingEnrollments, getMyDocuments, getMyEmployeeProfile, getBenefits, getBackendUrl, getMyPayroll } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { uploadMyDocuments } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const EmployeePortal = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [benefits, setBenefits] = useState<any[]>([]);
  const [benefitsLoading, setBenefitsLoading] = useState(false);
  const [benefitsError, setBenefitsError] = useState<string | null>(null);

  // Real employee data
  const [employee, setEmployee] = useState<any>(null);
  const [employeeLoading, setEmployeeLoading] = useState(true);
  const [employeeError, setEmployeeError] = useState<string | null>(null);

  // Fetch employee profile
  useEffect(() => {
    if (user?._id) {
      setEmployeeLoading(true);
      getMyEmployeeProfile()
        .then((response) => { 
          // Handle the nested data structure from API
          const employeeData = response?.data || response;
          setEmployee(employeeData); 
          setEmployeeError(null); 
        })
        .catch((err) => {
          console.error('Employee profile error:', err);
          setEmployeeError("Failed to load employee profile");
          setEmployee(null);
        })
        .finally(() => setEmployeeLoading(false));
    }
  }, [user]);

  // --- Time Off ---
  const [timeOffRequests, setTimeOffRequests] = useState<any[]>([]);
  const [timeOffLoading, setTimeOffLoading] = useState(false);
  const [timeOffError, setTimeOffError] = useState<string | null>(null);
  useEffect(() => {
    setTimeOffLoading(true);
    getMyLeaveRequests()
      .then((response) => { 
        // Handle the nested data structure from API
        const requests = response?.data || response;
        const requestsArray = Array.isArray(requests) ? requests : [];
        setTimeOffRequests(requestsArray); 
        setTimeOffError(null); 
      })
      .catch((err) => {
        console.error('Time off requests error:', err);
        setTimeOffError("Failed to load time off requests");
        setTimeOffRequests([]); // Ensure it's an empty array on error
      })
      .finally(() => setTimeOffLoading(false));
  }, []);

  // --- Payroll ---
  const [payStubs, setPayStubs] = useState<any[]>([]);
  const [payrollLoading, setPayrollLoading] = useState(false);
  const [payrollError, setPayrollError] = useState<string | null>(null);
  useEffect(() => {
    setPayrollLoading(true);
    getMyPayroll()
      .then((response) => { 
        // Handle the nested data structure from API
        const payrollData = response?.data || response;
        const stubs = Array.isArray(payrollData) ? payrollData : [];
        setPayStubs(stubs); 
        setPayrollError(null); 
      })
      .catch((err) => {
        console.error('Payroll error:', err);
        setPayrollError("Failed to load payroll");
        setPayStubs([]);
      })
      .finally(() => setPayrollLoading(false));
  }, []);

  // --- Training ---
  const [trainingCourses, setTrainingCourses] = useState<any[]>([]);
  const [trainingLoading, setTrainingLoading] = useState(false);
  const [trainingError, setTrainingError] = useState<string | null>(null);
  useEffect(() => {
    setTrainingLoading(true);
    getTrainingEnrollments()
      .then((response) => { 
        // Handle the nested data structure from API
        const trainingData = response?.data || response;
        const courses = Array.isArray(trainingData) ? trainingData : [];
        setTrainingCourses(courses); 
        setTrainingError(null); 
      })
      .catch((err) => {
        console.error('Training error:', err);
        setTrainingError("Failed to load training");
        setTrainingCourses([]);
      })
      .finally(() => setTrainingLoading(false));
  }, []);

  // --- Documents ---
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  useEffect(() => {
    setDocumentsLoading(true);
    getMyDocuments()
      .then((response) => { 
        // Handle the nested data structure from API
        const docsData = response?.data || response;
        const docs = Array.isArray(docsData) ? docsData : [];
        setDocuments(docs); 
        setDocumentsError(null); 
      })
      .catch((err) => {
        console.error('Documents error:', err);
        setDocumentsError("Failed to load documents");
        setDocuments([]);
      })
      .finally(() => setDocumentsLoading(false));
  }, []);

  // --- Benefits ---
  useEffect(() => {
    setBenefitsLoading(true);
    getBenefits()
      .then((response) => { 
        // Handle the nested data structure from API
        const benefitsData = response?.data || response;
        const benefitsList = Array.isArray(benefitsData) ? benefitsData : [];
        setBenefits(benefitsList); 
        setBenefitsError(null); 
      })
      .catch((err) => {
        console.error('Benefits error:', err);
        setBenefitsError("Failed to load benefits");
        setBenefits([]);
      })
      .finally(() => setBenefitsLoading(false));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": case "Completed": return "bg-green-100 text-green-800";
      case "Pending": case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Rejected": case "Not Started": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const { toast } = useToast();

  // Utility function to handle API response structure
  const extractDataFromResponse = (response: any) => {
    return response?.data || response;
  };

  // Utility function to ensure data is an array
  const ensureArray = (data: any) => {
    return Array.isArray(data) ? data : [];
  };

  return (
    <EmployeePortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("employee.title")}</h1>
          <p className="text-muted-foreground">
            Welcome back, {employee?.user?.Names || user?.Names || 'Employee'}!
          </p>
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
          {employeeLoading && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading employee profile...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {employeeError && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-red-500 mb-4">{employeeError}</p>
                  <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {!employeeLoading && !employeeError && employee && (
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
                      <p className="text-lg">{employee?.user?.Names || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Position</label>
                      <p>{employee?.position || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Department</label>
                      <p>{employee?.user?.department || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Manager</label>
                      <p>{employee?.manager ? 'Assigned' : 'Not Assigned'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Start Date</label>
                      <p>{employee?.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p>{employee?.user?.Email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <p>{employee?.user?.phoneNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium">Address</label>
                    <p>{employee?.address || 'N/A'}</p>
                  </div>
                  {employee?.emergencyContact && (
                    <div className="mt-4">
                      <label className="text-sm font-medium">Emergency Contact</label>
                      <p>{employee.emergencyContact.name} ({employee.emergencyContact.relation})</p>
                      <p className="text-sm text-muted-foreground">{employee.emergencyContact.phone}</p>
                    </div>
                  )}
                </div>
                
                <Button disabled>Update Profile</Button>
              </CardContent>
            </Card>
          )}
          
          {!employeeLoading && !employeeError && !employee && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No employee profile found.</p>
                  <p className="text-sm text-muted-foreground">Please contact HR to create your employee profile.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="timeoff" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Time Off Requests</h2>
              {/* Fix PTO display: find PTO benefit in array */}
              {(() => {
                const pto = benefits.find(b => b.type?.toLowerCase() === "pto" || b.name?.toLowerCase() === "pto");
                const available = pto?.available ?? 0;
                const used = pto?.used ?? 0;
                return (
                  <p className="text-sm text-muted-foreground">
                    Available PTO: {available - used} days
                  </p>
                );
              })()}
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
            {Array.isArray(timeOffRequests) && timeOffRequests.map((request) => (
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
            <h2 className="text-xl font-semibold">{t("employee.payroll.title")}</h2>
          </div>

          <div className="space-y-4">
            {payrollLoading && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">{t("employee.payroll.loading")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {payrollError && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <p className="text-red-500 mb-4">{payrollError}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {!payrollLoading && !payrollError && payStubs.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">{t("employee.payroll.noStubs")}</p>
                    <p className="text-sm text-muted-foreground">{t("employee.payroll.noStubsDesc")}</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {!payrollLoading && !payrollError && payStubs.length > 0 && payStubs.map((stub) => (
              <Card key={stub._id || stub.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">
                          {stub.period || `${t("employee.payroll.payPeriod")} ${stub._id ? stub._id.slice(-6) : 'N/A'}`}
                        </h3>
                        <Badge className={getStatusColor(stub.status || 'Pending')}>
                          {stub.status || 'Pending'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">{t("employee.payroll.baseSalary")}:</span>
                          <p className="text-lg">${stub.baseSalary?.toLocaleString() || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">{t("employee.payroll.bonus")}:</span>
                          <p className="text-lg">${stub.bonus?.toLocaleString() || '0'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">{t("employee.payroll.overtime")}:</span>
                          <p className="text-lg">${stub.overtime?.toLocaleString() || '0'}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">{t("employee.payroll.deductions")}:</span>
                          <p className="text-lg text-red-600">-${stub.deductions?.toLocaleString() || '0'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">{t("employee.payroll.tax")}:</span>
                          <p className="text-lg text-red-600">-${stub.tax?.toLocaleString() || '0'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">{t("employee.payroll.netPay")}:</span>
                          <p className="text-lg font-bold text-primary">${stub.netPay?.toLocaleString() || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span>
                          {t("employee.payroll.generated")}: {stub.createdAt ? new Date(stub.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                        <span>
                          {t("employee.payroll.payDate")}: {stub.payDate ? new Date(stub.payDate).toLocaleDateString() : stub.createdAt ? new Date(stub.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex flex-col gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        {t("employee.payroll.download")}
                      </Button>
                      {stub.iremboBillId && (
                        <Badge variant="secondary" className="text-xs">
                          {t("employee.payroll.paymentId")}: {stub.iremboBillId}
                        </Badge>
                      )}
                    </div>
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
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Documents</h2>
            <Button onClick={() => document.getElementById('documentUpload')?.click()}>
              <FileText className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>

          <input
            id="documentUpload"
            type="file"
            multiple
            className="hidden"
            onChange={async (e) => {
              const files = e.target.files;
              if (!files || files.length === 0) return;
              
              const formData = new FormData();
              Array.from(files).forEach(file => {
                formData.append('documents', file);
              });
              
              try {
                await uploadMyDocuments(formData);
                // Refresh documents
                const newDocsResponse = await getMyDocuments();
                const newDocs = newDocsResponse?.data || newDocsResponse || [];
                setDocuments(newDocs);
                toast({ title: "Success", description: "Documents uploaded successfully!" });
              } catch (err: any) {
                const errorMsg = err?.response?.data?.message || err?.message || "Failed to upload documents";
                toast({ title: "Error", description: errorMsg, variant: "destructive" });
              }
              
              // Reset input
              e.target.value = '';
            }}
          />

          <div className="space-y-4">
            {documentsLoading && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading documents...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {documentsError && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <p className="text-red-500 mb-4">{documentsError}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {!documentsLoading && !documentsError && documents.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">No documents found</p>
                    <p className="text-sm text-muted-foreground">Upload your first document to get started.</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {!documentsLoading && !documentsError && documents.length > 0 && documents.map((doc, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-semibold">{doc.originalName || doc.type || 'Document'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {doc.originalName || doc.fileUrl?.split('/').pop() || 'Document'} • 
                          {doc.uploadedAt ? ` Uploaded: ${new Date(doc.uploadedAt).toLocaleDateString()}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        const backendUrl = getBackendUrl();
                        const fullUrl = doc.fileUrl?.startsWith('http') ? doc.fileUrl : `${backendUrl}${doc.fileUrl}`;
                        window.open(fullUrl, '_blank');
                      }}>
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        const backendUrl = getBackendUrl();
                        const fullUrl = doc.fileUrl?.startsWith('http') ? doc.fileUrl : `${backendUrl}${doc.fileUrl}`;
                        const link = document.createElement('a');
                        link.href = fullUrl;
                        link.download = doc.originalName || doc.fileUrl?.split('/').pop() || 'document';
                        link.click();
                      }}>
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Training & Development</h2>
          </div>

          <div className="space-y-4">
            {trainingLoading && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading training courses...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {trainingError && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <p className="text-red-500 mb-4">{trainingError}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {!trainingLoading && !trainingError && trainingCourses.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">No training courses found</p>
                    <p className="text-sm text-muted-foreground">Enroll in training courses to develop your skills.</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {!trainingLoading && !trainingError && trainingCourses.length > 0 && trainingCourses.map((course) => (
              <Card key={course.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4" />
                        <h3 className="font-semibold">{course.name || course.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {course.description || 'No description available'}
                      </p>
                      <p className="text-sm">
                        Duration: {course.duration || 'N/A'} • 
                        Status: <span className={`font-medium ${getStatusColor(course.status || 'Not Started').replace('bg-', 'text-').replace('text-', '')}`}>
                          {course.status || 'Not Started'}
                        </span>
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
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
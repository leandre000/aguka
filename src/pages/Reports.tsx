/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, LineChart, TrendingUp, Download, Calendar, Filter, PieChart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getReports, getHiringReport, getTurnoverReport, getPayrollSummaryReport, getDiversityReport, getActivityLogs, getSystemStats, getRecentSystemActivities, getPerformanceReviews, getTrainingEnrollments, getLeaveRequests, getPayrollRecords, getCustomReport, exportReportPDF, exportReportExcel } from "@/lib/api";
import { useEffect, useRef } from "react";

const DATA_SOURCES = [
  { value: 'employees', label: 'Employees' },
  { value: 'payroll', label: 'Payroll' },
  { value: 'leave', label: 'Leave Requests' },
  { value: 'performance', label: 'Performance Reviews' },
  { value: 'training', label: 'Training Enrollments' },
];

const FIELDS: Record<string, { value: string; label: string }[]> = {
  employees: [
    { value: 'Names', label: 'Name' },
    { value: 'Email', label: 'Email' },
    { value: 'department', label: 'Department' },
    { value: 'role', label: 'Role' },
    { value: 'status', label: 'Status' },
  ],
  payroll: [
    { value: 'baseSalary', label: 'Base Salary' },
    { value: 'bonus', label: 'Bonus' },
    { value: 'netPay', label: 'Net Pay' },
    { value: 'period', label: 'Period' },
  ],
  leave: [
    { value: 'type', label: 'Leave Type' },
    { value: 'startDate', label: 'Start Date' },
    { value: 'endDate', label: 'End Date' },
    { value: 'status', label: 'Status' },
  ],
  performance: [
    { value: 'employee', label: 'Employee' },
    { value: 'reviewDate', label: 'Review Date' },
    { value: 'rating', label: 'Rating' },
  ],
  training: [
    { value: 'employee', label: 'Employee' },
    { value: 'course', label: 'Course' },
    { value: 'progress', label: 'Progress' },
  ],
};

const Reports = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("last30days");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>({});

  const [customSource, setCustomSource] = useState('employees');
  const [customFields, setCustomFields] = useState<string[]>(['Names', 'Email']);
  const [customFilters, setCustomFilters] = useState<{ field: string; value: string }[]>([]);
  const [customReport, setCustomReport] = useState<any[]>([]);
  const [customLoading, setCustomLoading] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);
  const [customExporting, setCustomExporting] = useState(false);
  const filterFieldRef = useRef<HTMLSelectElement>(null);
  const filterValueRef = useRef<HTMLInputElement>(null);

  // Fetch dynamic report data based on role
  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        const data: any = {};
        if (user?.role === "admin" || user?.role === "hr") {
          data.allReports = await getReports();
          data.hiring = await getHiringReport();
          data.turnover = await getTurnoverReport();
          data.payroll = await getPayrollSummaryReport();
          data.diversity = await getDiversityReport();
          data.systemStats = await getSystemStats();
          data.recentActivities = await getRecentSystemActivities();
          data.performanceReviews = await getPerformanceReviews();
          data.trainingEnrollments = await getTrainingEnrollments();
          data.leaveRequests = await getLeaveRequests();
          data.payrollRecords = await getPayrollRecords();
        } else if (user?.role === "manager") {
          data.hiring = await getHiringReport();
          data.turnover = await getTurnoverReport();
          data.payroll = await getPayrollSummaryReport();
          data.performanceReviews = await getPerformanceReviews();
          data.trainingEnrollments = await getTrainingEnrollments();
          data.leaveRequests = await getLeaveRequests();
          data.payrollRecords = await getPayrollRecords();
        } else if (user?.role === "employee") {
          // Employees see only their own analytics, e.g. performance, training, payslips
          data.performanceReviews = await getPerformanceReviews({ employee: user._id });
          data.trainingEnrollments = await getTrainingEnrollments();
          data.leaveRequests = await getLeaveRequests();
          data.payrollRecords = await getPayrollRecords();
        } else if (user?.role === "auditor") {
          data.allReports = await getReports();
          data.activityLogs = await getActivityLogs();
          data.systemStats = await getSystemStats();
        }
        setReportData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  async function runCustomReport() {
    setCustomLoading(true);
    setCustomError(null);
    try {
      // Call backend custom report API
      const params = {
        source: customSource,
        fields: customFields,
        filters: customFilters,
      };
      const data = await getCustomReport(params);
      setCustomReport(data.rows || []);
    } catch (err: any) {
      setCustomError(err.message || 'Failed to generate report');
    } finally {
      setCustomLoading(false);
    }
  }

  async function exportCustomReport(format: 'pdf' | 'excel') {
    setCustomExporting(true);
    try {
      const params = {
        source: customSource,
        fields: customFields,
        filters: customFilters,
      };
      const api = format === 'pdf' ? exportReportPDF : exportReportExcel;
      const blob = await api(params);
      // Download file
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `custom-report.${format === 'pdf' ? 'pdf' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      setCustomError(err.message || 'Failed to export report');
    } finally {
      setCustomExporting(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready": return "bg-green-100 text-green-800";
      case "Generating": return "bg-yellow-100 text-yellow-800";
      case "Failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "HR Analytics": "bg-blue-100 text-blue-800",
      "Finance": "bg-green-100 text-green-800",
      "Recruitment": "bg-purple-100 text-purple-800",
      "Learning & Development": "bg-orange-100 text-orange-800",
      "Performance": "bg-indigo-100 text-indigo-800",
      "Compliance": "bg-red-100 text-red-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-8">Loading reports...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">{error}</div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
              <p className="text-muted-foreground">Generate insights and track organizational metrics</p>
            </div>
            <div className="flex space-x-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Last 7 days</SelectItem>
                  <SelectItem value="last30days">Last 30 days</SelectItem>
                  <SelectItem value="last90days">Last 90 days</SelectItem>
                  <SelectItem value="last12months">Last 12 months</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Admin/HR: All Reports & Analytics */}
          {(user?.role === "admin" || user?.role === "hr") && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="predefined">Standard Reports</TabsTrigger>
                <TabsTrigger value="custom">Custom Reports</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-6">
                {/* Example: Show hiring, turnover, payroll, diversity analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Hiring</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{reportData.hiring?.totalHires ?? '-'}</div>
                      <p className="text-xs text-muted-foreground">Recent hires</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Turnover</CardTitle>
                      <BarChart className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{reportData.turnover?.rate ?? '-'}</div>
                      <p className="text-xs text-muted-foreground">Turnover rate</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Payroll</CardTitle>
                      <PieChart className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{reportData.payroll?.totalPayroll ?? '-'}</div>
                      <p className="text-xs text-muted-foreground">Total payroll</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Diversity</CardTitle>
                      <BarChart className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">{reportData.diversity?.diversityScore ?? '-'}</div>
                      <p className="text-xs text-muted-foreground">Diversity score</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="predefined" className="space-y-4">
                {/* List all available reports from backend */}
                <div className="grid gap-4">
                  {(reportData.allReports || []).map((report: any) => (
                    <Card key={report._id || report.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <BarChart className="h-5 w-5 text-primary" />
                              <h3 className="text-lg font-semibold">{report.title || report.name}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">{report.description}</p>
                            <div className="flex items-center space-x-4">
                              <Badge>{report.type}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {report.format} • {report.size}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Last generated: {report.lastGenerated ? new Date(report.lastGenerated).toLocaleDateString() : ''}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Generate</Button>
                            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Download</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="custom" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Custom Reports</h2>
                  <Button>
                    Create Custom Report
                  </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="font-medium">Data Source</label>
                    <select value={customSource} onChange={e => {
                      setCustomSource(e.target.value);
                      setCustomFields([]);
                    }} className="w-full border rounded p-2">
                      {DATA_SOURCES.map(ds => (
                        <option key={ds.value} value={ds.value}>{ds.label}</option>
                      ))}
                    </select>
                    <label className="font-medium mt-2">Fields</label>
                    <div className="flex flex-wrap gap-2">
                      {FIELDS[customSource].map(f => (
                        <label key={f.value} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={customFields.includes(f.value)}
                            onChange={e => {
                              setCustomFields(prev =>
                                e.target.checked
                                  ? [...prev, f.value]
                                  : prev.filter(v => v !== f.value)
                              );
                            }}
                          />
                          {f.label}
                        </label>
                      ))}
                    </div>
                    <label className="font-medium mt-2">Filters</label>
                    <div className="flex gap-2 mb-2">
                      <select ref={filterFieldRef} className="border rounded p-1">
                        {FIELDS[customSource].map(f => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>
                      <input ref={filterValueRef} className="border rounded p-1" placeholder="Value" />
                      <Button size="sm" onClick={() => {
                        if (filterFieldRef.current && filterValueRef.current) {
                          setCustomFilters(prev => [...prev, { field: filterFieldRef.current!.value, value: filterValueRef.current!.value }]);
                          filterValueRef.current.value = '';
                        }
                      }}>Add</Button>
                    </div>
                    <ul className="mb-2">
                      {customFilters.map((f, i) => (
                        <li key={i} className="text-xs flex items-center gap-2">
                          <span>{FIELDS[customSource].find(ff => ff.value === f.field)?.label || f.field}: {f.value}</span>
                          <Button size="xs" variant="ghost" onClick={() => setCustomFilters(prev => prev.filter((_, idx) => idx !== i))}>Remove</Button>
                        </li>
                      ))}
                    </ul>
                    <Button onClick={runCustomReport} disabled={customLoading || customFields.length === 0}>
                      {customLoading ? 'Generating...' : 'Generate Report'}
                    </Button>
                    <Button variant="outline" onClick={() => exportCustomReport('pdf')} disabled={customExporting || customReport.length === 0} className="ml-2">
                      Export PDF
                    </Button>
                    <Button variant="outline" onClick={() => exportCustomReport('excel')} disabled={customExporting || customReport.length === 0} className="ml-2">
                      Export Excel
                    </Button>
                    {customError && <div className="text-red-600 text-sm mt-2">{customError}</div>}
                  </div>
                  <div className="flex-1">
                    <label className="font-medium">Results</label>
                    <div className="border rounded p-2 min-h-[200px] bg-gray-50 overflow-x-auto">
                      {customReport.length === 0 ? (
                        <div className="text-muted-foreground">No data</div>
                      ) : (
                        <table className="w-full text-xs">
                          <thead>
                            <tr>
                              {customFields.map(f => (
                                <th key={f} className="font-semibold text-left p-1 border-b">{FIELDS[customSource].find(ff => ff.value === f)?.label || f}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {customReport.map((row, i) => (
                              <tr key={i}>
                                {customFields.map(f => (
                                  <td key={f} className="p-1 border-b">{row[f]}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>System Activity Stats</CardTitle>
                      <CardDescription>Overview of system usage and activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <BarChart className="h-5 w-5 text-primary" />
                          <span className="font-medium">Total Users:</span> {reportData.systemStats?.totalUsers ?? '-'}
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <span className="font-medium">Active Sessions:</span> {reportData.systemStats?.activeSessions ?? '-'}
                        </div>
                        <div className="flex items-center space-x-2">
                          <PieChart className="h-5 w-5 text-primary" />
                          <span className="font-medium">Total Reports Generated:</span> {reportData.systemStats?.totalReportsGenerated ?? '-'}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span className="font-medium">Average Session Duration:</span> {reportData.systemStats?.averageSessionDuration ?? '-'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent System Activities</CardTitle>
                      <CardDescription>Recent user interactions and system events</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(reportData.recentActivities || []).map((activity: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                            <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                            <span className="text-xs text-muted-foreground">{activity.action}</span>
                            <span className="text-xs text-muted-foreground">{activity.user}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Reviews</CardTitle>
                      <CardDescription>Recent performance reviews completed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(reportData.performanceReviews || []).map((review: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                            <span className="text-sm text-muted-foreground">{review.employeeName}</span>
                            <span className="text-xs text-muted-foreground">{review.reviewDate}</span>
                            <span className="text-xs text-muted-foreground">{review.rating}/5.0</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Training Enrollments</CardTitle>
                      <CardDescription>New training courses enrolled in</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(reportData.trainingEnrollments || []).map((enrollment: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                            <span className="text-sm text-muted-foreground">{enrollment.employeeName}</span>
                            <span className="text-xs text-muted-foreground">{enrollment.courseName}</span>
                            <span className="text-xs text-muted-foreground">{enrollment.enrollmentDate}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Leave Requests</CardTitle>
                      <CardDescription>Recent leave requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(reportData.leaveRequests || []).map((leave: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                            <span className="text-sm text-muted-foreground">{leave.employeeName}</span>
                            <span className="text-xs text-muted-foreground">{leave.leaveType}</span>
                            <span className="text-xs text-muted-foreground">{leave.startDate} - {leave.endDate}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payroll Records</CardTitle>
                      <CardDescription>Recent payroll records</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(reportData.payrollRecords || []).map((record: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                            <span className="text-sm text-muted-foreground">{record.employeeName}</span>
                            <span className="text-xs text-muted-foreground">{record.month}</span>
                            <span className="text-xs text-muted-foreground">{record.totalSalary}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Manager: Team/Department Analytics */}
          {user?.role === "manager" && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="predefined">Standard Reports</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Hiring</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{reportData.hiring?.totalHires ?? '-'}</div>
                      <p className="text-xs text-muted-foreground">Recent hires</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Turnover</CardTitle>
                      <BarChart className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{reportData.turnover?.rate ?? '-'}</div>
                      <p className="text-xs text-muted-foreground">Turnover rate</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Payroll</CardTitle>
                      <PieChart className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{reportData.payroll?.totalPayroll ?? '-'}</div>
                      <p className="text-xs text-muted-foreground">Total payroll</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="predefined" className="space-y-4">
                {/* List all available reports from backend */}
                <div className="grid gap-4">
                  {(reportData.allReports || []).map((report: any) => (
                    <Card key={report._id || report.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <BarChart className="h-5 w-5 text-primary" />
                              <h3 className="text-lg font-semibold">{report.title || report.name}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">{report.description}</p>
                            <div className="flex items-center space-x-4">
                              <Badge>{report.type}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {report.format} • {report.size}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Last generated: {report.lastGenerated ? new Date(report.lastGenerated).toLocaleDateString() : ''}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Generate</Button>
                            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Download</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Employee Growth Trend</CardTitle>
                      <CardDescription>Monthly employee count over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 text-muted-foreground">
                        <LineChart className="h-12 w-12 mx-auto mb-4" />
                        <p>Interactive chart would be displayed here</p>
                        <p className="text-sm">Showing growth from 220 to 247 employees</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Turnover Analysis</CardTitle>
                      <CardDescription>Monthly turnover rates by department</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 text-muted-foreground">
                        <BarChart className="h-12 w-12 mx-auto mb-4" />
                        <p>Interactive chart would be displayed here</p>
                        <p className="text-sm">Average turnover: {reportData.turnover?.rate ?? '-'}%</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Distribution</CardTitle>
                      <CardDescription>Employee performance ratings breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 text-muted-foreground">
                        <PieChart className="h-12 w-12 mx-auto mb-4" />
                        <p>Interactive chart would be displayed here</p>
                        <p className="text-sm">Average rating: {reportData.performanceReviews?.averageRating ?? '-'}/5.0</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Compensation Analysis</CardTitle>
                      <CardDescription>Salary distribution across departments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 text-muted-foreground">
                        <BarChart className="h-12 w-12 mx-auto mb-4" />
                        <p>Interactive chart would be displayed here</p>
                        <p className="text-sm">Comprehensive salary analysis by role and department</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Employee: Personal Analytics */}
          {user?.role === "employee" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Your Analytics</h2>
              {/* Add employee-specific analytics here, e.g. performance, training, payslips */}
              <div className="text-muted-foreground">Personal analytics coming soon...</div>
            </div>
          )}

          {/* Auditor: Compliance & Audit Reports */}
          {user?.role === "auditor" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Compliance & Audit Reports</h2>
              <div className="grid gap-4">
                {(reportData.allReports || []).map((report: any) => (
                  <Card key={report._id || report.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <BarChart className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold">{report.title || report.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{report.description}</p>
                          <div className="flex items-center space-x-4">
                            <Badge>{report.type}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {report.format} • {report.size}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Last generated: {report.lastGenerated ? new Date(report.lastGenerated).toLocaleDateString() : ''}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Download</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reports;


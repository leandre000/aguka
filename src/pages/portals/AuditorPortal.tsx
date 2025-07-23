/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, FileText, BarChart, AlertTriangle, Download, Eye, Calendar } from "lucide-react";
import { AuditorPortalLayout } from "@/components/layouts/AuditorPortalLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { apiFetch, getReports, getAudits, getRiskAssessments, getPolicies, getAllEmployeeDocuments } from "@/lib/api";
import { useNavigate, useLocation } from "react-router-dom";

const AuditorPortal = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const tabFromRoute = location.pathname.endsWith("/documents")
    ? "documents"
    : location.pathname.endsWith("/compliance")
    ? "reports"
    : location.pathname.endsWith("/risk")
    ? "risks"
    : location.pathname.endsWith("/audits")
    ? "findings"
    : "reports";
  const [tab, setTab] = useState(tabFromRoute);
  // Dashboard stats
  const [auditStats, setAuditStats] = useState({
    totalReports: 0,
    complianceScore: 0,
    openFindings: 0,
    closedFindings: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dynamic tab states
  const [reports, setReports] = useState<any[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);

  const [audits, setAudits] = useState<any[]>([]);
  const [auditsLoading, setAuditsLoading] = useState(false);
  const [auditsError, setAuditsError] = useState<string | null>(null);

  const [risks, setRisks] = useState<any[]>([]);
  const [risksLoading, setRisksLoading] = useState(false);
  const [risksError, setRisksError] = useState<string | null>(null);

  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState<string | null>(null);

  const [employeeDocuments, setEmployeeDocuments] = useState<any[]>([]);
  const [employeeDocumentsLoading, setEmployeeDocumentsLoading] = useState(false);
  const [employeeDocumentsError, setEmployeeDocumentsError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      getReports(),
      getAudits(),
      getRiskAssessments(),
      getPolicies(),
      // Dashboard stats
      apiFetch("/performance-review"),
      apiFetch("/activity-log/system/recent?limit=4")
    ])
      .then(([reportsRes, auditsRes, risksRes, policiesRes, reviewsRes, activityRes]) => {
        setReports(Array.isArray(reportsRes) ? reportsRes : reportsRes.data || []);
        setAudits(Array.isArray(auditsRes) ? auditsRes : auditsRes.data || []);
        setRisks(Array.isArray(risksRes) ? risksRes : risksRes.data || []);
        setDocuments(Array.isArray(policiesRes) ? policiesRes : policiesRes.data || []);
        // Dashboard stats
        const reviews = Array.isArray(reviewsRes.data) ? reviewsRes.data : Array.isArray(reviewsRes) ? reviewsRes : [];
        const openFindings = reviews.filter(r => r.status === "Open").length;
        const closedFindings = reviews.filter(r => r.status === "Closed").length;
        const complianceScore = reviews.length > 0 ? Math.round((closedFindings / reviews.length) * 100) : 0;
        setAuditStats({
          totalReports: reportsRes.length,
          complianceScore,
          openFindings,
          closedFindings
        });
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

  // Individual tab loading/error
  useEffect(() => {
    setReportsLoading(true);
    getReports()
      .then((data) => { setReports(Array.isArray(data) ? data : data.data || []); setReportsError(null); })
      .catch(() => setReportsError(t("errors.loadReportsFailed")))
      .finally(() => setReportsLoading(false));
  }, [t]);
  useEffect(() => {
    setAuditsLoading(true);
    getAudits()
      .then((data) => { setAudits(Array.isArray(data) ? data : data.data || []); setAuditsError(null); })
      .catch(() => setAuditsError(t("errors.loadAuditsFailed")))
      .finally(() => setAuditsLoading(false));
  }, [t]);
  useEffect(() => {
    setRisksLoading(true);
    getRiskAssessments()
      .then((data) => { setRisks(Array.isArray(data) ? data : data.data || []); setRisksError(null); })
      .catch(() => setRisksError(t("errors.loadRisksFailed")))
      .finally(() => setRisksLoading(false));
  }, [t]);
  useEffect(() => {
    setDocumentsLoading(true);
    getPolicies()
      .then((data) => { setDocuments(Array.isArray(data) ? data : data.data || []); setDocumentsError(null); })
      .catch(() => setDocumentsError(t("errors.loadDocumentsFailed")))
      .finally(() => setDocumentsLoading(false));
  }, [t]);
  useEffect(() => {
    setEmployeeDocumentsLoading(true);
    getAllEmployeeDocuments()
      .then((data) => setEmployeeDocuments(Array.isArray(data.documents) ? data.documents : []))
      .catch(() => setEmployeeDocumentsError(t("errors.loadDocumentsFailed")))
      .finally(() => setEmployeeDocumentsLoading(false));
  }, [t]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Final": case "Current": case "Closed": return "bg-green-100 text-green-800";
      case "Draft": case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Open": case "Due Soon": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AuditorPortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("auditor.title")}</h1>
          <p className="text-muted-foreground">{t("auditor.subtitle")}</p>
        </div>

      {/* Audit Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("auditor.totalReports")}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : auditStats.totalReports}</div>
            <p className="text-xs text-muted-foreground">{t("auditor.availableReports")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("auditor.complianceScore")}</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{auditStats.complianceScore}%</div>
            <p className="text-xs text-muted-foreground">{t("auditor.overallCompliance")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("auditor.openFindings")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{auditStats.openFindings}</div>
            <p className="text-xs text-muted-foreground">{t("auditor.requireAttention")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("auditor.closedFindings")}</CardTitle>
            <BarChart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{auditStats.closedFindings}</div>
            <p className="text-xs text-muted-foreground">{t("auditor.thisQuarter")}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">{t("auditor.complianceReports")}</TabsTrigger>
          <TabsTrigger value="findings">{t("auditor.auditFindings")}</TabsTrigger>
          <TabsTrigger value="risks">{t("auditor.riskAssessments")}</TabsTrigger>
          <TabsTrigger value="documents">{t("auditor.documents")}</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <div className="space-y-4">
            {reportsLoading ? (
              <p>{t("common.loading")}</p>
            ) : reportsError ? (
              <p className="text-red-500">{reportsError}</p>
            ) : reports.length === 0 ? (
              <p>{t("auditor.noComplianceReports")}</p>
            ) : (
              reports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-semibold">{report.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{report.type}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>{t("auditor.score")}: <span className="font-bold text-primary">{report.score}%</span></span>
                          <span>•</span>
                          <span>{t("auditor.findings")}: {report.findings}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t("auditor.generated")}: {new Date(report.date).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            {t("common.view")}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            {t("common.download")}
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

        <TabsContent value="findings" className="space-y-4">
          <div className="space-y-4">
            {auditsLoading ? (
              <p>{t("auditor.loadingAuditFindings")}</p>
            ) : auditsError ? (
              <p className="text-red-500">{auditsError}</p>
            ) : audits.length === 0 ? (
              <p>{t("auditor.noAuditFindings")}</p>
            ) : (
              audits.map((finding) => (
                <Card key={finding.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            <h3 className="text-lg font-semibold">{finding.title}</h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getSeverityColor(finding.severity)}>
                              {finding.severity}
                            </Badge>
                            <Badge variant="outline">{finding.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{finding.description}</p>
                          <div className="text-sm">
                            <span className="font-medium">{t("auditor.department")}:</span> {finding.department}
                          </div>
                        </div>
                        
                        <Badge className={getStatusColor(finding.status)}>
                          {finding.status}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span>{t("auditor.reported")}: {new Date(finding.reportDate).toLocaleDateString()}</span>
                        <span>{t("auditor.due")}: {new Date(finding.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <div className="space-y-4">
            {risksLoading ? (
              <p>{t("auditor.loadingRiskAssessments")}</p>
            ) : risksError ? (
              <p className="text-red-500">{risksError}</p>
            ) : risks.length === 0 ? (
              <p>{t("auditor.noRiskAssessments")}</p>
            ) : (
              risks.map((risk) => (
                <Card key={risk.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{risk.area}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge className={getRiskColor(risk.riskLevel)}>
                            {t("auditor.risk")}: {risk.riskLevel}
                          </Badge>
                          <Badge className={getStatusColor(risk.status)}>
                            {risk.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>{t("auditor.lastAssessed")}: {new Date(risk.lastAssessed).toLocaleDateString()}</p>
                          <p>{t("auditor.nextAssessment")}: {new Date(risk.nextAssessment).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate("/portals/auditor/risk-assessment")}> {/* Route to interactive page */}
                        <Eye className="h-4 w-4 mr-1" />
                        {t("auditor.viewDetails")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="space-y-4">
            {employeeDocumentsLoading ? (
              <p>{t("auditor.loadingDocuments")}</p>
            ) : employeeDocumentsError ? (
              <p className="text-red-500">{employeeDocumentsError}</p>
            ) : employeeDocuments.length === 0 ? (
              <p>{t("auditor.noDocuments")}</p>
            ) : (
              employeeDocuments.map((doc, idx) => (
                <Card key={doc._id || idx}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <div className="font-semibold">{doc.type}</div>
                        <div className="text-sm text-muted-foreground">{doc.employeeName} ({doc.employeeEmail})</div>
                        {doc.expiryDate && (
                          <div className={
                            new Date(doc.expiryDate) < new Date()
                              ? "text-red-600 font-bold"
                              : "text-yellow-600"
                          }>
                            Expiry: {doc.expiryDate.slice(0, 10)}
                            {new Date(doc.expiryDate) < new Date() ? " (Expired)" : ""}
                          </div>
                        )}
                      </div>
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-auto">Download</a>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </AuditorPortalLayout>
  );
};

export default AuditorPortal;
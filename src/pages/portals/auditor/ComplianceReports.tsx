import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuditorPortalLayout } from "@/components/layouts/AuditorPortalLayout";

export default function ComplianceReports() {
  const { t } = useLanguage();

  const reports = [
    {
      id: 1,
      title: "GDPR Compliance Assessment",
      type: "Data Protection",
      status: "compliant",
      reportDate: "2024-01-15",
      nextReview: "2024-04-15",
      issues: 0,
      recommendations: 3,
    },
    {
      id: 2,
      title: "Workplace Safety Audit",
      type: "Safety",
      status: "non-compliant",
      reportDate: "2024-01-10",
      nextReview: "2024-02-10",
      issues: 5,
      recommendations: 8,
    },
    {
      id: 3,
      title: "Financial Controls Review",
      type: "Financial",
      status: "pending",
      reportDate: "2024-01-20",
      nextReview: "2024-03-20",
      issues: 2,
      recommendations: 4,
    },
    {
      id: 4,
      title: "HR Policy Compliance",
      type: "HR Policies",
      status: "compliant",
      reportDate: "2024-01-05",
      nextReview: "2024-07-05",
      issues: 0,
      recommendations: 2,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-4 w-4" />;
      case "non-compliant":
        return <AlertTriangle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "compliant":
        return "default";
      case "non-compliant":
        return "destructive";
      case "pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "compliant":
        return t("auditor.compliant");
      case "non-compliant":
        return t("auditor.nonCompliant");
      case "pending":
        return t("auditor.pending");
      default:
        return status;
    }
  };

  return (
    <AuditorPortalLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t("auditor.complianceReports")}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {t("auditor.generateAndReview")}
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <FileText className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t("auditor.generateNewReport")}</span>
            <span className="sm:hidden">{t("auditor.newReport")}</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t("auditor.filterByType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("auditor.allTypes")}</SelectItem>
              <SelectItem value="financial">{t("auditor.financial")}</SelectItem>
              <SelectItem value="safety">{t("auditor.safety")}</SelectItem>
              <SelectItem value="data-protection">
                {t("auditor.dataProtection")}
              </SelectItem>
              <SelectItem value="hr">{t("auditor.hrPolicies")}</SelectItem>
              <SelectItem value="environmental">{t("auditor.environmental")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader className="pb-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg break-words">
                      {report.title}
                    </CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge variant="outline">{report.type}</Badge>
                    </CardDescription>
                  </div>
                  <Badge
                    variant={getStatusVariant(report.status)}
                    className="flex items-center gap-1 w-fit"
                  >
                    {getStatusIcon(report.status)}
                    <span className="hidden sm:inline">
                      {getStatusLabel(report.status)}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium">{t("auditor.reportDate")}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.reportDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("auditor.nextReview")}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.nextReview}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("auditor.issues")}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.issues}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("auditor.recommendations")}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.recommendations}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">{t("auditor.viewReport")}</span>
                    <span className="sm:hidden">{t("common.view")}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">{t("common.download")}</span>
                    <span className="sm:hidden">{t("common.download")}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AuditorPortalLayout>
  );
}

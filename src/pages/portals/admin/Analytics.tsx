/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminPortalLayout } from "@/components/layouts/AdminPortalLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  BarChart,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getUsers, getPayrolls, getLeaves } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const translations = {
  en: {
    analytics: "Analytics",
    dashboardsDesc: "Interactive HR dashboards and workforce insights",
    totalEmployees: "Total Employees",
    totalEmployeesChange: "+8% from last month",
    avgSalary: "Avg. Salary",
    avgSalaryChange: "+2.5% vs last year",
    turnoverRate: "Turnover Rate",
    turnoverRateChange: "-1.2% improvement",
    productivity: "Productivity",
    productivityChange: "Above target",
    departmentDistribution: "Department Distribution",
    departmentDesc: "Employee count by department",
    engineering: "Engineering",
    sales: "Sales",
    marketing: "Marketing",
    hr: "HR",
    hiringTrends: "Hiring Trends",
    hiringDesc: "Monthly hiring statistics",
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    trainingEffectiveness: "Training Effectiveness",
    trainingDesc: "Training completion rates and performance improvements",
    completionRate: "Completion Rate",
    avgRating: "Avg. Rating",
    performanceBoost: "Performance Boost",
    diversityInclusion: "Diversity & Inclusion Statistics",
    diversityDesc: "Workplace diversity metrics and inclusion indicators",
    genderDistribution: "Gender Distribution",
    female: "Female",
    male: "Male",
    other: "Other",
    ageGroups: "Age Groups",
    age20_30: "20-30",
    age31_40: "31-40",
    age41_50: "41-50",
    age50plus: "50+",
  },
  fr: {
    analytics: "Analytique",
    dashboardsDesc: "Tableaux de bord RH interactifs et analyses du personnel",
    totalEmployees: "Nombre total d'employés",
    totalEmployeesChange: "+8% par rapport au mois dernier",
    avgSalary: "Salaire moyen",
    avgSalaryChange: "+2,5% vs l'année dernière",
    turnoverRate: "Taux de rotation",
    turnoverRateChange: "-1,2% d'amélioration",
    productivity: "Productivité",
    productivityChange: "Au-dessus de l'objectif",
    departmentDistribution: "Répartition par département",
    departmentDesc: "Nombre d'employés par département",
    engineering: "Ingénierie",
    sales: "Ventes",
    marketing: "Marketing",
    hr: "RH",
    hiringTrends: "Tendances de recrutement",
    hiringDesc: "Statistiques mensuelles de recrutement",
    january: "Janvier",
    february: "Février",
    march: "Mars",
    april: "Avril",
    trainingEffectiveness: "Efficacité de la formation",
    trainingDesc: "Taux d'achèvement et amélioration des performances",
    completionRate: "Taux d'achèvement",
    avgRating: "Note moyenne",
    performanceBoost: "Amélioration des performances",
    diversityInclusion: "Statistiques diversité & inclusion",
    diversityDesc: "Indicateurs de diversité et d'inclusion au travail",
    genderDistribution: "Répartition par genre",
    female: "Femme",
    male: "Homme",
    other: "Autre",
    ageGroups: "Tranches d'âge",
    age20_30: "20-30",
    age31_40: "31-40",
    age41_50: "41-50",
    age50plus: "50+",
  },
};

const Analytics = () => {
  const { language } = useLanguage();
  const t = (key: keyof (typeof translations)["en"]) =>
    translations[language][key];
  const navigate = useNavigate();

  // Dynamic states
  const [users, setUsers] = useState<any[]>([]);
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);

  useEffect(() => {
    getUsers().then((res: any) => {
      setUsers(res.data || []);
    });

    getPayrolls().then((res: any) => {
      setPayrolls(res.data || []);
    });

    getLeaves().then((res: any) => {
      setLeaves(res.data || []);
    });
  }, []);

  // Calculations
  const totalUsers = users.length;
  const totalPayrolls = payrolls.length;
  const totalNetPay = payrolls.reduce((sum: number, p: any) => sum + (p.netPay || 0), 0);
  const avgNetPay = totalPayrolls > 0 ? Math.round(totalNetPay / totalPayrolls) : 0;
  const totalBonuses = payrolls.reduce((sum: number, p: any) => sum + (p.bonus || 0), 0);
  const totalDeductions = payrolls.reduce((sum: number, p: any) => sum + (p.deductions || 0), 0);
  const totalTax = payrolls.reduce((sum: number, p: any) => sum + (p.tax || 0), 0);

  const turnoverRate =
    leaves.length > 0
      ? (
          (leaves.filter((l: any) => l.type === "Resignation" || l.type === "Termination").length /
            totalUsers) *
          100
        ).toFixed(1)
      : "0";

  return (
    <AdminPortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("analytics")}
          </h1>
          <p className="text-muted-foreground">{t("dashboardsDesc")}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("totalEmployees")}
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {t("totalEmployeesChange")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Net Pay
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {avgNetPay ? `$${avgNetPay}` : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                Average net pay per payroll record
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("turnoverRate")}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{turnoverRate}%</div>
              <p className="text-xs text-muted-foreground">
                {t("turnoverRateChange")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Payrolls
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPayrolls}</div>
              <p className="text-xs text-muted-foreground">
                Payroll records processed
              </p>
            </CardContent>
          </Card>
        </div>
        {/* Succession Planning Card */}
        <Card>
          <CardHeader>
            <CardTitle>Succession Planning</CardTitle>
            <CardDescription>Manage and analyze succession plans</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/admin-portal/succession-planning')}>
              Manage Succession Plans
            </Button>
          </CardContent>
        </Card>

        {/* Payroll Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payroll Records</CardTitle>
            <CardDescription>
              Detailed payroll information for recent periods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-left">Employee</th>
                    <th className="px-2 py-1 text-left">Position</th>
                    <th className="px-2 py-1 text-left">Base Salary</th>
                    <th className="px-2 py-1 text-left">Bonus</th>
                    <th className="px-2 py-1 text-left">Overtime</th>
                    <th className="px-2 py-1 text-left">Deductions</th>
                    <th className="px-2 py-1 text-left">Tax</th>
                    <th className="px-2 py-1 text-left">Net Pay</th>
                    <th className="px-2 py-1 text-left">Period</th>
                    <th className="px-2 py-1 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payrolls.length === 0 && (
                    <tr>
                      <td colSpan={10} className="text-center py-4 text-muted-foreground">
                        No payroll records found.
                      </td>
                    </tr>
                  )}
                  {payrolls.map((p: any) => (
                    <tr key={p._id}>
                      <td className="px-2 py-1">{p.employee?.position || "-"}</td>
                      <td className="px-2 py-1">{p.employee?.position || "-"}</td>
                      <td className="px-2 py-1">${p.baseSalary}</td>
                      <td className="px-2 py-1">${p.bonus}</td>
                      <td className="px-2 py-1">${p.overtime}</td>
                      <td className="px-2 py-1">${p.deductions}</td>
                      <td className="px-2 py-1">${p.tax}</td>
                      <td className="px-2 py-1 font-semibold">${p.netPay}</td>
                      <td className="px-2 py-1">{p.period}</td>
                      <td className="px-2 py-1">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPortalLayout>
  );
};

export default Analytics;

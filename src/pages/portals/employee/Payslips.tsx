/* eslint-disable @typescript-eslint/no-explicit-any */

import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Search, Calendar, DollarSign, FileText } from "lucide-react";
import { EmployeePortalLayout } from "@/components/layouts/EmployeePortalLayout";
import { getMyPayroll } from "@/lib/api";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const translations = {
  en: {
    title: "Payslips",
    baseSalary: "Base Salary",
    netPay: "Net Pay",
    payPeriod: "Pay Period",
    bonus: "Bonus",
    yearToDate: "Year-to-Date Earnings",
    loading: "Loading payslips...",
    error: "Failed to load payslips",
    noStubs: "No payslips found.",
    noStubsDesc: "You have no payslips for this period.",
    download: "Download",
    actions: "Actions",
    status: "Status",
    paid: "Paid",
    pending: "Pending",
    rejected: "Rejected",
    completed: "Completed",
    cancelled: "Cancelled",
    search: "Search by pay period...",
    retry: "Retry",
    history: "History",
  },
  fr: {
    title: "Bulletins de paie",
    baseSalary: "Salaire de base",
    netPay: "Salaire net",
    payPeriod: "Période de paie",
    bonus: "Prime",
    yearToDate: "Gains cumulés annuels",
    loading: "Chargement des bulletins de paie...",
    error: "Échec du chargement des bulletins de paie",
    noStubs: "Aucun bulletin de paie trouvé.",
    noStubsDesc: "Vous n'avez aucun bulletin de paie pour cette période.",
    download: "Télécharger",
    actions: "Actions",
    status: "Statut",
    paid: "Payé",
    pending: "En attente",
    rejected: "Rejeté",
    completed: "Terminé",
    cancelled: "Annulé",
    search: "Rechercher par période de paie...",
    retry: "Réessayer",
    history: "Historique",
  },
};

export default function Payslips() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // State for payslips data
  const [payslips, setPayslips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch payslips data
  useEffect(() => {
    const fetchPayslips = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getMyPayroll();
        const payrollData = response?.data || response;
        const stubs = Array.isArray(payrollData) ? payrollData : [];
        setPayslips(stubs);
      } catch (err: any) {
        console.error('Error fetching payslips:', err);
        setError("Failed to load payslips");
        setPayslips([]);
        toast({
          title: "Error",
          description: "Failed to load payslips",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayslips();
  }, [toast]);

  // Calculate summary statistics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthPayslip = payslips.find(stub => {
    const stubDate = new Date(stub.createdAt || stub.payDate);
    return stubDate.getMonth() === currentMonth && stubDate.getFullYear() === currentYear;
  });

  const yearToDateEarnings = payslips
    .filter(stub => {
      const stubDate = new Date(stub.createdAt || stub.payDate);
      return stubDate.getFullYear() === currentYear;
    })
    .reduce((total, stub) => total + (stub.netPay || 0), 0);

  // Filter payslips based on search term
  const filteredPayslips = payslips.filter(payslip => {
    const period = payslip.period || `Pay Period ${payslip._id ? payslip._id.slice(-6) : 'N/A'}`;
    return period.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid": case "completed": return "bg-green-100 text-green-800";
      case "pending": case "in progress": return "bg-yellow-100 text-yellow-800";
      case "rejected": case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Handle download
  const handleDownload = (payslip: any) => {
    // TODO: Implement actual download functionality
    toast({
      title: "Download",
      description: `Downloading payslip for ${payslip.period || 'Pay Period'}`,
    });
  };

  return (
    <EmployeePortalLayout>
      <div className="space-y-4 md:space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">{t("employee.payroll.title")}</h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-20 bg-muted animate-pulse rounded mb-2"></div>
                  <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("employee.payroll.baseSalary")} ({t("employee.payroll.payPeriod")})
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  ${currentMonthPayslip?.baseSalary?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground">{t("employee.payroll.baseSalary")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("employee.payroll.netPay")} ({t("employee.payroll.payPeriod")})
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  ${currentMonthPayslip?.netPay?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground">{t("employee.payroll.netPay")}</p>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Year-to-Date Earnings
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  ${yearToDateEarnings.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Year to Date</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payslips Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg md:text-xl">{t("employee.payroll.title")} History</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by pay period..."
                    className="pl-8 w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">{t("employee.payroll.loading")}</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            ) : filteredPayslips.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">{t("employee.payroll.noStubs")}</p>
                <p className="text-sm text-muted-foreground">{t("employee.payroll.noStubsDesc")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">{t("employee.payroll.payPeriod")}</TableHead>
                      <TableHead className="min-w-[100px]">{t("employee.payroll.baseSalary")}</TableHead>
                      <TableHead className="min-w-[100px]">{t("employee.payroll.bonus")}</TableHead>
                      <TableHead className="min-w-[100px]">{t("employee.payroll.netPay")}</TableHead>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="text-right min-w-[120px]">
                        {t("common.actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayslips.map((payslip) => (
                      <TableRow key={payslip._id || payslip.id}>
                        <TableCell className="font-medium">
                          {payslip.period || `${t("employee.payroll.payPeriod")} ${payslip._id ? payslip._id.slice(-6) : 'N/A'}`}
                        </TableCell>
                        <TableCell>${payslip.baseSalary?.toLocaleString() || '0'}</TableCell>
                        <TableCell>${payslip.bonus?.toLocaleString() || '0'}</TableCell>
                        <TableCell>${payslip.netPay?.toLocaleString() || '0'}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(payslip.status)}>
                            {payslip.status || 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs"
                            onClick={() => handleDownload(payslip)}
                          >
                            <Download className="h-3 w-3 mr-1 md:mr-2" />
                            <span className="hidden sm:inline">{t("employee.payroll.download")}</span>
                            <span className="sm:hidden">DL</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EmployeePortalLayout>
  );
}

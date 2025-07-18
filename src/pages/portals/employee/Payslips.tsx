
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
import { Download, Search, Calendar, DollarSign } from "lucide-react";
import { EmployeePortalLayout } from "@/components/layouts/EmployeePortalLayout";

export default function Payslips() {
  const { t } = useLanguage();

  const payslips = [
    { id: 1, period: "2024-01", grossPay: 5000, netPay: 3800, status: "paid" },
    { id: 2, period: "2023-12", grossPay: 5000, netPay: 3800, status: "paid" },
    { id: 3, period: "2023-11", grossPay: 5000, netPay: 3800, status: "paid" },
    { id: 4, period: "2023-10", grossPay: 5000, netPay: 3800, status: "paid" },
  ];

  return (
    <EmployeePortalLayout>
      <div className="space-y-4 md:space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Payslips</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Gross Pay (Current Month)
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">$5,000</div>
              <p className="text-xs text-muted-foreground">Before Deductions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Net Pay (Current Month)
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">$3,800</div>
              <p className="text-xs text-muted-foreground">After Deductions</p>
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
              <div className="text-xl md:text-2xl font-bold">$45,600</div>
              <p className="text-xs text-muted-foreground">Year to Date</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg md:text-xl">Payslip History</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by pay period..."
                    className="pl-8 w-full sm:w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px]">Pay Period</TableHead>
                    <TableHead className="min-w-[100px]">Gross Pay</TableHead>
                    <TableHead className="min-w-[100px]">Net Pay</TableHead>
                    <TableHead className="min-w-[80px]">Status</TableHead>
                    <TableHead className="text-right min-w-[120px]">
                      {t("common.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payslips.map((payslip) => (
                    <TableRow key={payslip.id}>
                      <TableCell className="font-medium">
                        {payslip.period}
                      </TableCell>
                      <TableCell>${payslip.grossPay.toLocaleString()}</TableCell>
                      <TableCell>${payslip.netPay.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {payslip.status.charAt(0).toUpperCase() +
                            payslip.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="text-xs">
                          <Download className="h-3 w-3 mr-1 md:mr-2" />
                          <span className="hidden sm:inline">Download</span>
                          <span className="sm:hidden">DL</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </EmployeePortalLayout>
  );
}

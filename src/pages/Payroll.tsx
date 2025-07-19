/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { DollarSign, Download, Calendar, Search, Plus, FileText, Trash2, Edit2, Send } from "lucide-react";
import { getPayrolls, addPayroll, updatePayroll, deletePayroll, disbursePayroll, getPayslips } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

const defaultForm = {
  employee: "",
  baseSalary: "",
  bonus: "",
  overtime: "",
  deductions: "",
  tax: "",
  netPay: "",
  period: "",
};

const Payroll = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<any>(defaultForm);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editId, setEditId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [payslips, setPayslips] = useState<any[]>([]);
  const isAdminOrManager = user?.role === "admin" || user?.role === "manager";
  const isEmployee = user?.role === "employee";

  // Fetch payrolls
  const fetchPayrolls = () => {
    setLoading(true);
    getPayrolls()
      .then(res => setPayrolls(res.data))
      .catch(err => setError(err.message || "Failed to load payroll records"))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    if (isAdminOrManager) fetchPayrolls();
  }, [isAdminOrManager]);

  // Fetch payslips for employee
  useEffect(() => {
    if (isEmployee && user?._id) {
      setLoading(true);
      getPayslips(user._id)
        .then(res => setPayslips(res.data))
        .catch(err => setError(err.message || "Failed to load payslips"))
        .finally(() => setLoading(false));
    }
  }, [isEmployee, user]);

  // Filtered payrolls
  const filteredRecords = payrolls.filter(record => {
    const emp = record.employee?.user?.Names || "";
    const empId = record.employee?._id || "";
    const dept = record.employee?.user?.department || "";
    return (
      emp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processed": case "Paid": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Open add/edit modal
  const openAdd = () => {
    setForm(defaultForm);
    setFormMode("add");
    setEditId(null);
    setFormError(null);
    setShowModal(true);
  };
  const openEdit = (rec: any) => {
    setForm({
      employee: rec.employee?._id || "",
      baseSalary: rec.baseSalary,
      bonus: rec.bonus,
      overtime: rec.overtime,
      deductions: rec.deductions,
      tax: rec.tax,
      netPay: rec.netPay,
      period: rec.period,
    });
    setFormMode("edit");
    setEditId(rec._id);
    setFormError(null);
    setShowModal(true);
  };

  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  // Submit add/edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      if (formMode === "add") {
        await addPayroll(form);
        toast({ title: "Payroll added", description: "The payroll record was added successfully." });
      } else if (formMode === "edit" && editId) {
        await updatePayroll(editId, form);
        toast({ title: "Payroll updated", description: "The payroll record was updated successfully." });
      }
      setShowModal(false);
      fetchPayrolls();
    } catch (err: any) {
      let errorMsg = "Operation failed";
      if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.message) {
        errorMsg = err.message;
      }
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete payroll
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this payroll record?")) return;
    try {
      await deletePayroll(id);
      fetchPayrolls();
      toast({ title: "Payroll deleted", description: "The payroll record was deleted successfully." });
    } catch (err: any) {
      let errorMsg = "Operation failed";
      if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.message) {
        errorMsg = err.message;
      }
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
    }
  };

  // Disburse payroll
  const handleDisburse = async (id: string) => {
    if (!window.confirm("Disburse payroll for this record?")) return;
    try {
      await disbursePayroll(id);
      fetchPayrolls();
      toast({ title: "Payroll disbursed", description: "The payroll was disbursed successfully." });
    } catch (err: any) {
      let errorMsg = "Operation failed";
      if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.message) {
        errorMsg = err.message;
      }
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payroll</h1>
          <p className="text-muted-foreground">Manage employee compensation and benefits</p>
        </div>
        {isAdminOrManager && (
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Run Payroll
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
          {isAdminOrManager && <TabsTrigger value="records">Payroll Records</TabsTrigger>}
          {isEmployee && <TabsTrigger value="payslips">My Payslips</TabsTrigger>}
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="text-center text-muted-foreground">Payroll summary and analytics coming soon.</div>
        </TabsContent>

        {isAdminOrManager && (
          <TabsContent value="records" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search payroll records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>
            {loading ? (
              <div className="text-center py-8">Loading payroll records...</div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">{error}</div>
            ) : (
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <Card key={record._id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold">{record.employee?.user?.Names}</h3>
                            <Badge variant="outline">{record.employee?._id}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{record.employee?.user?.department} • {record.period}</p>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Base Salary</span>
                              <p className="text-muted-foreground">${record.baseSalary?.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="font-medium">Overtime</span>
                              <p className="text-muted-foreground">${record.overtime?.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="font-medium">Bonuses</span>
                              <p className="text-muted-foreground">${record.bonus?.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="font-medium">Deductions</span>
                              <p className="text-muted-foreground">-${record.deductions?.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="font-medium">Net Pay</span>
                              <p className="text-lg font-bold text-primary">${record.netPay?.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => openEdit(record)}>
                              <Edit2 className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(record._id)}>
                              <Trash2 className="h-4 w-4 mr-1 text-red-500" />
                              Delete
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDisburse(record._id)}>
                              <Send className="h-4 w-4 mr-1 text-green-500" />
                              Disburse
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        )}

        {isEmployee && (
          <TabsContent value="payslips" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading payslips...</div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">{error}</div>
            ) : (
              <div className="space-y-4">
                {payslips.map((record) => (
                  <Card key={record._id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold">{user.Names}</h3>
                            <Badge variant="outline">{user._id}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{user.department} • {record.period}</p>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Base Salary</span>
                              <p className="text-muted-foreground">${record.baseSalary?.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="font-medium">Overtime</span>
                              <p className="text-muted-foreground">${record.overtime?.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="font-medium">Bonuses</span>
                              <p className="text-muted-foreground">${record.bonus?.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="font-medium">Deductions</span>
                              <p className="text-muted-foreground">-${record.deductions?.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="font-medium">Net Pay</span>
                              <p className="text-lg font-bold text-primary">${record.netPay?.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
      {/* Add/Edit Modal (for admin/manager) can be implemented here if needed */}
    </div>
  );
};

export default Payroll;
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
import {
  getContracts,
  createContract,
  deleteContract,
  getEmployees,
  uploadContractFile,
  getUser,
} from "@/lib/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { AdminPortalLayout } from "@/components/layouts/AdminPortalLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/components/ui/use-toast";

export default function ContractsManagement() {
  const { t } = useLanguage();
  const [contracts, setContracts] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    employee: "",
    contractType: "Permanent",
    startDate: "",
    endDate: "",
    terms: "",
    file: null as File | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // Filtered and paginated contracts
  const filteredContracts = useMemo(() => {
    const lower = search.toLowerCase();
    return contracts.filter((c: any) => {
      const empName = c.employee && c.employee.user ? c.employee.user.Names : "";
      return (
        empName.toLowerCase().includes(lower) ||
        (c.contractType || "").toLowerCase().includes(lower) ||
        (c.status || "").toLowerCase().includes(lower)
      );
    });
  }, [contracts, search]);

  const paginatedContracts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredContracts.slice(start, start + PAGE_SIZE);
  }, [filteredContracts, page]);

  const totalPages = Math.ceil(filteredContracts.length / PAGE_SIZE) || 1;

  // Fetch contracts and users
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getContracts(),
      getEmployees(),
    ])
      .then(([contractsRes, employeesRes]) => {
        setContracts(contractsRes.data || contractsRes);
        // Only employees (not managers, etc.)
        setEmployees((employeesRes.data || employeesRes));
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Failed to load data");
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle contract creation
  const handleCreate = async () => {
    if (!form.employee || !form.contractType || !form.startDate) {
      toast({ title: t("common.error"), description: t("common.allFieldsRequired") || "All fields required", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      let fileUrl = "";
      if (form.file) {
        const formData = new FormData();
        formData.append("file", form.file);
        const result = await uploadContractFile(formData);
        fileUrl = result.url;
      }
      await createContract({
        employee: form.employee,
        contractType: form.contractType,
        startDate: form.startDate,
        endDate: form.endDate,
        terms: form.terms,
        fileUrl,
      });
      toast({ title: t("admin.addContract") + " " + t("common.success") || "Contract added" });
      setOpen(false);
      setForm({ employee: "", contractType: "Permanent", startDate: "", endDate: "", terms: "", file: null });
      setLoading(true);
      getContracts()
        .then((res) => setContracts(res.data || res))
        .finally(() => setLoading(false));
    } catch (err: any) {
      toast({ title: t("common.error"), description: err.message || "Failed to create contract", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle contract deletion
  const handleDelete = async (id: string) => {
    if (!window.confirm(t("admin.delete") + "?")) return;
    setLoading(true);
    try {
      await deleteContract(id);
      toast({ title: t("admin.delete") + " " + t("common.success") || "Deleted" });
      setContracts((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      toast({ title: t("common.error"), description: err.message || "Failed to delete contract", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  function getEmployeeName(employeeId: string | any) {
    // Handle case where employeeId might be an object
    if (typeof employeeId === 'object' && employeeId !== null) {
      if (employeeId.user && employeeId.user.Names) {
        return employeeId.user.Names;
      }
      if (employeeId.id) {
        employeeId = employeeId.id;
      } else {
        return 'Unknown Employee';
      }
    }
    
    // Now employeeId should be a string
    const emp = employees.find((e: any) => e.id === employeeId);
    return emp && emp.user ? emp.user.Names : (employeeId || 'Unknown Employee');
  }

  return (
    <AdminPortalLayout>
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t("admin.manageContracts") || "Manage Contracts"}</h1>
          <Button onClick={() => setOpen(true)}>{t("admin.addContract") || "Add Contract"}</Button>
        </div>
        {error && <div className="text-red-600 text-center">{error}</div>}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.contractsList") || "Contracts List"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <Input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder={t("common.search") || "Search..."}
                  className="max-w-xs"
                />
              </div>
              <div className="overflow-x-auto">
                {filteredContracts.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12 text-lg">
                    {t("admin.noContracts") || "No contracts for now."}
                  </div>
                ) : (
                  <table className="min-w-full text-sm border">
                    <thead>
                      <tr>
                        <th className="px-2 py-2 border-b">{t("admin.selectEmployee") || "Employee"}</th>
                        <th className="px-2 py-2 border-b">{t("admin.contractType") || "Type"}</th>
                        <th className="px-2 py-2 border-b">{t("common.startDate") || "Start"}</th>
                        <th className="px-2 py-2 border-b">{t("common.endDate") || "End"}</th>
                        <th className="px-2 py-2 border-b">{t("admin.terms") || "Terms"}</th>
                        <th className="px-2 py-2 border-b">{t("common.status") || "Status"}</th>
                        <th className="px-2 py-2 border-b">{t("common.file") || "File"}</th>
                        <th className="px-2 py-2 border-b">{t("common.actions") || "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedContracts.map((c: any) => (
                        <tr key={c.id}>
                                                     <td className="px-2 py-2 border-b">
                             {getEmployeeName(c.employee)}
                           </td>
                          <td className="px-2 py-2 border-b">{c.contractType}</td>
                          <td className="px-2 py-2 border-b">{c.startDate?.slice(0, 10)}</td>
                          <td className="px-2 py-2 border-b">{c.endDate?.slice(0, 10)}</td>
                          <td className="px-2 py-2 border-b">{c.terms}</td>
                          <td className="px-2 py-2 border-b">{c.status}</td>
                          <td className="px-2 py-2 border-b">
                            {c.fileUrl ? (
                              <a
                                href={c.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                {t("common.view") || "View"}
                              </a>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="px-2 py-2 border-b">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(c.id)}
                            >
                              {t("admin.delete") || "Delete"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              {/* Pagination controls */}
              {filteredContracts.length > PAGE_SIZE && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    {t("common.prev") || "Prev"}
                  </Button>
                  <span>
                    {t("common.page") || "Page"} {page} {t("common.of") || "of"} {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    {t("common.next") || "Next"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("admin.addContract") || "Add Contract"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Select
                value={form.employee}
                onValueChange={(v) => setForm((f) => ({ ...f, employee: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.selectEmployee") || "Select Employee"} />
                </SelectTrigger>
                <SelectContent>
                  {employees
                    .filter((emp: any) => emp.user) // Only show employees with a linked user
                    .map((emp: any) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.user?.Names || emp.id} {/* Show name, fallback to id */}
                        {emp.position ? ` (${emp.position})` : ""}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Select
                value={form.contractType}
                onValueChange={(v) => setForm((f) => ({ ...f, contractType: v }))}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("admin.contractType") || "Contract Type"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Permanent">Permanent</SelectItem>
                  <SelectItem value="Temporary">Temporary</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Consultant">Consultant</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startDate: e.target.value }))
                }
                placeholder={t("common.startDate") || "Start Date"}
              />
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, endDate: e.target.value }))
                }
                placeholder={t("common.endDate") || "End Date"}
              />
              <Input
                value={form.terms}
                onChange={(e) =>
                  setForm((f) => ({ ...f, terms: e.target.value }))
                }
                placeholder={t("admin.terms") || "Terms"}
              />
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setForm((f) => ({ ...f, file: e.target.files?.[0] || null }))
                }
              />
              <Button onClick={handleCreate} disabled={submitting}>
                {submitting
                  ? t("common.submitting") || "Submitting..."
                  : t("admin.save") || "Save"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminPortalLayout>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Plus, Clock, CheckCircle, XCircle } from "lucide-react";
import { EmployeePortalLayout } from "@/components/layouts/EmployeePortalLayout";
import React, { useEffect, useState } from "react";
import { getMyLeaves, requestLeave } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteLeave } from "@/lib/api";

const LEAVE_TYPES = [
  { value: "vacation", label: "Vacation" },
  { value: "sick", label: "Sick Leave" },
  { value: "personal", label: "Personal Leave" },
  { value: "maternity", label: "Maternity Leave" },
];

export default function LeaveRequests() {
  const { t } = useLanguage();
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    type: "vacation",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch leave requests
  const fetchLeaves = () => {
    setLoading(true);
    getMyLeaves()
      .then(res => setLeaveRequests(res.data))
      .catch(err => setError(err.message || "Failed to load leave requests"))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchLeaves(); }, []);

  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const handleTypeChange = (value: string) => {
    setForm(prev => ({ ...prev, type: value }));
  };

  // Submit leave request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      if (!form.type || !form.startDate || !form.endDate || !form.reason) {
        setFormError(t("allFieldsRequired"));
        setSubmitting(false);
        return;
      }
      await requestLeave(form);
      setShowModal(false);
      setForm({ type: "vacation", startDate: "", endDate: "", reason: "" });
      fetchLeaves();
      toast({ title: t("leaveRequested") });
    } catch (err: any) {
      setFormError(err.message || t("failedToSave"));
      toast({ title: t("error"), description: err.message || t("failedToSave"), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate days for each leave request
  const getDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    return Math.floor((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  // Dummy leave balance (could be fetched from backend in the future)
  const leaveBalance = {
    vacation: { used: 10, total: 25 },
    sick: { used: 3, total: 15 },
    personal: { used: 2, total: 5 },
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteLeave(deleteId);
      fetchLeaves();
      toast({ title: t("leaveDeleted") });
    } catch (err: any) {
      toast({ title: t("error"), description: err.message || t("failedToSave"), variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <EmployeePortalLayout>
      <div className="space-y-4 md:space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Leave Requests</h1>
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Request Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-4 sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>New Leave Request</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="leaveType">Leave Type</Label>
                  <Select value={form.type} onValueChange={handleTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Leave Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAVE_TYPES.map((lt) => (
                        <SelectItem key={lt.value} value={lt.value}>{lt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" name="startDate" type="date" value={form.startDate} onChange={handleFormChange} required />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" name="endDate" type="date" value={form.endDate} onChange={handleFormChange} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea id="reason" name="reason" value={form.reason} onChange={handleFormChange} placeholder="Describe your reason for leave" required />
                </div>
                {formError && <div className="text-red-600 text-sm text-center">{formError}</div>}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setShowModal(false)}>{t("common.cancel")}</Button>
                  <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>{submitting ? "Submitting..." : "Submit Request"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Vacation Days
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {leaveBalance.vacation.total - leaveBalance.vacation.used}
              </div>
              <p className="text-xs text-muted-foreground">
                Out of {leaveBalance.vacation.total} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sick Days</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {leaveBalance.sick.total - leaveBalance.sick.used}
              </div>
              <p className="text-xs text-muted-foreground">
                Out of {leaveBalance.sick.total} days
              </p>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Personal Days
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {leaveBalance.personal.total - leaveBalance.personal.used}
              </div>
              <p className="text-xs text-muted-foreground">
                Out of {leaveBalance.personal.total} days
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Leave History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading leave requests...</div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">Type</TableHead>
                      <TableHead className="min-w-[100px]">Start Date</TableHead>
                      <TableHead className="min-w-[100px]">End Date</TableHead>
                      <TableHead className="min-w-[60px]">Days</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell className="capitalize">
                          {LEAVE_TYPES.find(lt => lt.value === request.type)?.label || request.type}
                        </TableCell>
                        <TableCell>{request.startDate?.slice(0, 10)}</TableCell>
                        <TableCell>{request.endDate?.slice(0, 10)}</TableCell>
                        <TableCell>{getDays(request.startDate, request.endDate)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              request.status === "Approved"
                                ? "default"
                                : request.status === "Pending"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {request.status === "Approved" && (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            )}
                            {request.status === "Rejected" && (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {request.status === "Pending" && (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {request.status?.charAt(0).toUpperCase() + request.status?.slice(1).toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {request.reason}
                        </TableCell>
                        <TableCell>
                          <Button variant="destructive" onClick={() => setDeleteId(request._id)}>{t("delete")}</Button>
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
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteLeaveTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteLeaveDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t("delete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </EmployeePortalLayout>
  );
}

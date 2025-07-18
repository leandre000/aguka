import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { ManagerPortalLayout } from "@/components/layouts/ManagerPortalLayout";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

export default function LeaveApprovals() {
  const { user, isAuthenticated } = useAuth();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Only managers can access
  if (!isAuthenticated || user?.role !== "manager") {
    return <div className="p-8 text-center text-red-600">Access denied. Managers only.</div>;
  }

  const fetchLeaves = () => {
    setLoading(true);
    axios.get("/leave")
      .then(res => {
        setLeaves((res.data?.data || []).filter((l: any) => l.status === "Pending"));
      })
      .catch(err => setError(err.message || "Failed to load leave requests"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleApprove = async (leaveId: string) => {
    setActionLoading(true);
    try {
      await axios.put(`/leave/${leaveId}/approve`);
      toast({ title: "Leave approved" });
      setModalOpen(false);
      fetchLeaves();
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || err.message || "Failed to approve leave", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (leaveId: string) => {
    setActionLoading(true);
    try {
      await axios.put(`/leave/${leaveId}/reject`);
      toast({ title: "Leave rejected" });
      setModalOpen(false);
      fetchLeaves();
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || err.message || "Failed to reject leave", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <ManagerPortalLayout>
      <div className="space-y-6 p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold">Leave Approvals</h1>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading leave requests...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : leaves.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No pending leave requests.</div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Pending Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves.map((leave: any) => (
                    <TableRow key={leave._id}>
                      <TableCell>{leave.employee?.Names || "-"}</TableCell>
                      <TableCell>{leave.employee?.Email || "-"}</TableCell>
                      <TableCell>{leave.type}</TableCell>
                      <TableCell>{leave.startDate?.slice(0, 10)}</TableCell>
                      <TableCell>{leave.endDate?.slice(0, 10)}</TableCell>
                      <TableCell>{leave.reason}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => { setSelectedLeave(leave); setModalOpen(true); }}>View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Leave Details Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Leave Details</DialogTitle>
            </DialogHeader>
            {selectedLeave && (
              <div className="space-y-2">
                <div><strong>Name:</strong> {selectedLeave.employee?.Names}</div>
                <div><strong>Email:</strong> {selectedLeave.employee?.Email}</div>
                <div><strong>Type:</strong> {selectedLeave.type}</div>
                <div><strong>Start Date:</strong> {selectedLeave.startDate?.slice(0, 10)}</div>
                <div><strong>End Date:</strong> {selectedLeave.endDate?.slice(0, 10)}</div>
                <div><strong>Reason:</strong> {selectedLeave.reason}</div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={actionLoading}>Close</Button>
              <Button variant="destructive" onClick={() => handleReject(selectedLeave._id)} disabled={actionLoading}>Reject</Button>
              <Button onClick={() => handleApprove(selectedLeave._id)} disabled={actionLoading}>Approve</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ManagerPortalLayout>
  );
} 
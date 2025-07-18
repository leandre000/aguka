/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Filter, MoreHorizontal, Mail, Phone, Trash2, Edit2 } from "lucide-react";
import { getEmployees, addEmployee, updateEmployee, deleteEmployee, getUsers, getEmployeeDocuments, uploadEmployeeDocuments } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

const GENDERS = ["Male", "Female", "Other"];

const defaultForm = {
  user: "",
  dob: "",
  gender: "Male",
  address: "",
  position: "",
  emergencyContact: { name: "", relation: "", phone: "" },
};

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<any>(defaultForm);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editId, setEditId] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docEmployee, setDocEmployee] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [docLoading, setDocLoading] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch employees
  const fetchEmployees = () => {
    setLoading(true);
    getEmployees()
      .then(res => setEmployees(res.data))
      .catch(err => setError(err.message || "Failed to load employees"))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchEmployees(); }, []);

  // Fetch users for the user select
  useEffect(() => {
    getUsers()
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  // Filtered employees
  const filteredEmployees = employees.filter((employee) => {
    const name = employee.user?.Names || "";
    const email = employee.user?.Email || "";
    const department = employee.user?.department || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "on leave": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-red-100 text-red-800";
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
  const openEdit = (emp: any) => {
    setForm({
      user: emp.user?._id || "",
      dob: emp.dob ? emp.dob.slice(0, 10) : "",
      gender: emp.gender,
      address: emp.address,
      position: emp.position,
      emergencyContact: emp.emergencyContact || { name: "", relation: "", phone: "" },
    });
    setFormMode("edit");
    setEditId(emp._id);
    setFormError(null);
    setShowModal(true);
  };

  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("emergencyContact.")) {
      const key = name.split(".")[1];
      setForm((prev: any) => ({ ...prev, emergencyContact: { ...prev.emergencyContact, [key]: value } }));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  // Submit add/edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      if (formMode === "add") {
        await addEmployee(form);
        toast({ title: "Employee added", description: "The employee was added successfully." });
      } else if (formMode === "edit" && editId) {
        await updateEmployee(editId, form);
        toast({ title: "Employee updated", description: "The employee was updated successfully." });
      }
      setShowModal(false);
      fetchEmployees();
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

  // Delete employee
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await deleteEmployee(id);
      fetchEmployees();
      toast({ title: "Employee deleted", description: "The employee was deleted successfully." });
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

  // Open document modal
  const openDocModal = async (employee: any) => {
    setDocEmployee(employee);
    setDocModalOpen(true);
    setDocLoading(true);
    setDocError(null);
    try {
      const docs = await getEmployeeDocuments(employee._id);
      setDocuments(docs);
    } catch (err: any) {
      let errorMsg = "Operation failed";
      if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.message) {
        errorMsg = err.message;
      }
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
    } finally {
      setDocLoading(false);
    }
  };

  // Upload documents
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!docEmployee) return;
    const formData = new FormData(e.currentTarget);
    setUploading(true);
    setDocError(null);
    try {
      await uploadEmployeeDocuments(docEmployee._id, formData);
      const docs = await getEmployeeDocuments(docEmployee._id);
      setDocuments(docs);
      e.currentTarget.reset();
      toast({ title: "Document uploaded", description: "The document(s) were uploaded successfully." });
    } catch (err: any) {
      let errorMsg = "Operation failed";
      if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.message) {
        errorMsg = err.message;
      }
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground">Manage your organization's workforce</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      {loading ? (
        <div className="text-center py-8">Loading employees...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {employee.user?.Names?.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{employee.user?.Names}</CardTitle>
                      <p className="text-sm text-muted-foreground">{employee.position}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(employee)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(employee._id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                    {['admin','hr','manager'].includes(user?.role) && (
                      <Button variant="outline" size="icon" onClick={() => openDocModal(employee)}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Department</span>
                  <span className="text-sm text-muted-foreground">{employee.user?.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge className={getStatusColor(employee.user?.status)}>
                    {employee.user?.status || "active"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{employee.user?.Email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{employee.user?.phoneNumber || "-"}</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Position: {employee.position} | Gender: {employee.gender}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredEmployees.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No employees found matching your search.</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formMode === "add" ? "Add Employee" : "Edit Employee"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="user">User</Label>
              <select
                id="user"
                name="user"
                value={form.user}
                onChange={handleFormChange}
                required
                className="w-full border rounded-md px-3 py-2 mt-1"
                disabled={formMode === "edit"}
              >
                <option value="">Select user...</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.Names} ({u.Email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleFormChange}
                className="w-full border rounded-md px-3 py-2 mt-1"
                required
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                value={form.position}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <Label htmlFor="emergencyContact.name">Emergency Name</Label>
                <Input
                  id="emergencyContact.name"
                  name="emergencyContact.name"
                  value={form.emergencyContact.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="emergencyContact.relation">Relation</Label>
                <Input
                  id="emergencyContact.relation"
                  name="emergencyContact.relation"
                  value={form.emergencyContact.relation}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="emergencyContact.phone">Phone</Label>
                <Input
                  id="emergencyContact.phone"
                  name="emergencyContact.phone"
                  value={form.emergencyContact.phone}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>
            {formError && <div className="text-red-600 text-sm text-center">{formError}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (formMode === "add" ? "Adding..." : "Saving...") : (formMode === "add" ? "Add" : "Save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Document Management Modal */}
      <Dialog open={docModalOpen} onOpenChange={setDocModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Documents for {docEmployee?.user?.Names}</DialogTitle>
          </DialogHeader>
          {docLoading ? (<div>Loading...</div>) : docError ? (<div className="text-red-600">{docError}</div>) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Uploaded Documents</h3>
                {documents.length === 0 ? <div className="text-muted-foreground">No documents uploaded.</div> : (
                  <ul className="space-y-2">
                    {documents.map((doc: any, idx: number) => (
                      <li key={idx} className="flex items-center justify-between">
                        <span>{doc.type || 'Document'} ({doc.fileUrl?.split('/').pop()})</span>
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">Download</a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <form onSubmit={handleUpload} className="space-y-2">
                <Label>Upload New Document(s)</Label>
                <input name="documents" type="file" multiple required className="block" />
                <Button type="submit" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</Button>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Employees;
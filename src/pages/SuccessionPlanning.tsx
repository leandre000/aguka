/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, Plus, Trash2, Edit2 } from "lucide-react";
import { getSuccessionPlans, createSuccessionPlan, updateSuccessionPlan, deleteSuccessionPlan, addSuccessionCandidate, removeSuccessionCandidate, getEmployees } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { AdminPortalLayout } from "@/components/layouts/AdminPortalLayout";
import { ManagerPortalLayout } from "@/components/layouts/ManagerPortalLayout";
import { Combobox } from "@headlessui/react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLanguage } from "@/contexts/LanguageContext";

const getLayout = (pathname: string) => {
  if (pathname.startsWith("/admin-portal")) return AdminPortalLayout;
  if (pathname.startsWith("/manager-portal")) return ManagerPortalLayout;
  return React.Fragment;
};

export default function SuccessionPlanning() {
  const { user } = useAuth();
  const location = useLocation();
  const Layout = getLayout(location.pathname);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<any>({ keyRole: "", notes: "" });
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editId, setEditId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [candidateModal, setCandidateModal] = useState(false);
  const [candidatePlan, setCandidatePlan] = useState<any>(null);
  const [candidateId, setCandidateId] = useState<string>("");
  const [candidateNotes, setCandidateNotes] = useState<string>("");
  const [candidateReadiness, setCandidateReadiness] = useState<string>("developing");
  const [candidateError, setCandidateError] = useState<string | null>(null);
  const [candidateSubmitting, setCandidateSubmitting] = useState(false);
  const [employeeQuery, setEmployeeQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Add/expand translation keys at the top
  const translations = {
    en: {
      allFieldsRequired: "All fields are required.",
      planAdded: "Succession plan added successfully.",
      planUpdated: "Succession plan updated successfully.",
      failedToSave: "Failed to save plan.",
      deletePlanTitle: "Delete Succession Plan",
      deletePlanDesc: "Are you sure you want to delete this succession plan? This action cannot be undone.",
      planDeleted: "Succession plan deleted successfully.",
      cancel: "Cancel",
      delete: "Delete",
      error: "Error",
    },
    fr: {
      allFieldsRequired: "Tous les champs sont requis.",
      planAdded: "Plan de succession ajouté avec succès.",
      planUpdated: "Plan de succession mis à jour avec succès.",
      failedToSave: "Échec de l'enregistrement du plan.",
      deletePlanTitle: "Supprimer le plan de succession",
      deletePlanDesc: "Êtes-vous sûr de vouloir supprimer ce plan de succession ? Cette action ne peut pas être annulée.",
      planDeleted: "Plan de succession supprimé avec succès.",
      cancel: "Annuler",
      delete: "Supprimer",
      error: "Erreur",
    },
  };
  const { language } = useLanguage();
  const t = (key: keyof typeof translations.en) => translations[language][key] || translations.en[key];

  // Filter employees for combobox/autocomplete
  const filteredEmployees =
    employeeQuery === ""
      ? employees.filter(e => e._id && (e.user?.Names || e.user?.Email))
      : employees.filter((e) => {
          if (!e._id || !(e.user?.Names || e.user?.Email)) return false;
          const name = (e.user?.Names || e.user?.name || "").toLowerCase();
          const email = (e.user?.Email || e.user?.email || "").toLowerCase();
          const role = (e.user?.role || "").toLowerCase();
          const query = employeeQuery.toLowerCase();
          return (
            name.includes(query) ||
            email.includes(query) ||
            role.includes(query)
          );
        });

  // Fetch plans
  const fetchPlans = () => {
    setLoading(true);
    getSuccessionPlans()
      .then(setPlans)
      .catch(err => setError(err.message || "Failed to load plans"))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchPlans(); }, []);

  // Fetch employees for candidate selection
  useEffect(() => {
    getEmployees().then(res => setEmployees(res.data)).catch(() => setEmployees([]));
  }, []);

  // Open add/edit modal
  const openAdd = () => {
    setForm({ keyRole: "", notes: "" });
    setFormMode("add");
    setEditId(null);
    setFormError(null);
    setShowModal(true);
  };
  const openEdit = (plan: any) => {
    setForm({ keyRole: plan.keyRole, notes: plan.notes });
    setFormMode("edit");
    setEditId(plan._id);
    setFormError(null);
    setShowModal(true);
  };

  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  // Submit add/edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      if (!form.keyRole.trim()) {
        setFormError(t("allFieldsRequired"));
        setSubmitting(false);
        return;
      }
      if (formMode === "add") {
        await createSuccessionPlan(form);
        toast({ title: t("planAdded") });
      } else if (formMode === "edit" && editId) {
        await updateSuccessionPlan(editId, form);
        toast({ title: t("planUpdated") });
      }
      setShowModal(false);
      fetchPlans();
    } catch (err: any) {
      setFormError(err.message || t("failedToSave"));
      toast({ title: t("error"), description: err.message || t("failedToSave"), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete plan
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSuccessionPlan(deleteId);
      fetchPlans();
      toast({ title: t("planDeleted") });
    } catch (err: any) {
      toast({ title: t("error"), description: err.message || t("failedToSave"), variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  // Open candidate modal
  const openCandidateModal = (plan: any) => {
    setCandidatePlan(plan);
    setCandidateId("");
    setCandidateNotes("");
    setCandidateReadiness("developing");
    setCandidateError(null);
    setCandidateModal(true);
  };

  // Add candidate
  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidatePlan || !candidateId) {
      setCandidateError("Please select a valid candidate.");
      return;
    }
    setCandidateError(null);
    setCandidateSubmitting(true);
    try {
      await addSuccessionCandidate(candidatePlan._id, {
        candidateId: candidateId, // should be a string id
        readiness: candidateReadiness,
        notes: candidateNotes,
      });
      setCandidateModal(false);
      fetchPlans();
      toast({ title: "Candidate added", description: "The candidate was added to the plan successfully." });
    } catch (err: any) {
      setCandidateError(err.message || "Failed to add candidate");
      toast({ title: "Error", description: err.message || "Failed to add candidate", variant: "destructive" });
    } finally {
      setCandidateSubmitting(false);
    }
  };

  // Remove candidate
  const handleRemoveCandidate = async (planId: string, employeeId: string) => {
    if (!window.confirm("Remove this candidate from the plan?")) return;
    try {
      await removeSuccessionCandidate(planId, { employee: employeeId });
      fetchPlans();
      toast({ title: "Candidate removed", description: "The candidate was removed from the plan successfully." });
    } catch (err: any) {
      alert("Failed to remove candidate");
      toast({ title: "Error", description: err.message || "Failed to remove candidate", variant: "destructive" });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Succession Planning</h1>
            <p className="text-muted-foreground">Manage key roles and candidate pipelines</p>
          </div>
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" />
            New Plan
          </Button>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading plans...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 flex flex-row justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{plan.keyRole}</CardTitle>
                    <p className="text-sm text-muted-foreground">{plan.notes}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(plan)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(plan._id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Candidates</span>
                    <Button variant="outline" size="sm" onClick={() => openCandidateModal(plan)}>
                      <Users className="h-4 w-4 mr-1" /> Add Candidate
                    </Button>
                  </div>
                  {plan.candidates && plan.candidates.length > 0 ? (
                    <ul className="space-y-2">
                      {plan.candidates.map((c: any) => (
                        <li key={c.employee?._id || c.employee} className="flex items-center justify-between">
                          <span>{c.employee?.user?.Names || c.employee?.user?.Email || c.employee}</span>
                          <span className="text-xs text-muted-foreground">{c.readiness || "-"}</span>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveCandidate(plan._id, c.employee?._id || c.employee)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-muted-foreground text-sm">No candidates yet.</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Plan Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{formMode === "add" ? "New Succession Plan" : "Edit Succession Plan"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="keyRole">Key Role</Label>
                <Input id="keyRole" name="keyRole" value={form.keyRole} onChange={handleFormChange} required />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" name="notes" value={form.notes} onChange={handleFormChange} />
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

        {/* Add Candidate Modal */}
        <Dialog open={candidateModal} onOpenChange={setCandidateModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Candidate</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCandidate} className="space-y-4">
              <div>
                <Label htmlFor="candidate">Employee</Label>
                {/* Combobox for employee selection */}
                <Combobox as="div" value={candidateId} onChange={setCandidateId}>
                  <div className="relative">
                    <Combobox.Input
                      className="w-full border rounded-md px-3 py-2 mt-1"
                      displayValue={(id: string) => {
                        const emp = employees.find((e) => e._id === id);
                        return emp ? `${emp.user?.Names || emp.user?.Email || 'Unknown'}` : "";
                      }}
                      onChange={e => setEmployeeQuery(e.target.value)}
                      placeholder="Type to search employee..."
                      required
                    />
                    <Combobox.Options className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredEmployees.length === 0 && (
                        <div className="px-3 py-2 text-muted-foreground">No employees found.</div>
                      )}
                      {filteredEmployees.map((emp) => (
                        <Combobox.Option
                          key={emp._id}
                          value={emp._id}
                          className={({ active }) =>
                            `cursor-pointer px-3 py-2 ${active ? "bg-accent" : ""}`
                          }
                        >
                          {emp.user?.Names || emp.user?.Email || 'Unknown'}
                          {emp.position || emp.user?.role ? (
                            <span className="text-xs text-muted-foreground ml-2">
                              ({emp.position || emp.user?.role})
                            </span>
                          ) : null}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  </div>
                </Combobox>
              </div>
              <div>
                <Label htmlFor="readiness">Readiness</Label>
                <select
                  id="readiness"
                  value={candidateReadiness}
                  onChange={e => setCandidateReadiness(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 mt-1"
                  required
                >
                  <option value="ready">Ready</option>
                  <option value="developing">Developing</option>
                  <option value="not-ready">Not Ready</option>
                </select>
              </div>
              <div>
                <Label htmlFor="candidateNotes">Notes</Label>
                <Input id="candidateNotes" value={candidateNotes} onChange={e => setCandidateNotes(e.target.value)} />
              </div>
              {candidateError && <div className="text-red-600 text-sm text-center">{candidateError}</div>}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCandidateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={candidateSubmitting}>
                  {candidateSubmitting ? "Adding..." : "Add"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("deletePlanTitle")}</AlertDialogTitle>
              <AlertDialogDescription>{t("deletePlanDesc")}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteId(null)}>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>{t("delete")}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, Plus, Trash2, Edit2 } from "lucide-react";
import {
  getSuccessionPlans,
  createSuccessionPlan,
  updateSuccessionPlan,
  deleteSuccessionPlan,
  addSuccessionCandidate,
  removeSuccessionCandidate,
  getEmployees,
} from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { AdminPortalLayout } from "@/components/layouts/AdminPortalLayout";
import { ManagerPortalLayout } from "@/components/layouts/ManagerPortalLayout";
import { Combobox } from "@headlessui/react";
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

// --- Translation keys ---
const translations = {
  en: {
    allFieldsRequired: "All fields are required.",
    planAdded: "Succession plan added successfully.",
    planUpdated: "Succession plan updated successfully.",
    failedToSave: "Failed to save plan.",
    deletePlanTitle: "Delete Succession Plan",
    deletePlanDesc:
      "Are you sure you want to delete this succession plan? This action cannot be undone.",
    planDeleted: "Succession plan deleted successfully.",
    cancel: "Cancel",
    delete: "Delete",
    error: "Error",
    deleteCandidateTitle: "Remove Candidate",
    deleteCandidateDesc:
      "Are you sure you want to remove this candidate from the succession plan? This action cannot be undone.",
    notAuthorized: "You are not authorized to access Succession Planning.",
    loadingPlans: "Loading plans...",
    noCandidates: "No candidates yet.",
    candidates: "Candidates",
    addCandidate: "Add Candidate",
    newSuccessionPlan: "New Succession Plan",
    editSuccessionPlan: "Edit Succession Plan",
    keyRole: "Key Role",
    notes: "Notes",
    add: "Add",
    save: "Save",
    adding: "Adding...",
    saving: "Saving...",
    employee: "Employee",
    typeToSearch: "Type to search employee...",
    noEmployeesFound: "No employees found.",
    readiness: "Readiness",
    ready: "Ready",
    developing: "Developing",
    notReady: "Not Ready",
    addCandidateTitle: "Add Candidate",
    candidateAdded: "Candidate added",
    candidateAddedDesc: "The candidate was added to the plan successfully.",
    candidateRemoved: "Candidate removed",
    candidateRemovedDesc:
      "The candidate was removed from the plan successfully.",
    failedToAddCandidate: "Failed to add candidate",
    failedToRemoveCandidate: "Failed to remove candidate",
    manageKeyRoles: "Manage key roles and candidate pipelines",
    successionPlanning: "Succession Planning",
    newPlan: "New Plan",
  },
  fr: {
    allFieldsRequired: "Tous les champs sont requis.",
    planAdded: "Plan de succession ajouté avec succès.",
    planUpdated: "Plan de succession mis à jour avec succès.",
    failedToSave: "Échec de l'enregistrement du plan.",
    deletePlanTitle: "Supprimer le plan de succession",
    deletePlanDesc:
      "Êtes-vous sûr de vouloir supprimer ce plan de succession ? Cette action ne peut pas être annulée.",
    planDeleted: "Plan de succession supprimé avec succès.",
    cancel: "Annuler",
    delete: "Supprimer",
    error: "Erreur",
    deleteCandidateTitle: "Supprimer le candidat",
    deleteCandidateDesc:
      "Êtes-vous sûr de vouloir supprimer ce candidat du plan de succession ? Cette action ne peut pas être annulée.",
    notAuthorized:
      "Vous n'êtes pas autorisé à accéder à la planification de la succession.",
    loadingPlans: "Chargement des plans...",
    noCandidates: "Aucun candidat pour le moment.",
    candidates: "Candidats",
    addCandidate: "Ajouter un candidat",
    newSuccessionPlan: "Nouveau plan de succession",
    editSuccessionPlan: "Modifier le plan de succession",
    keyRole: "Poste clé",
    notes: "Remarques",
    add: "Ajouter",
    save: "Enregistrer",
    adding: "Ajout...",
    saving: "Enregistrement...",
    employee: "Employé",
    typeToSearch: "Tapez pour rechercher un employé...",
    noEmployeesFound: "Aucun employé trouvé.",
    readiness: "Disponibilité",
    ready: "Prêt",
    developing: "En développement",
    notReady: "Non prêt",
    addCandidateTitle: "Ajouter un candidat",
    candidateAdded: "Candidat ajouté",
    candidateAddedDesc: "Le candidat a été ajouté au plan avec succès.",
    candidateRemoved: "Candidat supprimé",
    candidateRemovedDesc: "Le candidat a été supprimé du plan avec succès.",
    failedToAddCandidate: "Échec de l'ajout du candidat",
    failedToRemoveCandidate: "Échec de la suppression du candidat",
    manageKeyRoles: "Gérez les postes clés et les viviers de candidats",
    successionPlanning: "Planification de la succession",
    newPlan: "Nouveau plan",
  },
};

// --- Simple translation hook for this page ---
function useLocalLanguage() {
  const [lang, setLang] = useState<"en" | "fr">(
    localStorage.getItem("lang") === "fr" ? "fr" : "en"
  );
  const t = (key: keyof (typeof translations)["en"]) =>
    translations[lang][key] || translations.en[key] || key;
  return { t, lang, setLang };
}

const getLayout = (pathname: string) => {
  if (pathname.startsWith("/admin-portal")) return AdminPortalLayout;
  if (pathname.startsWith("/manager-portal")) return ManagerPortalLayout;
  return React.Fragment;
};

export default function SuccessionPlanning({
  asModal = false,
}: {
  asModal?: boolean;
}) {
  const { t, lang, setLang } = useLocalLanguage();
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
  const [candidateReadiness, setCandidateReadiness] =
    useState<string>("developing");
  const [candidateError, setCandidateError] = useState<string | null>(null);
  const [candidateSubmitting, setCandidateSubmitting] = useState(false);
  const [employeeQuery, setEmployeeQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [candidateToRemove, setCandidateToRemove] = useState<{
    planId: string;
    candidateId: string;
  } | null>(null);

  // Fetch plans
  const fetchPlans = () => {
    setLoading(true);
    getSuccessionPlans()
      .then(setPlans)
      .catch((err) => setError(err.message || t("failedToSave")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlans();
  }, []);
  useEffect(() => {
    getEmployees()
      .then((res) => setEmployees(res.data))
      .catch(() => setEmployees([]));
  }, []);

  // Role-based access control
  const allowedRoles = ["admin", "manager"];
  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-lg text-red-600 text-center">
        {t("notAuthorized")}
      </div>
    );
  }

  // Filter employees for combobox/autocomplete
  const filteredEmployees =
    employeeQuery === ""
      ? employees.filter((e) => e._id && (e.user?.Names || e.user?.Email))
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
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      toast({
        title: t("error"),
        description: err.message || t("failedToSave"),
        variant: "destructive",
      });
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
      toast({
        title: t("error"),
        description: err.message || t("failedToSave"),
        variant: "destructive",
      });
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
      setCandidateError(t("allFieldsRequired"));
      return;
    }
    setCandidateError(null);
    setCandidateSubmitting(true);
    try {
      await addSuccessionCandidate(candidatePlan._id, {
        candidateId: candidateId,
        readiness: candidateReadiness,
        notes: candidateNotes,
      });
      setCandidateModal(false);
      fetchPlans();
      toast({
        title: t("candidateAdded"),
        description: t("candidateAddedDesc"),
      });
    } catch (err: any) {
      setCandidateError(err.message || t("failedToAddCandidate"));
      toast({
        title: t("error"),
        description: err.message || t("failedToAddCandidate"),
        variant: "destructive",
      });
    } finally {
      setCandidateSubmitting(false);
    }
  };

  // Remove candidate
  const handleRemoveCandidate = async (planId: string, employeeId: string) => {
    try {
      await removeSuccessionCandidate(planId, { employee: employeeId });
      fetchPlans();
      toast({
        title: t("candidateRemoved"),
        description: t("candidateRemovedDesc"),
      });
    } catch (err: any) {
      toast({
        title: t("error"),
        description: err.message || t("failedToRemoveCandidate"),
        variant: "destructive",
      });
    }
  };

  // Language Switcher
  const LanguageSwitcher = () => (
    <div className="flex justify-end mb-2">
      <Button
        variant={lang === "en" ? "default" : "outline"}
        onClick={() => {
          setLang("en");
          localStorage.setItem("lang", "en");
        }}
        className="mr-2"
      >
        English
      </Button>
      <Button
        variant={lang === "fr" ? "default" : "outline"}
        onClick={() => {
          setLang("fr");
          localStorage.setItem("lang", "fr");
        }}
      >
        Français
      </Button>
    </div>
  );

  return asModal ? (
    <div className="space-y-6">
      <LanguageSwitcher />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("successionPlanning")}
          </h1>
          <p className="text-muted-foreground">{t("manageKeyRoles")}</p>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-8">{t("loadingPlans")}</div>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(plan)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(plan._id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t("candidates")}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openCandidateModal(plan)}
                  >
                    <Users className="h-4 w-4 mr-1" /> {t("addCandidate")}
                  </Button>
                </div>
                {plan.candidates && plan.candidates.length > 0 ? (
                  <ul className="space-y-2">
                    {plan.candidates.map((c: any) => (
                      <li
                        key={c._id || c.user?._id || c.user}
                        className="flex items-center justify-between"
                      >
                        <span>
                          {c.user?.Names ||
                            c.user?.Email ||
                            c.user?._id ||
                            c._id ||
                            "Unknown"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t(c.readiness) || "-"}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCandidateToRemove({
                              planId: plan._id,
                              candidateId: c._id,
                            });
                            setRemoveDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    {t("noCandidates")}
                  </div>
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
            <DialogTitle>
              {formMode === "add"
                ? t("newSuccessionPlan")
                : t("editSuccessionPlan")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="keyRole">{t("keyRole")}</Label>
              <Input
                id="keyRole"
                name="keyRole"
                value={form.keyRole}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="notes">{t("notes")}</Label>
              <Input
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleFormChange}
              />
            </div>
            {formError && (
              <div className="text-red-600 text-sm text-center">
                {formError}
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? formMode === "add"
                    ? t("adding")
                    : t("saving")
                  : formMode === "add"
                  ? t("add")
                  : t("save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Candidate Modal */}
      <Dialog open={candidateModal} onOpenChange={setCandidateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addCandidateTitle")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCandidate} className="space-y-4">
            <div>
              <Label htmlFor="candidate">{t("employee")}</Label>
              <Combobox as="div" value={candidateId} onChange={setCandidateId}>
                <div className="relative">
                  <Combobox.Input
                    className="w-full border rounded-md px-3 py-2 mt-1"
                    displayValue={(id: string) => {
                      const emp = employees.find((e) => e._id === id);
                      return emp
                        ? `${emp.user?.Names || emp.user?.Email || "Unknown"}`
                        : "";
                    }}
                    onChange={(e) => setEmployeeQuery(e.target.value)}
                    placeholder={t("typeToSearch")}
                    required
                  />
                  <Combobox.Options className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredEmployees.length === 0 && (
                      <div className="px-3 py-2 text-muted-foreground">
                        {t("noEmployeesFound")}
                      </div>
                    )}
                    {filteredEmployees.map((emp) => (
                      <Combobox.Option
                        key={emp._id}
                        value={emp._id}
                        className={({ active }) =>
                          `cursor-pointer px-3 py-2 ${
                            active ? "bg-accent" : ""
                          }`
                        }
                      >
                        {emp.user?.Names || emp.user?.Email || "Unknown"}
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
              <Label htmlFor="readiness">{t("readiness")}</Label>
              <select
                id="readiness"
                value={candidateReadiness}
                onChange={(e) => setCandidateReadiness(e.target.value)}
                className="w-full border rounded-md px-3 py-2 mt-1"
                required
              >
                <option value="ready">{t("ready")}</option>
                <option value="developing">{t("developing")}</option>
                <option value="not-ready">{t("notReady")}</option>
              </select>
            </div>
            <div>
              <Label htmlFor="candidateNotes">{t("notes")}</Label>
              <Input
                id="candidateNotes"
                value={candidateNotes}
                onChange={(e) => setCandidateNotes(e.target.value)}
              />
            </div>
            {candidateError && (
              <div className="text-red-600 text-sm text-center">
                {candidateError}
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCandidateModal(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={candidateSubmitting}>
                {candidateSubmitting ? t("adding") : t("add")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deletePlanTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deletePlanDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Candidate Confirmation Modal */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteCandidateTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteCandidateDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRemoveDialogOpen(false)}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (candidateToRemove) {
                  await handleRemoveCandidate(
                    candidateToRemove.planId,
                    candidateToRemove.candidateId
                  );
                  setRemoveDialogOpen(false);
                }
              }}
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  ) : (
    <Layout>
      <div className="space-y-6">
        <LanguageSwitcher />
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t("successionPlanning")}
            </h1>
            <p className="text-muted-foreground">{t("manageKeyRoles")}</p>
          </div>
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" />
            {t("newPlan")}
          </Button>
        </div>
        {loading ? (
          <div className="text-center py-8">{t("loadingPlans")}</div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3 flex flex-row justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{plan.keyRole}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {plan.notes}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(plan)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(plan._id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{t("candidates")}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openCandidateModal(plan)}
                    >
                      <Users className="h-4 w-4 mr-1" /> {t("addCandidate")}
                    </Button>
                  </div>
                  {plan.candidates && plan.candidates.length > 0 ? (
                    <ul className="space-y-2">
                      {plan.candidates.map((c: any) => (
                        <li
                          key={c._id || c.user?._id || c.user}
                          className="flex items-center justify-between"
                        >
                          <span>
                            {c.user?.Names ||
                              c.user?.Email ||
                              c.user?._id ||
                              c._id ||
                              "Unknown"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {t(c.readiness) || "-"}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCandidateToRemove({
                                planId: plan._id,
                                candidateId: c._id,
                              });
                              setRemoveDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      {t("noCandidates")}
                    </div>
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
              <DialogTitle>
                {formMode === "add"
                  ? t("newSuccessionPlan")
                  : t("editSuccessionPlan")}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="keyRole">{t("keyRole")}</Label>
                <Input
                  id="keyRole"
                  name="keyRole"
                  value={form.keyRole}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="notes">{t("notes")}</Label>
                <Input
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                />
              </div>
              {formError && (
                <div className="text-red-600 text-sm text-center">
                  {formError}
                </div>
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? formMode === "add"
                      ? t("adding")
                      : t("saving")
                    : formMode === "add"
                    ? t("add")
                    : t("save")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Candidate Modal */}
        <Dialog open={candidateModal} onOpenChange={setCandidateModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("addCandidateTitle")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCandidate} className="space-y-4">
              <div>
                <Label htmlFor="candidate">{t("employee")}</Label>
                <Combobox
                  as="div"
                  value={candidateId}
                  onChange={setCandidateId}
                >
                  <div className="relative">
                    <Combobox.Input
                      className="w-full border rounded-md px-3 py-2 mt-1"
                      displayValue={(id: string) => {
                        const emp = employees.find((e) => e._id === id);
                        return emp
                          ? `${emp.user?.Names || emp.user?.Email || "Unknown"}`
                          : "";
                      }}
                      onChange={(e) => setEmployeeQuery(e.target.value)}
                      placeholder={t("typeToSearch")}
                      required
                    />
                    <Combobox.Options className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredEmployees.length === 0 && (
                        <div className="px-3 py-2 text-muted-foreground">
                          {t("noEmployeesFound")}
                        </div>
                      )}
                      {filteredEmployees.map((emp) => (
                        <Combobox.Option
                          key={emp._id}
                          value={emp._id}
                          className={({ active }) =>
                            `cursor-pointer px-3 py-2 ${
                              active ? "bg-accent" : ""
                            }`
                          }
                        >
                          {emp.user?.Names || emp.user?.Email || "Unknown"}
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
                <Label htmlFor="readiness">{t("readiness")}</Label>
                <select
                  id="readiness"
                  value={candidateReadiness}
                  onChange={(e) => setCandidateReadiness(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 mt-1"
                  required
                >
                  <option value="ready">{t("ready")}</option>
                  <option value="developing">{t("developing")}</option>
                  <option value="not-ready">{t("notReady")}</option>
                </select>
              </div>
              <div>
                <Label htmlFor="candidateNotes">{t("notes")}</Label>
                <Input
                  id="candidateNotes"
                  value={candidateNotes}
                  onChange={(e) => setCandidateNotes(e.target.value)}
                />
              </div>
              {candidateError && (
                <div className="text-red-600 text-sm text-center">
                  {candidateError}
                </div>
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCandidateModal(false)}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={candidateSubmitting}>
                  {candidateSubmitting ? t("adding") : t("add")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <AlertDialog
          open={!!deleteId}
          onOpenChange={(open) => !open && setDeleteId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("deletePlanTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("deletePlanDesc")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteId(null)}>
                {t("cancel")}
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                {t("delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Remove Candidate Confirmation Modal */}
        <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("deleteCandidateTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("deleteCandidateDesc")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setRemoveDialogOpen(false)}>
                {t("cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  if (candidateToRemove) {
                    await handleRemoveCandidate(
                      candidateToRemove.planId,
                      candidateToRemove.candidateId
                    );
                    setRemoveDialogOpen(false);
                  }
                }}
              >
                {t("delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}

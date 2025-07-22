/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Award, Calendar, Plus, FileText, Edit2, Trash2 } from "lucide-react";
import { getReviews, addReview, updateReview, deleteReview } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const defaultForm = {
  employee: "",
  reviewer: "",
  period: "",
  objectives: [],
  feedback: "",
  rating: 0,
};

const Performance = () => {
  const { user } = useAuth();
  const isAdminOrManager = user?.role === "admin" || user?.role === "manager";
  const isEmployee = user?.role === "employee";
  const [activeTab, setActiveTab] = useState("reviews");
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>(defaultForm);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editId, setEditId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Add/expand translation keys at the top
  const translations = {
    en: {
      allFieldsRequired: "All fields are required.",
      reviewAdded: "Performance review added successfully.",
      reviewUpdated: "Performance review updated successfully.",
      failedToSave: "Failed to save review.",
      deleteReviewTitle: "Delete Review",
      deleteReviewDesc: "Are you sure you want to delete this review? This action cannot be undone.",
      reviewDeleted: "Performance review deleted successfully.",
      cancel: "Cancel",
      delete: "Delete",
      error: "Error",
    },
    fr: {
      allFieldsRequired: "Tous les champs sont requis.",
      reviewAdded: "Évaluation de performance ajoutée avec succès.",
      reviewUpdated: "Évaluation de performance mise à jour avec succès.",
      failedToSave: "Échec de l'enregistrement de l'évaluation.",
      deleteReviewTitle: "Supprimer l'évaluation",
      deleteReviewDesc: "Êtes-vous sûr de vouloir supprimer cette évaluation ? Cette action ne peut pas être annulée.",
      reviewDeleted: "Évaluation de performance supprimée avec succès.",
      cancel: "Annuler",
      delete: "Supprimer",
      error: "Erreur",
    },
  };
  const { language } = useLanguage();
  const t = (key: keyof typeof translations.en) => translations[language][key] || translations.en[key];

  // Fetch reviews
  const fetchReviews = () => {
    setLoading(true);
    getReviews()
      .then(res => setReviews(res.data || res))
      .catch(err => setError(err.message || "Failed to load reviews"))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchReviews(); }, []);

  // Open add/edit form
  const openAdd = () => {
    setForm(defaultForm);
    setFormMode("add");
    setEditId(null);
    setFormError(null);
    setShowForm(true);
  };
  const openEdit = (review: any) => {
    setForm({
      employee: review.employee?._id || review.employee,
      reviewer: review.reviewer?._id || review.reviewer,
      period: review.period,
      objectives: review.objectives || [],
      feedback: review.feedback || "",
      rating: review.rating || 0,
    });
    setFormMode("edit");
    setEditId(review._id);
    setFormError(null);
    setShowForm(true);
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
      if (!form.employee || !form.period || !form.rating || !form.feedback || !form.objectives) {
        setFormError(t("allFieldsRequired"));
        setSubmitting(false);
        return;
      }
      if (formMode === "add") {
        await addReview(form);
        toast({ title: t("reviewAdded") });
      } else if (formMode === "edit" && editId) {
        await updateReview(editId, form);
        toast({ title: t("reviewUpdated") });
      }
      setShowForm(false);
      fetchReviews();
    } catch (err: any) {
      let errorMsg = err.message || t("failedToSave");
      setFormError(errorMsg);
      toast({ title: t("error"), description: errorMsg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete review
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteReview(deleteId);
      fetchReviews();
      toast({ title: t("reviewDeleted") });
    } catch (err: any) {
      let errorMsg = err.message || t("failedToSave");
      toast({ title: t("error"), description: errorMsg, variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": case "Nearly Complete": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Filter reviews for employee
  const filteredReviews = isEmployee
    ? reviews.filter((r: any) => r.employee?._id === user._id || r.employee === user._id)
    : reviews;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performance</h1>
          <p className="text-muted-foreground">Track employee performance reviews</p>
        </div>
        {isAdminOrManager && (
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" />
            New Review
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="reviews">Performance Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading reviews...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : (
            <div className="grid gap-4">
              {filteredReviews.map((review) => (
                <Card key={review._id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-lg font-semibold">{review.employee?.Names || review.employee}</h3>
                          <p className="text-sm text-muted-foreground">{review.period}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium">Rating</p>
                              <p className="text-lg font-bold text-primary">
                                {review.rating > 0 ? `${review.rating}/5.0` : "Pending"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-green-600" />
                            <div>
                              <p className="text-sm font-medium">Objectives</p>
                              <p className="text-lg font-bold text-green-600">
                                {review.objectives?.length || 0}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium">Reviewer</p>
                              <p className="text-sm text-muted-foreground">
                                {review.reviewer?.Names || review.reviewer}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="pt-2">
                          <p className="text-sm text-muted-foreground">Feedback: {review.feedback}</p>
                        </div>
                      </div>
                      {isAdminOrManager && (
                        <div className="text-right space-y-2">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => openEdit(review)}>
                              <Edit2 className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <AlertDialog open={deleteId === review._id} onOpenChange={open => !open && setDeleteId(null)}>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setDeleteId(review._id)}>{t("delete")}</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{t("deleteReviewTitle")}</AlertDialogTitle>
                                  <AlertDialogDescription>{t("deleteReviewDesc")}</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setDeleteId(null)}>{t("cancel")}</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDelete}>{t("delete")}</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Form Modal */}
      {isAdminOrManager && showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{formMode === "add" ? "New Review" : "Edit Review"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Employee ID</label>
                <input name="employee" value={form.employee} onChange={handleFormChange} className="w-full border rounded-md px-3 py-2 mt-1" required />
              </div>
              <div>
                <label className="text-sm font-medium">Reviewer ID</label>
                <input name="reviewer" value={form.reviewer} onChange={handleFormChange} className="w-full border rounded-md px-3 py-2 mt-1" required />
              </div>
              <div>
                <label className="text-sm font-medium">Period</label>
                <input name="period" value={form.period} onChange={handleFormChange} className="w-full border rounded-md px-3 py-2 mt-1" required />
              </div>
              <div>
                <label className="text-sm font-medium">Objectives (comma separated)</label>
                <input name="objectives" value={form.objectives} onChange={e => setForm((prev: any) => ({ ...prev, objectives: e.target.value.split(",") }))} className="w-full border rounded-md px-3 py-2 mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Feedback</label>
                <textarea name="feedback" value={form.feedback} onChange={handleFormChange} className="w-full border rounded-md px-3 py-2 mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Rating</label>
                <input name="rating" type="number" min={1} max={5} value={form.rating} onChange={handleFormChange} className="w-full border rounded-md px-3 py-2 mt-1" required />
              </div>
              {formError && <div className="text-red-600 text-sm text-center">{formError}</div>}
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Performance;
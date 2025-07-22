import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, BookOpen, Users, Trash2, Edit2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrainerPortalLayout } from "@/components/layouts/TrainerPortalLayout";
import { getCourses, addCourse, updateCourse, deleteCourse } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function CourseCreation() {
  const translations = {
    en: {
      allFieldsRequired: "All fields are required.",
      courseCreated: "Course created successfully.",
      courseUpdated: "Course updated successfully.",
      failedToSave: "Failed to save course.",
      deleteCourseTitle: "Delete Course",
      deleteCourseDesc: "Are you sure you want to delete this course? This action cannot be undone.",
      courseDeleted: "Course deleted successfully.",
      cancel: "Cancel",
      delete: "Delete",
      error: "Error",
    },
    es: {
      allFieldsRequired: "Todos los campos son requeridos.",
      courseCreated: "Curso creado con éxito.",
      courseUpdated: "Curso actualizado con éxito.",
      failedToSave: "Error al guardar el curso.",
      deleteCourseTitle: "Eliminar Curso",
      deleteCourseDesc: "¿Estás seguro de que quieres eliminar este curso? Esta acción no se puede deshacer.",
      courseDeleted: "Curso eliminado con éxito.",
      cancel: "Cancelar",
      delete: "Eliminar",
      error: "Error",
    },
    fr: {
      allFieldsRequired: "Tous les champs sont requis.",
      courseCreated: "Cours créé avec succès.",
      courseUpdated: "Cours mis à jour avec succès.",
      failedToSave: "Échec de l'enregistrement du cours.",
      deleteCourseTitle: "Supprimer le cours",
      deleteCourseDesc: "Êtes-vous sûr de vouloir supprimer ce cours ? Cette action ne peut pas être annulée.",
      courseDeleted: "Cours supprimé avec succès.",
      cancel: "Annuler",
      delete: "Supprimer",
      error: "Erreur",
    },
  };
  const { language } = useLanguage();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({ title: "", description: "", category: "", duration: "", level: "Beginner", modules: [], materials: [] });
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editId, setEditId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const content = {
    en: {
      title: "Course Creation",
      description: "Create and manage training courses",
      newCourse: "New Course",
      courseTitle: "Course Title",
      courseDescription: "Course Description",
      category: "Category",
      duration: "Duration",
      level: "Level",
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
      technical: "Technical",
      soft_skills: "Soft Skills",
      compliance: "Compliance",
      leadership: "Leadership",
      modules: "Modules",
      enrolled: "Enrolled",
      published: "Published",
      draft: "Draft",
      edit: "Edit",
      view: "View",
      publish: "Publish",
      preview: "Preview",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      add: "Add",
    },
    es: {
      title: "Creación de Cursos",
      description: "Crear y gestionar cursos de formación",
      newCourse: "Nuevo Curso",
      courseTitle: "Título del Curso",
      courseDescription: "Descripción del Curso",
      category: "Categoría",
      duration: "Duración",
      level: "Nivel",
      beginner: "Principiante",
      intermediate: "Intermedio",
      advanced: "Avanzado",
      technical: "Técnico",
      soft_skills: "Habilidades Blandas",
      compliance: "Cumplimiento",
      leadership: "Liderazgo",
      modules: "Módulos",
      enrolled: "Inscritos",
      published: "Publicado",
      draft: "Borrador",
      edit: "Editar",
      view: "Ver",
      publish: "Publicar",
      preview: "Vista Previa",
      delete: "Eliminar",
      save: "Guardar",
      cancel: "Cancelar",
      add: "Agregar",
    },
    fr: {
      title: "Création de cours",
      description: "Créer et gérer des cours de formation",
      newCourse: "Nouveau cours",
      courseTitle: "Titre du cours",
      courseDescription: "Description du cours",
      category: "Catégorie",
      duration: "Durée",
      level: "Niveau",
      beginner: "Débutant",
      intermediate: "Intermédiaire",
      advanced: "Avancé",
      technical: "Technique",
      soft_skills: "Compétences douces",
      compliance: "Conformité",
      leadership: "Leadership",
      modules: "Modules",
      enrolled: "Inscrits",
      published: "Publié",
      draft: "Brouillon",
      edit: "Modifier",
      view: "Voir",
      publish: "Publier",
      preview: "Aperçu",
      delete: "Supprimer",
      save: "Enregistrer",
      cancel: "Annuler",
      add: "Ajouter",
    },
  };
  const t = (key: keyof typeof translations.en) => translations[language][key] || translations.en[key];

  // Fetch courses
  const fetchCourses = () => {
    setLoading(true);
    getCourses()
      .then(res => setCourses(res))
      .catch(err => setError(err.message || "Failed to load courses"))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchCourses(); }, []);

  // Open add/edit form
  const openAdd = () => {
    setForm({ title: "", description: "", category: "", duration: "", level: "Beginner", modules: [], materials: [] });
    setFormMode("add");
    setEditId(null);
    setFormError(null);
    setShowForm(true);
  };
  const openEdit = (course: any) => {
    setForm({
      title: course.title,
      description: course.description,
      category: course.category,
      duration: course.duration,
      level: course.level || "Beginner",
      modules: course.modules || [],
      materials: course.materials || [],
    });
    setFormMode("edit");
    setEditId(course._id);
    setFormError(null);
    setShowForm(true);
  };

  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };
  const handleSelectChange = (name: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  // Submit add/edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      if (!form.title.trim() || !form.description.trim() || !form.category.trim() || !form.duration.trim()) {
        setFormError(t("allFieldsRequired"));
        setSubmitting(false);
        return;
      }
      if (formMode === "add") {
        await addCourse(form);
        toast({ title: t("courseCreated") });
      } else if (formMode === "edit" && editId) {
        await updateCourse(editId, form);
        toast({ title: t("courseUpdated") });
      }
      setShowForm(false);
      fetchCourses();
    } catch (err: any) {
      setFormError(err.message || t("failedToSave"));
      toast({ title: t("error"), description: err.message || t("failedToSave"), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete course
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCourse(deleteId);
      fetchCourses();
      toast({ title: t("courseDeleted") });
    } catch (err: any) {
      toast({ title: t("error"), description: err.message || t("failedToSave"), variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <TrainerPortalLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
            <p className="text-muted-foreground">{t.description}</p>
          </div>
          <Button onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" />
            {t.newCourse}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Existing Courses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">Loading courses...</div>
                ) : error ? (
                  <div className="text-center text-red-600 py-8">{error}</div>
                ) : (
                  courses.map((course) => (
                    <div
                      key={course._id}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {course.description}
                          </p>
                        </div>
                        <Badge
                          variant={
                            course.status === "published"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {course.status === "published" ? t.published : t.draft}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {course.modules?.length || 0} {t.modules}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.enrolled || 0} {t.enrolled}
                        </span>
                        <Badge variant="outline">{course.category}</Badge>
                        <Badge variant="outline">{course.level}</Badge>
                        <span>{course.duration}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(course)}>
                          <Edit2 className="h-4 w-4 mr-1" />
                          {t.edit}
                        </Button>
                        <Button variant="destructive" onClick={() => setDeleteId(course._id)}>{t("delete")}</Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            {/* Add/Edit Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4">{formMode === "add" ? t.newCourse : t.edit}</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">{t.courseTitle}</label>
                      <Input name="title" value={form.title} onChange={handleFormChange} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t.courseDescription}</label>
                      <Textarea name="description" value={form.description} onChange={handleFormChange} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t.category}</label>
                      <Select value={form.category} onValueChange={v => handleSelectChange("category", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">{t.technical}</SelectItem>
                          <SelectItem value="soft-skills">{t.soft_skills}</SelectItem>
                          <SelectItem value="compliance">{t.compliance}</SelectItem>
                          <SelectItem value="leadership">{t.leadership}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t.duration}</label>
                      <Input name="duration" value={form.duration} onChange={handleFormChange} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t.level}</label>
                      <Select value={form.level} onValueChange={v => handleSelectChange("level", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">{t.beginner}</SelectItem>
                          <SelectItem value="Intermediate">{t.intermediate}</SelectItem>
                          <SelectItem value="Advanced">{t.advanced}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formError && <div className="text-red-600 text-sm text-center">{formError}</div>}
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)}>{t.cancel}</Button>
                      <Button type="submit" disabled={submitting}>{submitting ? t.save + "..." : t.save}</Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {/* Quick Create (shortcut to open add form) */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Create</CardTitle>
                <CardDescription>Start creating a new course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" onClick={openAdd}>{t.add} {t.newCourse}</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteCourseTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteCourseDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t("delete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TrainerPortalLayout>
  );
}

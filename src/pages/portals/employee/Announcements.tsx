/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Megaphone,
  Calendar,
  User,
  Search,
  Pin,
  MessageSquare,
  Heart,
  Trash2,
  Plus,
} from "lucide-react";
import { EmployeePortalLayout } from "@/components/layouts/EmployeePortalLayout";
import React, { useEffect, useState } from "react";
import { getAnnouncements, addAnnouncement, deleteAnnouncement } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function Announcements() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const isAdminOrManager = user?.role === "admin" || user?.role === "manager";
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch announcements
  const fetchAnnouncements = () => {
    setLoading(true);
    getAnnouncements()
      .then(res => setAnnouncements(res.data))
      .catch(err => setError(err.message || "Failed to load announcements"))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchAnnouncements(); }, []);

  // Add announcement
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await addAnnouncement(form);
      setShowAdd(false);
      setForm({ title: "", content: "" });
      fetchAnnouncements();
    } catch (err: any) {
      setFormError(err.message || "Failed to add announcement");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete announcement
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await deleteAnnouncement(id);
      fetchAnnouncements();
    } catch (err) {
      alert("Failed to delete announcement");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "policy": return "bg-blue-100 text-blue-800";
      case "benefits": return "bg-green-100 text-green-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      case "meeting": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Filtered announcements
  const filteredAnnouncements = announcements.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <EmployeePortalLayout>
      <div className="space-y-4 md:space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Megaphone className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">Announcements</h1>
          </div>
          {isAdminOrManager && (
            <Button onClick={() => setShowAdd(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Announcement
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search announcements..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            <Calendar className="h-4 w-4 mr-2" />
            Filter by Date
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading announcements...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement) => (
              <Card
                key={announcement._id}
                className={announcement.pinned ? "border-primary" : ""}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        {announcement.pinned && (
                          <Pin className="h-4 w-4 text-primary flex-shrink-0" />
                        )}
                        <CardTitle className="text-lg md:text-xl break-words">
                          {announcement.title}
                        </CardTitle>
                      </div>
                      <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
                        <div className="flex items-center space-x-2 min-w-0">
                          <Avatar className="h-6 w-6 flex-shrink-0">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>
                              <User className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground truncate">
                            {announcement.author || announcement.createdBy?.Names || "System"}
                          </span>
                        </div>
                        <div className="hidden lg:block">
                          <Separator orientation="vertical" className="h-4" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {announcement.date ? announcement.date.slice(0, 10) : (announcement.createdAt ? announcement.createdAt.slice(0, 10) : "")}
                        </span>
                        <div className="hidden lg:block">
                          <Separator orientation="vertical" className="h-4" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {announcement.priority && (
                            <Badge variant={getPriorityColor(announcement.priority)}>
                              {announcement.priority.charAt(0).toUpperCase() +
                                announcement.priority.slice(1) +
                                " Priority"}
                            </Badge>
                          )}
                          {announcement.category && (
                            <Badge className={getCategoryColor(announcement.category)}>
                              {announcement.category.charAt(0).toUpperCase() +
                                announcement.category.slice(1)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {isAdminOrManager && (
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(announcement._id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm md:text-base">
                    {announcement.content}
                  </p>
                  <Separator className="my-4" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        {announcement.likes || 0}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {announcement.comments || 0}
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isAdminOrManager && showAdd && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add Announcement</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Title</label>
                  <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Content</label>
                  <Input value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required />
                </div>
                {formError && <div className="text-red-600 text-sm text-center">{formError}</div>}
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                  <Button type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add"}</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="text-center py-8">
          <Button variant="outline">
            {t("employee.loadMoreAnnouncements")}
          </Button>
        </div>
      </div>
    </EmployeePortalLayout>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DollarSign,  FileText, Send, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RecruiterPortalLayout } from "@/components/layouts/RecruiterPortalLayout";
import { useEffect, useState } from "react";
import { getOffers } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus as PlusIcon, Calendar as CalendarIcon } from "lucide-react";
import { getJobPostings, getUsers, createOffer, updateOffer, withdrawOffer } from "@/lib/api";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";

export default function OfferManagement() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Offer Management",
      description: "Track and manage job offers",
      pending: "Pending",
      accepted: "Accepted",
      declined: "Declined",
      expired: "Expired",
      salary: "Salary",
      startDate: "Start Date",
      viewOffer: "View Offer",
      sendReminder: "Send Reminder",
      withdraw: "Withdraw",
      negotiate: "Negotiate",
      loading: "Loading offers...",
      error: "Failed to load offers.",
      empty: "No offers found.",
    },
    fr: {
      title: "Gestion des offres",
      description: "Suivre et gérer les offres d'emploi",
      pending: "En attente",
      accepted: "Acceptée",
      declined: "Refusée",
      expired: "Expirée",
      salary: "Salaire",
      startDate: "Date de début",
      viewOffer: "Voir l'offre",
      sendReminder: "Envoyer un rappel",
      withdraw: "Retirer",
      negotiate: "Négocier",
      loading: "Chargement des offres...",
      error: "Échec du chargement des offres.",
      empty: "Aucune offre trouvée.",
    },
  };

  const t = content[language];

  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    candidate: '',
    job: '',
    salary: '',
    startDate: '',
    sentDate: '',
    expiryDate: '',
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getOffers()
      .then((data) => {
        setOffers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(t.error);
        setLoading(false);
      });
    getJobPostings().then(setJobs).catch(() => {});
  }, [language, t.error]);

  useEffect(() => {
    getJobPostings().then(setJobs).catch(() => {});
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setForm({ candidate: '', job: '', salary: '', startDate: '', sentDate: '', expiryDate: '' });
    setShowModal(true);
    setSelectedOffer(null);
  };
  const openEditModal = (offer: any) => {
    setModalMode('edit');
    setForm({
      candidate: offer.candidate?._id || '',
      job: offer.job?._id || '',
      salary: offer.salary,
      startDate: offer.startDate,
      sentDate: offer.sentDate,
      expiryDate: offer.expiryDate,
      status: offer.status,
    });
    setShowModal(true);
    setSelectedOffer(offer);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedOffer(null);
  };
  const handleFormChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };
  const handleDateChange = (field: string, date: Date | undefined) => {
    handleFormChange(field, date ? format(date, 'yyyy-MM-dd') : '');
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (modalMode === 'create') {
        await createOffer(form);
        toast.success('Offer created');
      } else if (modalMode === 'edit' && selectedOffer) {
        await updateOffer(selectedOffer._id, form);
        toast.success('Offer updated');
      }
      closeModal();
      setLoading(true);
      getOffers().then(setOffers).finally(() => setLoading(false));
    } catch (err: any) {
      toast.error(err.message || 'Failed to save offer');
    } finally {
      setFormLoading(false);
    }
  };
  const handleWithdraw = async (offer: any) => {
    if (!window.confirm('Withdraw this offer?')) return;
    try {
      await withdrawOffer(offer._id);
      toast.success('Offer withdrawn');
      setLoading(true);
      getOffers().then(setOffers).finally(() => setLoading(false));
    } catch (err: any) {
      toast.error(err.message || 'Failed to withdraw offer');
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "outline";
      case "accepted":
        return "default";
      case "declined":
        return "destructive";
      case "expired":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    return t[status as keyof typeof t] || status;
  };

  return (
    <RecruiterPortalLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t.title}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {t.description}
            </p>
          </div>
          <Button onClick={openCreateModal} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">New Offer</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-12">{t.loading}</div>
        ) : error ? (
          <div className="text-center text-destructive py-12">{error}</div>
        ) : offers.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">{t.empty}</div>
        ) : (
          <div className="grid gap-4">
            {offers.map((offer) => (
              <Card key={offer._id}>
                <CardHeader className="pb-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarImage src={"/placeholder.svg"} />
                        <AvatarFallback>
                          {offer.candidate?.Names
                            ? offer.candidate.Names.split(" ").map((n: string) => n[0]).join("")
                            : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg break-words">
                          {offer.candidate?.Names || "-"}
                        </CardTitle>
                        <CardDescription className="break-words">
                          {offer.job?.title || "-"}
                        </CardDescription>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                          <span className="flex items-center gap-1 text-sm">
                            <DollarSign className="h-4 w-4" />
                            {offer.salary}
                          </span>
                          <span className="flex items-center gap-1 text-sm">
                            <CalendarIcon className="h-4 w-4" />
                            {offer.startDate}
                          </span>

                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={getStatusVariant(offer.status)}
                      className="w-fit"
                    >
                      {getStatusLabel(offer.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      Sent: {offer.sentDate} • Expires: {offer.expiryDate}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => openEditModal(offer)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => handleWithdraw(offer)}
                      >
                        <span className="hidden sm:inline">{t.withdraw}</span>
                        <span className="sm:hidden">Withdraw</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle>{modalMode === 'create' ? 'Create Offer' : 'Edit Offer'}</DialogTitle>
                <DialogDescription>
                  Fill in the offer details below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Candidate</label>
                <Select value={form.candidate} onValueChange={v => handleFormChange('candidate', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((c: any) => (
                      <SelectItem key={c._id} value={c._id}>{c.Names} ({c.Email})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Job</label>
                <Select value={form.job} onValueChange={v => handleFormChange('job', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((j: any) => (
                      <SelectItem key={j._id} value={j._id}>{j.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Salary</label>
                <Input value={form.salary} onChange={e => handleFormChange('salary', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Start Date</label>
                <Calendar
                  mode="single"
                  selected={form.startDate ? new Date(form.startDate) : undefined}
                  onSelect={(date: Date | undefined) => handleDateChange('startDate', date)}
                  className="rounded-md border"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Sent Date</label>
                <Calendar
                  mode="single"
                  selected={form.sentDate ? new Date(form.sentDate) : undefined}
                  onSelect={(date: Date | undefined) => handleDateChange('sentDate', date)}
                  className="rounded-md border"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Expiry Date</label>
                <Calendar
                  mode="single"
                  selected={form.expiryDate ? new Date(form.expiryDate) : undefined}
                  onSelect={(date: Date | undefined) => handleDateChange('expiryDate', date)}
                  className="rounded-md border"
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={formLoading}>
                  {modalMode === 'create' ? 'Create' : 'Update'}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </RecruiterPortalLayout>
  );
}

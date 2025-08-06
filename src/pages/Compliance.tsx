/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Plus } from "lucide-react";
import {
  getPolicies,
  getAudits,
  getIncidents
} from "@/lib/api";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";
import { createPolicy, updatePolicy, deletePolicy, createAudit, updateAudit, deleteAudit, createIncident, updateIncident, deleteIncident } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

const Compliance = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Dynamic state for policies
  const [policies, setPolicies] = useState<any[]>([]);
  const [policiesLoading, setPoliciesLoading] = useState(false);
  const [policiesError, setPoliciesError] = useState<string | null>(null);

  // Dynamic state for audits
  const [audits, setAudits] = useState<any[]>([]);
  const [auditsLoading, setAuditsLoading] = useState(false);
  const [auditsError, setAuditsError] = useState<string | null>(null);

  // Dynamic state for incidents
  const [incidents, setIncidents] = useState<any[]>([]);
  const [incidentsLoading, setIncidentsLoading] = useState(false);
  const [incidentsError, setIncidentsError] = useState<string | null>(null);

  // Add state for modals (open/close, edit data, delete target)
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<any | null>(null);
  const [policyDeleteId, setPolicyDeleteId] = useState<string | null>(null);

  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [editingAudit, setEditingAudit] = useState<any | null>(null);
  const [auditDeleteId, setAuditDeleteId] = useState<string | null>(null);

  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<any | null>(null);
  const [incidentDeleteId, setIncidentDeleteId] = useState<string | null>(null);

  // Add/expand translation keys at the top
  const translations = {
    en: {
      allFieldsRequired: "All fields are required.",
      policyCreated: "Policy created successfully.",
      policyUpdated: "Policy updated successfully.",
      failedToSave: "Failed to save policy.",
      deletePolicyTitle: "Delete Policy",
      deletePolicyDesc: "Are you sure you want to delete this policy? This action cannot be undone.",
      policyDeleted: "Policy deleted successfully.",
      cancel: "Cancel",
      delete: "Delete",
      error: "Error",
    },
    fr: {
      allFieldsRequired: "Tous les champs sont requis.",
      policyCreated: "Politique créée avec succès.",
      policyUpdated: "Politique mise à jour avec succès.",
      failedToSave: "Échec de l'enregistrement de la politique.",
      deletePolicyTitle: "Supprimer la politique",
      deletePolicyDesc: "Êtes-vous sûr de vouloir supprimer cette politique ? Cette action ne peut pas être annulée.",
      policyDeleted: "Politique supprimée avec succès.",
      cancel: "Annuler",
      delete: "Supprimer",
      error: "Erreur",
    },
  };
  const { language } = useLanguage();
  const t = (key: keyof typeof translations.en) => translations[language][key] || translations.en[key];

  // Fetch policies
  useEffect(() => {
    setPoliciesLoading(true);
    getPolicies()
      .then((data) => {
        setPolicies(data);
        setPoliciesError(null);
      })
      .catch((err) => {
        setPoliciesError("Failed to load policies");
      })
      .finally(() => setPoliciesLoading(false));
  }, []);

  // Fetch audits
  useEffect(() => {
    setAuditsLoading(true);
    getAudits()
      .then((data) => {
        setAudits(data);
        setAuditsError(null);
      })
      .catch((err) => {
        setAuditsError("Failed to load audits");
      })
      .finally(() => setAuditsLoading(false));
  }, []);

  // Fetch incidents
  useEffect(() => {
    setIncidentsLoading(true);
    getIncidents()
      .then((data) => {
        setIncidents(data);
        setIncidentsError(null);
      })
      .catch((err) => {
        setIncidentsError("Failed to load incidents");
      })
      .finally(() => setIncidentsLoading(false));
  }, []);

  // Placeholder for compliance overview (can be made dynamic later)
  const complianceOverview = {
    totalPolicies: policies.length,
    compliantPolicies: policies.filter((p) => p.status === "Compliant").length,
    pendingReviews: policies.filter((p) => p.status === "Review Required").length,
    overduePolicies: policies.filter((p) => p.status === "Overdue").length,
    complianceScore: policies.length ? Math.round((policies.filter((p) => p.status === "Compliant").length / policies.length) * 100) : 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Compliant": case "Completed": case "Resolved": case "Nearly Complete": return "bg-green-100 text-green-800";
      case "Review Required": case "In Progress": case "Investigating": case "Under Review": case "Active": return "bg-yellow-100 text-yellow-800";
      case "Overdue": case "Scheduled": return "bg-blue-100 text-blue-800";
      case "Non-Compliant": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Compliance</h1>
          <p className="text-muted-foreground">Monitor policies, audits, and regulatory compliance</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Policy
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="audits">Audits</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Compliance Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Compliance Score</span>
              </CardTitle>
              <CardDescription>Overall compliance health of the organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">{complianceOverview.complianceScore}%</div>
                  <p className="text-sm text-muted-foreground">Overall Compliance Score</p>
                </div>
                <Progress value={complianceOverview.complianceScore} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{complianceOverview.totalPolicies}</div>
                <p className="text-xs text-muted-foreground">Active policies</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliant</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{complianceOverview.compliantPolicies}</div>
                <p className="text-xs text-muted-foreground">Up to date policies</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{complianceOverview.pendingReviews}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{complianceOverview.overduePolicies}</div>
                <p className="text-xs text-muted-foreground">Need immediate action</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <div className="space-y-4">
            {policiesLoading && <p>Loading policies...</p>}
            {policiesError && <p className="text-red-500">{policiesError}</p>}
            {policies.length === 0 && !policiesLoading && !policiesError && (
              <p>No policies found. Add a new one!</p>
            )}
            {policies.map((policy) => (
              <Card key={policy.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">{policy.name}</h3>
                        <Badge variant="outline">v{policy.version}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{policy.category}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Owner:</span>
                          <p className="text-muted-foreground">{policy.owner}</p>
                        </div>
                        <div>
                          <span className="font-medium">Last Reviewed:</span>
                          <p className="text-muted-foreground">{new Date(policy.lastReviewed).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Next Review:</span>
                          <p className="text-muted-foreground">{new Date(policy.nextReview).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <Badge className={getStatusColor(policy.status)}>
                        {policy.status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm"  onClick={() => setPolicyDeleteId(policy._id)}>{t("delete")}</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audits" className="space-y-4">
          <div className="space-y-4">
            {auditsLoading && <p>Loading audits...</p>}
            {auditsError && <p className="text-red-500">{auditsError}</p>}
            {audits.length === 0 && !auditsLoading && !auditsError && (
              <p>No audits found. Add a new one!</p>
            )}
            {audits.map((audit) => (
              <Card key={audit.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">{audit.name}</h3>
                        <Badge variant="outline">{audit.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Auditor: {audit.auditor}</p>
                      <p className="text-sm">{audit.scope}</p>
                      <div className="text-sm text-muted-foreground">
                        Duration: {new Date(audit.startDate).toLocaleDateString()} - {new Date(audit.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <Badge className={getStatusColor(audit.status)}>
                        {audit.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <div className="space-y-4">
            <p>Training content will be added here.</p>
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <div className="space-y-4">
            {incidentsLoading && <p>Loading incidents...</p>}
            {incidentsError && <p className="text-red-500">{incidentsError}</p>}
            {incidents.length === 0 && !incidentsLoading && !incidentsError && (
              <p>No incidents found. Add a new one!</p>
            )}
            {incidents.map((incident) => (
              <Card key={incident.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        <h3 className="text-lg font-semibold">{incident.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <Badge variant="outline">{incident.category}</Badge>
                        <span>Assigned to: {incident.assignedTo}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Reported: {new Date(incident.reportedDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* --- Policy Modal --- */}
      <Dialog open={policyModalOpen} onOpenChange={setPolicyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPolicy ? 'Edit Policy' : 'New Policy'}</DialogTitle>
            <DialogDescription>Enter policy details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const data = {
              title: formData.get('title'),
              description: formData.get('description'),
              effectiveDate: formData.get('effectiveDate'),
            };
            try {
              if (!data.title || !data.description || !data.effectiveDate) {
                toast.error(t("allFieldsRequired"));
                return;
              }
              if (editingPolicy) {
                await updatePolicy(editingPolicy._id, data);
                toast.success(t("policyUpdated"));
              } else {
                await createPolicy(data);
                toast.success(t("policyCreated"));
              }
              setPolicyModalOpen(false);
              setEditingPolicy(null);
              // Refresh policies
              setPoliciesLoading(true);
              getPolicies().then(setPolicies).finally(() => setPoliciesLoading(false));
            } catch (err) {
              toast.error(t("failedToSave"));
            }
          }}>
            <input name="title" placeholder="Title" defaultValue={editingPolicy?.title || ''} required className="input mb-2 w-full" />
            <textarea name="description" placeholder="Description" defaultValue={editingPolicy?.description || ''} required className="input mb-2 w-full" />
            <input name="effectiveDate" type="date" defaultValue={editingPolicy?.effectiveDate?.slice(0,10) || ''} required className="input mb-4 w-full" />
            <DialogFooter>
              <Button type="submit">{editingPolicy ? 'Update' : 'Create'}</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!policyDeleteId} onOpenChange={open => !open && setPolicyDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deletePolicyTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deletePolicyDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPolicyDeleteId(null)}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={async () => {
              try {
                await deletePolicy(policyDeleteId);
                toast.success(t("policyDeleted"));
                setPolicyDeleteId(null);
                setPoliciesLoading(true);
                getPolicies().then(setPolicies).finally(() => setPoliciesLoading(false));
              } catch {
                toast.error(t("failedToSave"));
              }
            }}>{t("delete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* --- Audit Modal --- */}
      <Dialog open={auditModalOpen} onOpenChange={setAuditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAudit ? 'Edit Audit' : 'New Audit'}</DialogTitle>
            <DialogDescription>Enter audit details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const data = {
              title: formData.get('title'),
              description: formData.get('description'),
              auditDate: formData.get('auditDate'),
              status: formData.get('status'),
            };
            try {
              if (!data.title || !data.description || !data.auditDate) {
                toast.error(t("allFieldsRequired"));
                return;
              }
              if (editingAudit) {
                await updateAudit(editingAudit._id, data);
                toast.success('Audit updated');
              } else {
                await createAudit(data);
                toast.success('Audit created');
              }
              setAuditModalOpen(false);
              setEditingAudit(null);
              setAuditsLoading(true);
              getAudits().then(setAudits).finally(() => setAuditsLoading(false));
            } catch (err) {
              toast.error('Failed to save audit');
            }
          }}>
            <input name="title" placeholder="Title" defaultValue={editingAudit?.title || ''} required className="input mb-2 w-full" />
            <textarea name="description" placeholder="Description" defaultValue={editingAudit?.description || ''} required className="input mb-2 w-full" />
            <input name="auditDate" type="date" defaultValue={editingAudit?.auditDate?.slice(0,10) || ''} required className="input mb-2 w-full" />
            <select name="status" defaultValue={editingAudit?.status || 'planned'} required className="input mb-4 w-full">
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <DialogFooter>
              <Button type="submit">{editingAudit ? 'Update' : 'Create'}</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!auditDeleteId} onOpenChange={open => !open && setAuditDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Audit?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAuditDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => {
              try {
                await deleteAudit(auditDeleteId);
                toast.success('Audit deleted');
                setAuditDeleteId(null);
                setAuditsLoading(true);
                getAudits().then(setAudits).finally(() => setAuditsLoading(false));
              } catch {
                toast.error('Failed to delete audit');
              }
            }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* --- Incident Modal --- */}
      <Dialog open={incidentModalOpen} onOpenChange={setIncidentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingIncident ? 'Edit Incident' : 'New Incident'}</DialogTitle>
            <DialogDescription>Enter incident details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const data = {
              title: formData.get('title'),
              description: formData.get('description'),
              incidentDate: formData.get('incidentDate'),
              status: formData.get('status'),
            };
            try {
              if (!data.title || !data.description || !data.incidentDate) {
                toast.error(t("allFieldsRequired"));
                return;
              }
              if (editingIncident) {
                await updateIncident(editingIncident._id, data);
                toast.success('Incident updated');
              } else {
                await createIncident(data);
                toast.success('Incident created');
              }
              setIncidentModalOpen(false);
              setEditingIncident(null);
              setIncidentsLoading(true);
              getIncidents().then(setIncidents).finally(() => setIncidentsLoading(false));
            } catch (err) {
              toast.error('Failed to save incident');
            }
          }}>
            <input name="title" placeholder="Title" defaultValue={editingIncident?.title || ''} required className="input mb-2 w-full" />
            <textarea name="description" placeholder="Description" defaultValue={editingIncident?.description || ''} required className="input mb-2 w-full" />
            <input name="incidentDate" type="date" defaultValue={editingIncident?.incidentDate?.slice(0,10) || ''} required className="input mb-2 w-full" />
            <select name="status" defaultValue={editingIncident?.status || 'open'} required className="input mb-4 w-full">
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <DialogFooter>
              <Button type="submit">{editingIncident ? 'Update' : 'Create'}</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!incidentDeleteId} onOpenChange={open => !open && setIncidentDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Incident?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIncidentDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => {
              try {
                await deleteIncident(incidentDeleteId);
                toast.success('Incident deleted');
                setIncidentDeleteId(null);
                setIncidentsLoading(true);
                getIncidents().then(setIncidents).finally(() => setIncidentsLoading(false));
              } catch {
                toast.error('Failed to delete incident');
              }
            }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Compliance;
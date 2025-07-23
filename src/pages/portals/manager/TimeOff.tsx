/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { ManagerPortalLayout } from "@/components/layouts/ManagerPortalLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Check, X, Clock, Users } from "lucide-react";
import { getLeaves, getTeamMembers, approveLeave, rejectLeave, getEmployees, requestLeave } from '@/lib/api';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const timeOffTranslations = {
  en: {
    manager: {
      timeoff: "Time Off",
      timeoffDesc: "Manage team time off requests and leave schedules",
      viewTeamCalendar: "View Team Calendar",
      calendar: "Calendar",
      pendingRequests: "Pending Requests",
      awaitingApproval: "Awaiting approval",
      teamAvailable: "Team Available",
      outOfMembers: "Out of 12 members",
      thisMonth: "This Month",
      daysRequested: "Days requested",
      coverage: "Coverage",
      adequatelyCovered: "Adequately covered",
      pendingApprovalRequests: "Pending Approval Requests",
      timeoffApprovalDesc: "Time off requests requiring your approval",
      approve: "Approve",
      reject: "Reject",
      submitted: "Submitted",
      teamLeaveCalendar: "Team Leave Calendar",
      upcomingTimeoff: "Upcoming time off for your team members",
      teamLeaveBalances: "Team Leave Balances",
      remainingLeaveDays: "Remaining leave days for team members",
      annualLeave: "Annual Leave",
      sickLeave: "Sick Leave",
      days: "days",
      leavePolicies: "Leave Policies & Guidelines",
      currentPolicies: "Current time off policies and approval workflows",
      annualLeavePolicy: [
        "• 25 days per year",
        "• Minimum 2 weeks advance notice",
        "• Maximum 10 consecutive days",
        "• Subject to business needs",
      ],
      sickLeavePolicy: [
        "• 10 days per year",
        "• Medical certificate required (3+ days)",
        "• Notify manager within 24 hours",
        "• Unused days don't roll over",
      ],
    },
  },
  fr: {
    manager: {
      timeoff: "Congés",
      timeoffDesc:
        "Gérez les demandes de congé et les plannings d'absence de l'équipe",
      viewTeamCalendar: "Voir le calendrier de l'équipe",
      calendar: "Calendrier",
      pendingRequests: "Demandes en attente",
      awaitingApproval: "En attente d'approbation",
      teamAvailable: "Équipe disponible",
      outOfMembers: "Sur 12 membres",
      thisMonth: "Ce mois-ci",
      daysRequested: "Jours demandés",
      coverage: "Couverture",
      adequatelyCovered: "Couverture adéquate",
      pendingApprovalRequests: "Demandes en attente d'approbation",
      timeoffApprovalDesc: "Demandes de congé nécessitant votre approbation",
      approve: "Approuver",
      reject: "Rejeter",
      submitted: "Soumis",
      teamLeaveCalendar: "Calendrier des absences de l'équipe",
      upcomingTimeoff: "Absences à venir pour les membres de votre équipe",
      teamLeaveBalances: "Soldes de congés de l'équipe",
      remainingLeaveDays: "Jours de congé restants pour les membres",
      annualLeave: "Congé annuel",
      sickLeave: "Congé maladie",
      days: "jours",
      leavePolicies: "Politiques et directives de congé",
      currentPolicies: "Politiques de congé et processus d'approbation actuels",
      annualLeavePolicy: [
        "• 25 jours par an",
        "• Préavis minimum de 2 semaines",
        "• Maximum 10 jours consécutifs",
        "• Sous réserve des besoins de l'entreprise",
      ],
      sickLeavePolicy: [
        "• 10 jours par an",
        "• Certificat médical requis (3+ jours)",
        "• Prévenir le manager sous 24h",
        "• Les jours non utilisés ne sont pas reportés",
      ],
    },
  },
};

const TimeOff = () => {
  const { language } = useLanguage();
  const t = (key: string) => {
    const keys = key.split(".");
    let value: any = timeOffTranslations[language]?.manager;
    for (const k of keys.slice(1)) {
      value = value?.[k];
    }
    return value ?? key;
  };

  // State for each section
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingError, setPendingError] = useState<string | null>(null);

  const [teamCalendar, setTeamCalendar] = useState<any[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  const [leaveBalances, setLeaveBalances] = useState<any[]>([]);
  const [balancesLoading, setBalancesLoading] = useState(true);
  const [balancesError, setBalancesError] = useState<string | null>(null);

  const [overviewStats, setOverviewStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const { user } = useAuth();
  const managerId = user?._id;

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [form, setForm] = useState({ employee: '', type: 'Annual', startDate: '', endDate: '', reason: '' });
  const [formLoading, setFormLoading] = useState(false);

  // Fetch all data on mount
  useEffect(() => {
    setPendingLoading(true);
    setPendingError(null);
    getLeaves()
      .then(data => setPendingRequests((data || []).filter((r: any) => r.status === 'Pending')))
      .catch(() => setPendingError('Failed to load pending requests.'))
      .finally(() => setPendingLoading(false));

    setCalendarLoading(true);
    setCalendarError(null);
    getTeamMembers(managerId)
      .then(data => setTeamCalendar(Array.isArray(data) ? data : []))
      .catch(() => setTeamCalendar([]))
      .finally(() => setCalendarLoading(false));

    setBalancesLoading(true);
    setBalancesError(null);
    getTeamMembers(managerId)
      .then(data => setLeaveBalances(Array.isArray(data) ? data : []))
      .catch(() => setLeaveBalances([]))
      .finally(() => setBalancesLoading(false));

    setStatsLoading(false);
  }, [managerId]);

  useEffect(() => {
    getEmployees()
      .then(res => {
        const employeesArr = Array.isArray(res) ? res : res.data || [];
        setEmployees(employeesArr);
      })
      .catch(() => setEmployees([]));
  }, []);

  // Approve/Reject handlers (mocked)
  const handleApprove = async (id: string) => {
    try {
      await approveLeave(id);
      setPendingRequests(prev => prev.filter((req: any) => req._id !== id));
      toast({ title: 'Request approved' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to approve', variant: 'destructive' });
    }
  };
  const handleReject = async (id: string) => {
    try {
      await rejectLeave(id);
      setPendingRequests(prev => prev.filter((req: any) => req._id !== id));
      toast({ title: 'Request rejected' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to reject', variant: 'destructive' });
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await requestLeave(form);
      toast({ title: 'Time off requested' });
      setShowRequestModal(false);
      setForm({ employee: '', type: 'Annual', startDate: '', endDate: '', reason: '' });
      // fetchDocuments(); // or refetch leaves if needed
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to request time off', variant: 'destructive' });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <ManagerPortalLayout>
      <div className="space-y-4 md:space-y-6 p-2 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t("manager.timeoff")}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {t("manager.timeoffDesc")}
            </p>
          </div>
          <Button className="flex items-center gap-2 w-full sm:w-auto">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t("manager.viewTeamCalendar")}
            </span>
            <span className="sm:hidden">{t("manager.calendar")}</span>
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Pending Requests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("manager.pendingRequests")}
              </CardTitle>
              <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="animate-pulse h-6 w-8 bg-muted rounded" />
              ) : statsError ? (
                <div className="text-xs text-red-500">{statsError}</div>
              ) : (
                <div className="text-xl md:text-2xl font-bold">{overviewStats?.pendingRequests}</div>
              )}
              <p className="text-xs text-muted-foreground">
                {t("manager.awaitingApproval")}
              </p>
            </CardContent>
          </Card>
          {/* Team Available */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("manager.teamAvailable")}
              </CardTitle>
              <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="animate-pulse h-6 w-8 bg-muted rounded" />
              ) : statsError ? (
                <div className="text-xs text-red-500">{statsError}</div>
              ) : (
                <div className="text-xl md:text-2xl font-bold">{overviewStats?.teamAvailable}</div>
              )}
              <p className="text-xs text-muted-foreground">
                {t("manager.outOfMembers")}
              </p>
            </CardContent>
          </Card>
          {/* This Month */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("manager.thisMonth")}
              </CardTitle>
              <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="animate-pulse h-6 w-8 bg-muted rounded" />
              ) : statsError ? (
                <div className="text-xs text-red-500">{statsError}</div>
              ) : (
                <div className="text-xl md:text-2xl font-bold">{overviewStats?.daysRequested}</div>
              )}
              <p className="text-xs text-muted-foreground">
                {t("manager.daysRequested")}
              </p>
            </CardContent>
          </Card>
          {/* Coverage */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("manager.coverage")}
              </CardTitle>
              <Check className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="animate-pulse h-6 w-8 bg-muted rounded" />
              ) : statsError ? (
                <div className="text-xs text-red-500">{statsError}</div>
              ) : (
                <div className="text-xl md:text-2xl font-bold text-green-600">{overviewStats?.coverage}%</div>
              )}
              <p className="text-xs text-muted-foreground">
                {t("manager.adequatelyCovered")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {t("manager.pendingApprovalRequests")}
            </CardTitle>
            <CardDescription>
              {t("manager.timeoffApprovalDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingLoading ? (
              <div className="animate-pulse h-8 w-full bg-muted rounded" />
            ) : pendingError ? (
              <div className="text-xs text-red-500">{pendingError}</div>
            ) : pendingRequests.length === 0 ? (
              <div className="text-muted-foreground text-sm">No pending requests.</div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium">
                          {request.employee
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium">{request.employee}</h3>
                        <p className="text-sm text-muted-foreground">{request.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.startDate} to {request.endDate} ({request.days} {t("manager.days")})
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-medium">{request.reason}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("manager.submitted")}: {request.submitted}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(request._id)}
                      >
                        <Check className="h-4 w-4" />
                        <span className="hidden sm:inline ml-1">{t("manager.approve")}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(request._id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="hidden sm:inline ml-1">{t("manager.reject")}</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Calendar Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {t("manager.teamLeaveCalendar")}
            </CardTitle>
            <CardDescription>{t("manager.upcomingTimeoff")}</CardDescription>
          </CardHeader>
          <CardContent>
            {calendarLoading ? (
              <div className="animate-pulse h-8 w-full bg-muted rounded" />
            ) : calendarError ? (
              <div className="text-xs text-red-500">{calendarError}</div>
            ) : Array.isArray(teamCalendar) && teamCalendar.length === 0 ? (
              <div className="text-muted-foreground text-sm">No upcoming leaves.</div>
            ) : (
              <div className="space-y-4">
                {Array.isArray(teamCalendar) && teamCalendar.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-sm font-medium text-center flex-shrink-0">
                        {item.date}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium">{item.employee}</h3>
                        <p className="text-sm text-muted-foreground">{item.type}</p>
                      </div>
                    </div>
                    <Badge
                      variant={item.status === "Away" ? "destructive" : "default"}
                      className="self-start sm:self-center"
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Leave Balances */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {t("manager.teamLeaveBalances")}
            </CardTitle>
            <CardDescription>{t("manager.remainingLeaveDays")}</CardDescription>
          </CardHeader>
          <CardContent>
            {balancesLoading ? (
              <div className="animate-pulse h-8 w-full bg-muted rounded" />
            ) : balancesError ? (
              <div className="text-xs text-red-500">{balancesError}</div>
            ) : Array.isArray(leaveBalances) && leaveBalances.length === 0 ? (
              <div className="text-muted-foreground text-sm">No leave balances found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.isArray(leaveBalances) && leaveBalances.map((item, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <h3 className="font-medium">{item.employee}</h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{t("manager.annualLeave")}</span>
                        <span>{item.annualLeave}/25 {t("manager.days")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{t("manager.sickLeave")}</span>
                        <span>{item.sickLeave}/10 {t("manager.days")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leave Policies */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {t("manager.leavePolicies")}
            </CardTitle>
            <CardDescription>{t("manager.currentPolicies")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">{t("manager.annualLeave")}</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {t("manager.annualLeavePolicy").map((policy: string, idx: number) => (
                    <li key={idx}>{policy}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">{t("manager.sickLeave")}</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {t("manager.sickLeavePolicy").map((policy: string, idx: number) => (
                    <li key={idx}>{policy}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        <Button onClick={() => setShowRequestModal(true)} className="mb-4">Submit Time Off for Employee</Button>
        <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Time Off for Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRequestSubmit} className="space-y-3">
              <div>
                <label className="block font-medium mb-1">Employee</label>
                <Select value={form.employee} onValueChange={v => setForm(f => ({ ...f, employee: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                  <SelectContent>
                    {Array.isArray(employees) && employees.map(emp => (
                      <SelectItem key={emp._id} value={emp._id}>{emp.Names}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block font-medium mb-1">Type</label>
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Annual">Annual</SelectItem>
                    <SelectItem value="Sick">Sick</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block font-medium mb-1">Start Date</label>
                <Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} required />
              </div>
              <div>
                <label className="block font-medium mb-1">End Date</label>
                <Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} required />
              </div>
              <div>
                <label className="block font-medium mb-1">Reason</label>
                <Input value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} required />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={formLoading}>{formLoading ? 'Submitting...' : 'Submit'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </ManagerPortalLayout>
  );
};

export default TimeOff;

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
import {
  TrendingUp,
  Target,
  Star,
  Calendar,
  Users,
  BarChart,
} from "lucide-react";
import {apiFetch} from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { useAuth } from '@/contexts/AuthContext';

const translations = {
  en: {
    performance: "Performance",
    trackManage: "Track and manage team performance and reviews",
    report: "Report",
    performanceReport: "Performance Report",
    teamAvgScore: "Team Avg Score",
    teamAvgScoreChange: "+3 from last quarter",
    goalsCompleted: "Goals Completed",
    goalsCompletedRate: "80% completion rate",
    highPerformers: "High Performers",
    highPerformersRate: "25% of team",
    reviewsDue: "Reviews Due",
    reviewsDueMonth: "This month",
    teamPerformanceOverview: "Team Performance Overview",
    individualScores: "Individual performance scores and goal progress",
    exceeds: "Exceeds Expectations",
    meets: "Meets Expectations",
    needs: "Needs Improvement",
    exceedsShort: "Exceeds",
    meetsShort: "Meets",
    needsShort: "Needs Work",
    review: "Review",
    upcomingReviews: "Upcoming Performance Reviews",
    scheduledReviews: "Scheduled performance reviews requiring your attention",
    dueDate: "Due date",
    schedule: "Schedule",
    performanceTrends: "Performance Trends",
    teamPerformanceOverTime: "Team performance over time",
    developmentAreas: "Development Areas",
    improvementOpportunities: "Common improvement opportunities",
    technicalSkills: "Technical Skills",
    technicalSkillsDesc: "3 team members need technical training",
    communication: "Communication",
    communicationDesc: "Focus area for 2 team members",
    leadership: "Leadership",
    leadershipDesc: "Development opportunity for senior staff",
    managementTools: "Performance Management Tools",
    managementActions: "Tools and actions for managing team performance",
    setGoals: "Set Goals",
    scheduleReview: "Schedule Review",
    oneOnOne: "1-on-1 Meeting",
    recognition: "Recognition",
    goals: "Goals",
    goalsLabel: "Goals",
  },
  fr: {
    performance: "Performance",
    trackManage:
      "Suivre et gérer la performance et les évaluations de l'équipe",
    report: "Rapport",
    performanceReport: "Rapport de performance",
    teamAvgScore: "Score moyen équipe",
    teamAvgScoreChange: "+3 par rapport au dernier trimestre",
    goalsCompleted: "Objectifs terminés",
    goalsCompletedRate: "80% de réalisation",
    highPerformers: "Meilleurs éléments",
    highPerformersRate: "25% de l'équipe",
    reviewsDue: "Évaluations à venir",
    reviewsDueMonth: "Ce mois-ci",
    teamPerformanceOverview: "Vue d'ensemble de la performance de l'équipe",
    individualScores: "Scores individuels et progression des objectifs",
    exceeds: "Dépasse les attentes",
    meets: "Répond aux attentes",
    needs: "À améliorer",
    exceedsShort: "Dépasse",
    meetsShort: "Répond",
    needsShort: "À revoir",
    review: "Évaluer",
    upcomingReviews: "Évaluations de performance à venir",
    scheduledReviews: "Évaluations programmées nécessitant votre attention",
    dueDate: "Date d'échéance",
    schedule: "Planifier",
    performanceTrends: "Tendances de performance",
    teamPerformanceOverTime: "Performance de l'équipe au fil du temps",
    developmentAreas: "Axes de développement",
    improvementOpportunities: "Opportunités d'amélioration courantes",
    technicalSkills: "Compétences techniques",
    technicalSkillsDesc: "3 membres ont besoin de formation technique",
    communication: "Communication",
    communicationDesc: "Axe d'amélioration pour 2 membres",
    leadership: "Leadership",
    leadershipDesc: "Opportunité de développement pour les seniors",
    managementTools: "Outils de gestion de la performance",
    managementActions:
      "Outils et actions pour gérer la performance de l'équipe",
    setGoals: "Définir des objectifs",
    scheduleReview: "Planifier une évaluation",
    oneOnOne: "Entretien individuel",
    recognition: "Reconnaissance",
    goals: "Objectifs",
    goalsLabel: "Objectifs",
  },
};

const Performance = () => {
  const { language } = useLanguage();
  const t = (key: keyof (typeof translations)["en"]) => translations[language][key];

  // State for each section
  const [overview, setOverview] = useState<any>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);

  const [team, setTeam] = useState<any[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState<string | null>(null);

  const [upcomingReviews, setUpcomingReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const [trends, setTrends] = useState<any[]>([]);
  const [trendsLoading, setTrendsLoading] = useState(true);
  const [trendsError, setTrendsError] = useState<string | null>(null);

  const [devAreas, setDevAreas] = useState<any[]>([]);
  const [devAreasLoading, setDevAreasLoading] = useState(true);
  const [devAreasError, setDevAreasError] = useState<string | null>(null);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    employee: "",
    period: "",
    rating: "",
    comments: "",
    goals: ""
  });
  const [reviewFormError, setReviewFormError] = useState<string | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const { user } = useAuth();
  const managerId = user?._id;

  useEffect(() => {
    setOverviewLoading(true);
    setOverviewError(null);
    apiFetch(`/performance-review/manager/overview?manager=${managerId}`)
      .then((data) => setOverview(data))
      .catch(() => setOverviewError("Failed to load overview."))
      .finally(() => setOverviewLoading(false));

    setTeamLoading(true);
    setTeamError(null);
    apiFetch(`/performance-review/manager/team?manager=${managerId}`)
      .then((data) => setTeam(data))
      .catch(() => setTeamError("Failed to load team details."))
      .finally(() => setTeamLoading(false));

    setReviewsLoading(true);
    setReviewsError(null);
    apiFetch(`/performance-review/manager/upcoming-reviews?manager=${managerId}`)
      .then((data) => setUpcomingReviews(data))
      .catch(() => setReviewsError("Failed to load upcoming reviews."))
      .finally(() => setReviewsLoading(false));

    setTrendsLoading(true);
    setTrendsError(null);
    apiFetch(`/performance-review/manager/trends?manager=${managerId}`)
      .then((data) => setTrends(data))
      .catch(() => setTrendsError("Failed to load trends."))
      .finally(() => setTrendsLoading(false));

    setDevAreasLoading(true);
    setDevAreasError(null);
    apiFetch(`/performance-review/manager/development-areas?manager=${managerId}`)
      .then((data) => setDevAreas(data))
      .catch(() => setDevAreasError("Failed to load development areas."))
      .finally(() => setDevAreasLoading(false));
  }, [managerId]);

  return (
    <ManagerPortalLayout>
      <div className="space-y-4 md:space-y-6 p-2 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t("performance")}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {t("trackManage")}
            </p>
          </div>
          <Button className="flex items-center gap-2 w-full sm:w-auto" onClick={() => setReviewModalOpen(true)}>
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">{t("performanceReport")}</span>
            <span className="sm:hidden">{t("report")}</span>
          </Button>
          <Button className="flex items-center gap-2 w-full sm:w-auto bg-primary text-white" onClick={() => setReviewModalOpen(true)}>
            <Star className="h-4 w-4" />
            <span>New Performance Review</span>
          </Button>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {overviewLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse h-24" />
            ))
          ) : overviewError ? (
            <div className="col-span-4 text-red-500 text-sm">{overviewError}</div>
          ) : overview ? (
            <>
              <Card key={overview.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">{t("teamAvgScore")}</CardTitle>
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">{overview.teamAvgScore}</div>
                  <p className="text-xs text-muted-foreground">{t("teamAvgScoreChange")}</p>
                </CardContent>
              </Card>
              <Card key={overview.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">{t("goalsCompleted")}</CardTitle>
                  <Target className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">{overview.goalsCompleted}/{overview.totalGoals}</div>
                  <p className="text-xs text-muted-foreground">{t("goalsCompletedRate")}</p>
                </CardContent>
              </Card>
              <Card key={overview.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">{t("highPerformers")}</CardTitle>
                  <Star className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">{overview.highPerformers}</div>
                  <p className="text-xs text-muted-foreground">{t("highPerformersRate")}</p>
                </CardContent>
              </Card>
              <Card key={overview.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">{t("reviewsDue")}</CardTitle>
                  <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">{overview.reviewsDue}</div>
                  <p className="text-xs text-muted-foreground">{t("reviewsDueMonth")}</p>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>

        {/* Individual Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">{t("teamPerformanceOverview")}</CardTitle>
            <CardDescription>{t("individualScores")}</CardDescription>
          </CardHeader>
          <CardContent>
            {teamLoading ? (
              <div className="animate-pulse h-8 w-full bg-muted rounded" />
            ) : teamError ? (
              <div className="text-xs text-red-500">{teamError}</div>
            ) : team.length === 0 ? (
              <div className="text-muted-foreground text-sm">No team data found.</div>
            ) : (
              <div className="space-y-4">
                {team.map((member) => (
                  <div key={member.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium">{member.name.split(" ").map((n: string) => n[0]).join("")}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{member.currentScore}</div>
                      <p className="text-xs text-muted-foreground">{member.currentScore > member.lastScore ? "+" : ""}{member.currentScore - member.lastScore}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-medium">{member.goalsCompleted}/{member.goals}</div>
                      <p className="text-xs text-muted-foreground">{t("goalsLabel")}</p>
                    </div>
                    <Badge variant={member.status === "Exceeds Expectations" ? "default" : member.status === "Meets Expectations" ? "secondary" : "destructive"} className="text-xs">
                      <span className="hidden sm:inline">{member.status}</span>
                      <span className="sm:hidden">{member.status === "Exceeds Expectations" ? t("exceedsShort") : member.status === "Meets Expectations" ? t("meetsShort") : t("needsShort")}</span>
                    </Badge>
                    <Button variant="outline" size="sm" className="text-xs">{t("review")}</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Calendar className="h-5 w-5" />
              {t("upcomingReviews")}
            </CardTitle>
            <CardDescription>{t("scheduledReviews")}</CardDescription>
          </CardHeader>
          <CardContent>
            {reviewsLoading ? (
              <div className="animate-pulse h-8 w-full bg-muted rounded" />
            ) : reviewsError ? (
              <div className="text-xs text-red-500">{reviewsError}</div>
            ) : upcomingReviews.length === 0 ? (
              <div className="text-muted-foreground text-sm">No upcoming reviews found.</div>
            ) : (
              <div className="space-y-4">
                {upcomingReviews.map((review, index) => (
                  <div key={review.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium">{review.name}</h3>
                        <p className="text-sm text-muted-foreground">{review.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-left sm:text-right">
                        <p className="text-sm font-medium">{review.date}</p>
                        <p className="text-xs text-muted-foreground">{t("dueDate")}</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs">{t("schedule")}</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">{t("performanceTrends")}</CardTitle>
            <CardDescription>{t("teamPerformanceOverTime")}</CardDescription>
          </CardHeader>
          <CardContent>
            {trendsLoading ? (
              <div className="animate-pulse h-8 w-full bg-muted rounded" />
            ) : trendsError ? (
              <div className="text-xs text-red-500">{trendsError}</div>
            ) : trends.length === 0 ? (
              <div className="text-muted-foreground text-sm">No trend data found.</div>
            ) : (
              <div className="space-y-4">
                {trends.map((trend, idx) => (
                  <div key={trend.id} className="flex justify-between items-center">
                    <span className="text-sm">{trend.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-secondary rounded-full">
                        <div className="h-2 bg-primary rounded-full" style={{ width: `${trend.value * 2}px` }}></div>
                      </div>
                      <span className="text-sm">{trend.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Development Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">{t("developmentAreas")}</CardTitle>
            <CardDescription>{t("improvementOpportunities")}</CardDescription>
          </CardHeader>
          <CardContent>
            {devAreasLoading ? (
              <div className="animate-pulse h-8 w-full bg-muted rounded" />
            ) : devAreasError ? (
              <div className="text-xs text-red-500">{devAreasError}</div>
            ) : devAreas.length === 0 ? (
              <div className="text-muted-foreground text-sm">No development areas found.</div>
            ) : (
              <div className="space-y-4">
                {devAreas.map((area, idx) => (
                  <div key={area.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-800 text-sm">{area.area}</h3>
                    <p className="text-sm text-blue-700">{area.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {t("managementTools")}
            </CardTitle>
            <CardDescription>{t("managementActions")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Target className="h-6 w-6" />
                <span className="text-xs text-center">{t("setGoals")}</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Calendar className="h-6 w-6" />
                <span className="text-xs text-center">
                  {t("scheduleReview")}
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <TrendingUp className="h-6 w-6" />
                <span className="text-xs text-center">{t("oneOnOne")}</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Star className="h-6 w-6" />
                <span className="text-xs text-center">{t("recognition")}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Performance Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Select value={reviewForm.employee} onValueChange={val => setReviewForm(f => ({ ...f, employee: val }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                {team.map(emp => (
                  <SelectItem key={emp._id} value={emp._id}>{emp.Names}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Review Period (e.g. Q1 2024)"
              value={reviewForm.period}
              onChange={e => setReviewForm(f => ({ ...f, period: e.target.value }))}
            />
            <Select value={reviewForm.rating} onValueChange={val => setReviewForm(f => ({ ...f, rating: val }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exceeds">Exceeds Expectations</SelectItem>
                <SelectItem value="meets">Meets Expectations</SelectItem>
                <SelectItem value="needs">Needs Improvement</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Comments"
              value={reviewForm.comments}
              onChange={e => setReviewForm(f => ({ ...f, comments: e.target.value }))}
              rows={3}
            />
            <Textarea
              placeholder="Goals for next period"
              value={reviewForm.goals}
              onChange={e => setReviewForm(f => ({ ...f, goals: e.target.value }))}
              rows={2}
            />
            {reviewFormError && <div className="text-red-600 text-sm">{reviewFormError}</div>}
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                // Validation
                if (!reviewForm.employee || !reviewForm.period.trim() || !reviewForm.rating || !reviewForm.comments.trim() || !reviewForm.goals.trim()) {
                  setReviewFormError("All fields are required.");
                  return;
                }
                setReviewFormError(null);
                setReviewLoading(true);
                try {
                  await axios.post("/performance-reviews/create", {
                    employee: reviewForm.employee,
                    period: reviewForm.period,
                    rating: reviewForm.rating,
                    comments: reviewForm.comments,
                    goals: reviewForm.goals
                  });
                  toast({ title: "Performance review submitted" });
                  setReviewModalOpen(false);
                  setReviewForm({ employee: "", period: "", rating: "", comments: "", goals: "" });
                  // Optionally refresh reviews here
                } catch (err: any) {
                  toast({ title: "Error", description: err.response?.data?.message || err.message || "Failed to submit review", variant: "destructive" });
                } finally {
                  setReviewLoading(false);
                }
              }}
              disabled={reviewLoading}
            >
              {reviewLoading ? "Submitting..." : "Submit Review"}
            </Button>
            <Button variant="outline" onClick={() => setReviewModalOpen(false)} disabled={reviewLoading}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ManagerPortalLayout>
  );
};

export default Performance;

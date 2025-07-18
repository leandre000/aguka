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
  Target,
  Plus,
  TrendingUp,
  Calendar,
  Users,
  CheckCircle,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

const translations = {
  en: {
    goals: "Goals",
    setTrackManage: "Set, track, and manage team and individual goals",
    createGoal: "Create Goal",
    activeGoals: "Active Goals",
    teamIndividual: "Team & individual",
    completed: "Completed",
    completionRate: "75% completion rate",
    onTrack: "On Track",
    onTrackRate: "80% of active goals",
    dueThisMonth: "Due This Month",
    requireAttention: "Require attention",
    teamGoals: "Team Goals",
    collaborativeGoals: "Collaborative goals for the entire team",
    assignedTo: "Assigned to",
    due: "Due",
    progress: "Progress",
    update: "Update",
    individualGoalsProgress: "Individual Goals Progress",
    personalDevelopment: "Personal development goals for team members",
    goalsByCategory: "Goals by Category",
    goalDistribution: "Goal distribution across different focus areas",
    complete: "% complete",
    goalManagement: "Goal Management",
    goalTools: "Tools for managing team and individual goals",
    setTeamGoal: "Set Team Goal",
    individualGoals: "Individual Goals",
    progressReview: "Progress Review",
    goalPlanning: "Goal Planning",
    ahead: "Ahead",
    behind: "Behind",
  },
  fr: {
    goals: "Objectifs",
    setTrackManage:
      "Définir, suivre et gérer les objectifs de l'équipe et individuels",
    createGoal: "Créer un objectif",
    activeGoals: "Objectifs actifs",
    teamIndividual: "Équipe & individuel",
    completed: "Terminé",
    completionRate: "75% de réalisation",
    onTrack: "En cours",
    onTrackRate: "80% des objectifs actifs",
    dueThisMonth: "À échéance ce mois",
    requireAttention: "Nécessite une attention",
    teamGoals: "Objectifs d'équipe",
    collaborativeGoals: "Objectifs collaboratifs pour toute l'équipe",
    assignedTo: "Assigné à",
    due: "Échéance",
    progress: "Progression",
    update: "Mettre à jour",
    individualGoalsProgress: "Progression des objectifs individuels",
    personalDevelopment:
      "Objectifs de développement personnel pour les membres de l'équipe",
    goalsByCategory: "Objectifs par catégorie",
    goalDistribution: "Répartition des objectifs par domaine",
    complete: "% réalisé",
    goalManagement: "Gestion des objectifs",
    goalTools: "Outils pour gérer les objectifs d'équipe et individuels",
    setTeamGoal: "Définir un objectif d'équipe",
    individualGoals: "Objectifs individuels",
    progressReview: "Revue de progression",
    goalPlanning: "Planification des objectifs",
    ahead: "En avance",
    behind: "En retard",
  },
};

const Goals = () => {
  const { language } = useLanguage();
  const t = (key: keyof (typeof translations)["en"]) => translations[language][key];

  // State for each section
  const [overview, setOverview] = useState<any>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);

  const [teamGoals, setTeamGoals] = useState<any[]>([]);
  const [teamGoalsLoading, setTeamGoalsLoading] = useState(true);
  const [teamGoalsError, setTeamGoalsError] = useState<string | null>(null);

  const [individualGoals, setIndividualGoals] = useState<any[]>([]);
  const [individualGoalsLoading, setIndividualGoalsLoading] = useState(true);
  const [individualGoalsError, setIndividualGoalsError] = useState<string | null>(null);

  const [goalCategories, setGoalCategories] = useState<any[]>([]);
  const [goalCategoriesLoading, setGoalCategoriesLoading] = useState(true);
  const [goalCategoriesError, setGoalCategoriesError] = useState<string | null>(null);

  // TODO: Replace with real manager ID from auth/user context
  const managerId = "mock-manager-id";

  useEffect(() => {
    setOverviewLoading(true);
    setOverviewError(null);
    apiFetch(`/employees/manager/goals/overview?manager=${managerId}`)
      .then((data) => setOverview(data))
      .catch(() => setOverviewError("Failed to load goals overview."))
      .finally(() => setOverviewLoading(false));

    setTeamGoalsLoading(true);
    setTeamGoalsError(null);
    apiFetch(`/employees/manager/goals/team?manager=${managerId}`)
      .then((data) => setTeamGoals(data))
      .catch(() => setTeamGoalsError("Failed to load team goals."))
      .finally(() => setTeamGoalsLoading(false));

    setIndividualGoalsLoading(true);
    setIndividualGoalsError(null);
    apiFetch(`/employees/manager/goals/individual?manager=${managerId}`)
      .then((data) => setIndividualGoals(data))
      .catch(() => setIndividualGoalsError("Failed to load individual goals."))
      .finally(() => setIndividualGoalsLoading(false));

    setGoalCategoriesLoading(true);
    setGoalCategoriesError(null);
    apiFetch(`/employees/manager/goals/categories?manager=${managerId}`)
      .then((data) => setGoalCategories(data))
      .catch(() => setGoalCategoriesError("Failed to load goal categories."))
      .finally(() => setGoalCategoriesLoading(false));
  }, []);

  return (
    <ManagerPortalLayout>
      <div className="space-y-4 md:space-y-6 p-2 md:p-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t("goals")}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {t("setTrackManage")}
            </p>
          </div>
          <Button className="flex items-center gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            {t("createGoal")}
          </Button>
        </div>

        {/* Goals Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {overviewLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse h-24" />
            ))
          ) : overviewError ? (
            <div className="col-span-4 text-red-500 text-sm">{overviewError}</div>
          ) : overview ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">{t("activeGoals")}</CardTitle>
                  <Target className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">{overview.activeGoals}</div>
                  <p className="text-xs text-muted-foreground">{t("teamIndividual")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">{t("completed")}</CardTitle>
                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">{overview.completedGoals}</div>
                  <p className="text-xs text-muted-foreground">{t("completionRate")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">{t("onTrack")}</CardTitle>
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">{overview.onTrack}</div>
                  <p className="text-xs text-muted-foreground">{t("onTrackRate")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">{t("dueThisMonth")}</CardTitle>
                  <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">{overview.dueThisMonth}</div>
                  <p className="text-xs text-muted-foreground">{t("requireAttention")}</p>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>

        {/* Team Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Users className="h-4 w-4 md:h-5 md:w-5" />
              {t("teamGoals")}
            </CardTitle>
            <CardDescription className="text-sm">{t("collaborativeGoals")}</CardDescription>
          </CardHeader>
          <CardContent>
            {teamGoalsLoading ? (
              <div className="animate-pulse h-8 w-full bg-muted rounded" />
            ) : teamGoalsError ? (
              <div className="text-xs text-red-500">{teamGoalsError}</div>
            ) : teamGoals.length === 0 ? (
              <div className="text-muted-foreground text-sm">No team goals found.</div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {teamGoals.map((goal) => (
                  <div key={goal.id} className="p-3 md:p-4 border rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 md:mb-4 gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-sm md:text-base">{goal.title}</h3>
                          <Badge variant={goal.priority === "High" ? "destructive" : "secondary"} className="text-xs">{goal.priority}</Badge>
                          <Badge variant={goal.status === "On Track" || goal.status === "Ahead" ? "default" : "destructive"} className="text-xs">{goal.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{goal.description}</p>
                        <p className="text-xs text-muted-foreground">{t("assignedTo")}: {goal.assignedTo.join(", ")}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{t("due")}: {goal.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs md:text-sm mb-1">
                            <span>{t("progress")}</span>
                            <span>{goal.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-secondary rounded-full">
                            <div className="h-2 bg-primary rounded-full" style={{ width: `${goal.progress}%` }}></div>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="ml-0 mt-2 sm:ml-4 sm:mt-0 text-xs">{t("update")}</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Individual Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">{t("individualGoalsProgress")}</CardTitle>
            <CardDescription className="text-sm">{t("personalDevelopment")}</CardDescription>
          </CardHeader>
          <CardContent>
            {individualGoalsLoading ? (
              <div className="animate-pulse h-8 w-full bg-muted rounded" />
            ) : individualGoalsError ? (
              <div className="text-xs text-red-500">{individualGoalsError}</div>
            ) : individualGoals.length === 0 ? (
              <div className="text-muted-foreground text-sm">No individual goals found.</div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {individualGoals.map((person, index) => (
                  <div key={index} className="border rounded-lg p-3 md:p-4">
                    <h3 className="font-medium text-sm md:text-base mb-3 md:mb-4">{person.employee}</h3>
                    <div className="space-y-3">
                      {person.goals.map((goal: any, goalIndex: number) => (
                        <div key={goalIndex} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{goal.title}</span>
                            <Badge variant={goal.status === "Ahead" ? "default" : goal.status === "On Track" ? "secondary" : "destructive"} className="text-xs">{goal.status}</Badge>
                          </div>
                          <div className="w-full h-2 bg-secondary rounded-full">
                            <div className={`h-2 rounded-full ${goal.status === "Ahead" ? "bg-green-500" : goal.status === "On Track" ? "bg-primary" : "bg-red-500"}`} style={{ width: `${goal.progress}%` }}></div>
                          </div>
                          <span className="text-sm font-medium ml-4">{goal.progress}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Goal Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">{t("goalsByCategory")}</CardTitle>
            <CardDescription className="text-sm">{t("goalDistribution")}</CardDescription>
          </CardHeader>
          <CardContent>
            {goalCategoriesLoading ? (
              <div className="animate-pulse h-8 w-full bg-muted rounded" />
            ) : goalCategoriesError ? (
              <div className="text-xs text-red-500">{goalCategoriesError}</div>
            ) : goalCategories.length === 0 ? (
              <div className="text-muted-foreground text-sm">No goal categories found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {goalCategories.map((category, index) => (
                  <div key={index} className="text-center p-3 md:p-4 border rounded-lg">
                    <h3 className="font-medium text-sm md:text-base mb-2">{category.name}</h3>
                    <div className="text-xl md:text-2xl font-bold mb-1">{category.completed}/{category.count}</div>
                    <p className="text-xs md:text-sm text-muted-foreground">{Math.round((category.completed / category.count) * 100)}{t("complete")}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Goal Management Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {t("goalManagement")}
            </CardTitle>
            <CardDescription className="text-sm">
              {t("goalTools")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <Button
                variant="outline"
                className="h-auto p-3 md:p-4 flex flex-col items-center gap-2"
              >
                <Target className="h-4 w-4 md:h-6 md:w-6" />
                <span className="text-xs md:text-sm">{t("setTeamGoal")}</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-3 md:p-4 flex flex-col items-center gap-2"
              >
                <Users className="h-4 w-4 md:h-6 md:w-6" />
                <span className="text-xs md:text-sm">
                  {t("individualGoals")}
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-3 md:p-4 flex flex-col items-center gap-2"
              >
                <TrendingUp className="h-4 w-4 md:h-6 md:w-6" />
                <span className="text-xs md:text-sm">
                  {t("progressReview")}
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-3 md:p-4 flex flex-col items-center gap-2"
              >
                <Calendar className="h-4 w-4 md:h-6 md:w-6" />
                <span className="text-xs md:text-sm">{t("goalPlanning")}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ManagerPortalLayout>
  );
};

export default Goals;

/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Users, UserPlus, Phone, Mail, Calendar, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { getTeamMembers } from "@/lib/api";
import { useAuth } from '@/contexts/AuthContext';

const translations = {
  en: {
    manager: {
      teamMembers: "Team Members",
      teamMembersDesc: "Manage your direct reports and team members",
      addTeamMember: "Add Team Member",
      totalMembers: "Total Members",
      inYourTeam: "In your team",
      activeMembers: "Active Members",
      currentlyWorking: "Currently working",
      onLeave: "On Leave",
      currentlyAway: "Currently away",
      avgPerformance: "Avg Performance",
      teamAverage: "Team average",
      teamDirectory: "Team Directory",
      teamDirectoryDesc: "Your direct reports and team member details",
      viewProfile: "View Profile",
      performance: {
        excellent: "Excellent",
        good: "Good",
      },
      status: {
        active: "Active",
        onleave: "On Leave",
      },
      joined: "Joined",
      teamGoals: "Team Goals & Objectives",
      teamGoalsDesc: "Track team progress towards goals and objectives",
      q1ProjectCompletion: "Q1 Project Completion",
      q1ProjectCompletionDesc: "Complete 3 major projects by end of quarter",
      teamSkillDevelopment: "Team Skill Development",
      teamSkillDevelopmentDesc: "80% of team members complete training",
      quickActions: "Quick Actions",
      quickActionsDesc: "Common team management tasks",
      scheduleMeeting: "Schedule Meeting",
      setGoals: "Set Goals",
      teamReview: "Team Review",
    },
  },
  fr: {
    manager: {
      teamMembers: "Membres de l'équipe",
      teamMembersDesc: "Gérez vos subordonnés directs et membres d'équipe",
      addTeamMember: "Ajouter un membre",
      totalMembers: "Nombre total de membres",
      inYourTeam: "Dans votre équipe",
      activeMembers: "Membres actifs",
      currentlyWorking: "Actuellement en service",
      onLeave: "En congé",
      currentlyAway: "Actuellement absent",
      avgPerformance: "Performance moyenne",
      teamAverage: "Moyenne de l'équipe",
      teamDirectory: "Annuaire de l'équipe",
      teamDirectoryDesc: "Détails de vos subordonnés et membres d'équipe",
      viewProfile: "Voir le profil",
      performance: {
        excellent: "Excellent",
        good: "Bon",
      },
      status: {
        active: "Actif",
        onleave: "En congé",
      },
      joined: "Rejoint",
      teamGoals: "Objectifs de l'équipe",
      teamGoalsDesc: "Suivez les progrès de l'équipe vers les objectifs",
      q1ProjectCompletion: "Achèvement du projet T1",
      q1ProjectCompletionDesc:
        "Terminer 3 projets majeurs d'ici la fin du trimestre",
      teamSkillDevelopment: "Développement des compétences de l'équipe",
      teamSkillDevelopmentDesc: "80% des membres terminent la formation",
      quickActions: "Actions rapides",
      quickActionsDesc: "Tâches courantes de gestion d'équipe",
      scheduleMeeting: "Planifier une réunion",
      setGoals: "Définir des objectifs",
      teamReview: "Évaluation de l'équipe",
    },
  },
};

const TeamMembers = () => {
  const { language } = useLanguage();
  const t = (key: string) => {
    const keys = key.split(".");
    let value: any = translations[language]?.manager;
    for (const k of keys.slice(1)) {
      value = value?.[k];
    }
    return value ?? key;
  };

  const { user } = useAuth();
  const managerId = user?._id;

  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState<string | null>(null);

  useEffect(() => {
    if (!managerId) return;
    setTeamLoading(true);
    getTeamMembers(managerId)
      .then((data) => setTeamMembers(Array.isArray(data) ? data : []))
      .catch(() => setTeamMembers([]))
      .finally(() => setTeamLoading(false));
  }, [managerId]);

  // Replace static stats with dynamic calculations
  const totalMembers = teamMembers.length;
  const activeMembers = Array.isArray(teamMembers) ? teamMembers.filter(m => m.status === 'Active').length : 0;
  const onLeave = Array.isArray(teamMembers) ? teamMembers.filter(m => m.status === 'On Leave').length : 0;
  const avgPerformance = teamMembers.length ? (teamMembers.reduce((sum, m) => sum + (m.performanceScore || 4), 0) / teamMembers.length).toFixed(1) : 'N/A';

  return (
    <ManagerPortalLayout>
      <div className="space-y-4 md:space-y-6 p-2 md:p-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t("manager.teamMembers")}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {t("manager.teamMembersDesc")}
            </p>
          </div>
          <Button className="flex items-center gap-2 w-full sm:w-auto">
            <UserPlus className="h-4 w-4" />
            {t("manager.addTeamMember")}
          </Button>
        </div>

        {/* Team Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("manager.totalMembers")}
              </CardTitle>
              <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {teamLoading ? "Loading..." : totalMembers}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("manager.inYourTeam")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("manager.activeMembers")}
              </CardTitle>
              <Badge className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {teamLoading ? "Loading..." : activeMembers}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("manager.currentlyWorking")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("manager.onLeave")}
              </CardTitle>
              <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {teamLoading ? "Loading..." : onLeave}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("manager.currentlyAway")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("manager.avgPerformance")}
              </CardTitle>
              <Target className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {teamLoading ? "Loading..." : avgPerformance}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("manager.teamAverage")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Members List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {t("manager.teamDirectory")}
            </CardTitle>
            <CardDescription className="text-sm">
              {t("manager.teamDirectoryDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {teamLoading && <p>Loading team members...</p>}
            {teamError && <p style={{ color: 'red' }}>{teamError}</p>}
            {!teamLoading && !teamError && teamMembers.length === 0 && (
              <p>No team members found for this manager.</p>
            )}
            <div className="space-y-3 md:space-y-4">
              {Array.isArray(teamMembers) && teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-3 md:p-4 border rounded-lg gap-4"
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs md:text-sm font-medium">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-sm md:text-base">
                        {member.name}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {member.role}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          <span>{member.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="text-left sm:text-right">
                      <Badge
                        variant={
                          member.performance === "Excellent"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {t(
                          `manager.performance.${member.performance.toLowerCase()}`
                        )}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("manager.joined")}: {member.joinDate}
                      </p>
                    </div>
                    <Badge
                      variant={
                        member.status === "Active" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {t(
                        `manager.status.${member.status
                          .replace(" ", "")
                          .toLowerCase()}`
                      )}
                    </Badge>
                    <Button variant="outline" size="sm" className="text-xs">
                      {t("manager.viewProfile")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Target className="h-4 w-4 md:h-5 md:w-5" />
              {t("manager.teamGoals")}
            </CardTitle>
            <CardDescription className="text-sm">
              {t("manager.teamGoalsDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg gap-4">
                <div className="flex-1">
                  <h3 className="font-medium text-sm md:text-base">
                    {t("manager.q1ProjectCompletion")}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {t("manager.q1ProjectCompletionDesc")}
                  </p>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-20 md:w-24 h-2 bg-secondary rounded-full">
                    <div className="w-14 md:w-16 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-xs md:text-sm font-medium">67%</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg gap-4">
                <div className="flex-1">
                  <h3 className="font-medium text-sm md:text-base">
                    {t("manager.teamSkillDevelopment")}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {t("manager.teamSkillDevelopmentDesc")}
                  </p>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-20 md:w-24 h-2 bg-secondary rounded-full">
                    <div className="w-16 md:w-20 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-xs md:text-sm font-medium">83%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {t("manager.quickActions")}
            </CardTitle>
            <CardDescription className="text-sm">
              {t("manager.quickActionsDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              <Button
                variant="outline"
                className="h-auto p-3 md:p-4 flex flex-col items-center gap-2"
              >
                <Calendar className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-xs md:text-sm">
                  {t("manager.scheduleMeeting")}
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-3 md:p-4 flex flex-col items-center gap-2"
              >
                <Target className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-xs md:text-sm">
                  {t("manager.setGoals")}
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-3 md:p-4 flex flex-col items-center gap-2"
              >
                <Users className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-xs md:text-sm">
                  {t("manager.teamReview")}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ManagerPortalLayout>
  );
};

export default TeamMembers;

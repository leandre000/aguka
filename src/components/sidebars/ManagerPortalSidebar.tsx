import { NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  TrendingUp,
  FileText,
  Building2,
  Clock,
  Target,
  MessageSquare,
  BarChart
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

export function ManagerPortalSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { t } = useLanguage();
  const currentPath = location.pathname;

  const navigationItems = [
    {
      title: t("manager.dashboard"),
      url: "/manager-portal",
      icon: LayoutDashboard,
    },
    {
      title: t("manager.teamMembers"),
      url: "/manager-portal/team",
      icon: Users,
    },
    {
      title: t("manager.attendance"),
      url: "/manager-portal/attendance",
      icon: UserCheck,
    },
    {
      title: t("manager.timeoff"),
      url: "/manager-portal/timeoff",
      icon: Calendar,
    },
    {
      title: t("manager.performance"),
      url: "/manager-portal/performance",
      icon: TrendingUp,
    },
    {
      title: t("manager.approvals"),
      url: "/manager-portal/approvals",
      icon: Clock,
    },
    {
      title: t("manager.goals"),
      url: "/manager-portal/goals",
      icon: Target,
    },
    {
      title: t("manager.successionPlanning") || "Succession Planning",
      url: "/manager-portal/succession",
      icon: Users,
    },
    {
      title: t("common.reports") || "Reports",
      url: "/manager-portal/reports",
      icon: BarChart,
    },
    {
      title: t("common.messages") || "Messages",
      url: "/manager-portal/messages",
      icon: MessageSquare,
    },
    {
      title: "AI Tools",
      url: "/ai-tools",
      icon: BarChart,
    },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center space-x-2 px-2 py-3">
          <Building2 className="h-6 w-6 text-primary" />
          {state === "expanded" && (
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">{t("manager.title")}</h2>
              <p className="text-xs text-sidebar-foreground/70">{t("manager.subtitle")}</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("common.navigation")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
import { NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Building2,
  Search,
  Brain,
  TrendingUp,
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

export function RecruiterPortalSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { t } = useLanguage();
  const currentPath = location.pathname;

  const navigationItems = [
    {
      title: t("recruiter.dashboard"),
      url: "/recruiter-portal",
      icon: LayoutDashboard,
    },
    {
      title: t("recruiter.jobs"),
      url: "/recruiter-portal/jobs",
      icon: Briefcase,
    },
    {
      title: t("recruiter.interviews"),
      url: "/recruiter-portal/interviews",
      icon: Users,
    },
    {
      title: t("recruiter.candidates"),
      url: "/recruiter-portal/candidates",
      icon: Search,
    },
    {
      title: t("recruiter.offers"),
      url: "/recruiter-portal/offers",
      icon: Brain,
    },
    {
      title: t("common.messages"),
      url: "/recruiter-portal/messages",
      icon: MessageSquare,
    },
    {
      title: "AI Tools",
      url: "/recruiter-portal/ai-tools",
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
              <h2 className="text-lg font-semibold text-sidebar-foreground">{t("recruiter.title")}</h2>
              <p className="text-xs text-sidebar-foreground/70">{t("recruiter.subtitle")}</p>
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
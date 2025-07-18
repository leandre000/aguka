import { NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  LayoutDashboard,
  Shield,
  FileText,
  BarChart,
  Building2,
  Eye,
  Archive,
  Activity,
  Users,
  MessageSquare
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

export function AuditorPortalSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { t } = useLanguage();
  const currentPath = location.pathname;

  const navigationItems = [
    {
      title: t("auditor.dashboard"),
      url: "/auditor-portal",
      icon: LayoutDashboard,
    },
    {
      title: t("auditor.complianceReports"),
      url: "/auditor-portal/compliance",
      icon: FileText,
    },
    {
      title: t("auditor.riskAssessments"),
      url: "/auditor-portal/risk",
      icon: Activity,
    },
    {
      title: t("auditor.auditFindings"),
      url: "/auditor-portal/audits",
      icon: Archive,
    },
    {
      title: t("common.messages") || "Messages",
      url: "/auditor-portal/messages",
      icon: MessageSquare,
    },
    {
      title: t("common.reports") || "Reports",
      url: "/auditor-portal/reports",
      icon: BarChart,
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
              <h2 className="text-lg font-semibold text-sidebar-foreground">{t("auditor.title")}</h2>
              <p className="text-xs text-sidebar-foreground/70">{t("auditor.subtitle")}</p>
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
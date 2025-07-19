import { NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  TrendingUp,
  FileText,
  Building2,
  Brain,
  GraduationCap,
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

export function TrainerPortalSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { t } = useLanguage();
  const currentPath = location.pathname;

  const navigationItems = [
    {
      title: t("trainer.dashboard"),
      url: "/trainer-portal",
      icon: LayoutDashboard,
    },
    {
      title: t("trainer.courses"),
      url: "/trainer-portal/courses",
      icon: TrendingUp,
    },
    {
      title: t("trainer.progress"),
      url: "/trainer-portal/progress",
      icon: Users,
    },
    {
      title: t("trainer.sessions"),
      url: "/trainer-portal/sessions",
      icon: Brain,
    },
    {
      title: t("common.messages"),
      url: "/trainer-portal/messages",
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
              <h2 className="text-lg font-semibold text-sidebar-foreground">{t("trainer.title")}</h2>
              <p className="text-xs text-sidebar-foreground/70">{t("trainer.subtitle")}</p>
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
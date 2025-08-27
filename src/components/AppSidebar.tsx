import { NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  DollarSign,
  TrendingUp,
  User,
  Shield,
  BarChart,
  Building2,
  Eye
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

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { t } = useLanguage();
  const currentPath = location.pathname;

  const navigationItems = [
    {
      title: t("nav.dashboard"),
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t("nav.employees"),
      url: "/employees",
      icon: Users,
    },
    {
      title: t("nav.recruitment"),
      url: "/recruitment",
      icon: UserPlus,
    },
    {
      title: t("nav.payroll"),
      url: "/payroll",
      icon: DollarSign,
    },
    {
      title: t("nav.performance"),
      url: "/performance",
      icon: TrendingUp,
    },
    {
      title: t("nav.employeePortal"),
      url: "/employee-portal",
      icon: User,
    },
    {
      title: t("nav.compliance"),
      url: "/compliance",
      icon: Shield,
    },
    {
      title: "GDPR",
      url: "/gdpr",
      icon: Eye,
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
              <h2 className="text-lg font-semibold text-sidebar-foreground">{t("common.hrSystem")}</h2>
              <p className="text-xs text-sidebar-foreground/70">{t("common.managementPortal")}</p>
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
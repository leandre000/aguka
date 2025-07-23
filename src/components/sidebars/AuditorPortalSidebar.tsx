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
  MessageSquare,
  LogOut
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useAuth } from "@/contexts/AuthContext";

export function AuditorPortalSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { t } = useLanguage();
  const currentPath = location.pathname;
  const { logout } = useAuth();

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
      title: t("common.messages"),
      url: "/auditor-portal/messages",
      icon: MessageSquare,
    },
    {
      title: "AI Tools",
      url: "/auditor-portal/ai-tools",
      icon: BarChart,
    },
    {
      title: t("auditor.employeeDocuments") || "Employee Documents",
      url: "/auditor-portal/documents",
      icon: FileText,
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
        {/* Logout Section */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <SidebarMenuButton asChild>
                      <button
                        type="button"
                        className="flex items-center w-full gap-2 text-left px-2 py-2 hover:bg-accent rounded"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t("common.logout")}</span>
                      </button>
                    </SidebarMenuButton>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("common.confirmLogout")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("common.confirmLogoutDesc")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                      <AlertDialogAction onClick={logout}>
                        {t("common.logout")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

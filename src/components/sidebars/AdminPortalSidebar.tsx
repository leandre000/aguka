import { NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  LayoutDashboard,
  Users,
  BarChart,
  FileText,
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

export function AdminPortalSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { t } = useLanguage();
  const currentPath = location.pathname;
  const { logout } = useAuth();

  const navigationItems = [
    {
      title: t("admin.dashboard"),
      url: "/admin-portal",
      icon: LayoutDashboard,
    },
    {
      title: t("admin.userManagement"),
      url: "/admin-portal/users",
      icon: Users,
    },
    {
      title: t("admin.analytics"),
      url: "/admin-portal/analytics",
      icon: BarChart,
    },
    {
      title: t("admin.auditLogs"),
      url: "/admin-portal/audit-logs",
      icon: FileText,
    },
    {
      title: t("common.messages"),
      url: "/admin-portal/messages",
      icon: MessageSquare,
    },
    {
      title: t("admin.successionPlanning"),
      url: "/admin-portal/succession",
      icon: Users,
    },
    {
      title: "AI Tools",
      url: "/admin-portal/ai-tools",
      icon: BarChart,
    },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center space-x-2 px-2 py-3">
          <BarChart className="h-6 w-6 text-primary" />
          {state === "expanded" && (
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">{t("admin.title")}</h2>
              <p className="text-xs text-sidebar-foreground/70">{t("admin.subtitle")}</p>
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
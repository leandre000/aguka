import { NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  User,
  Calendar,
  DollarSign,
  BookOpen,
  FileText,
  Building2,
  MessageSquare,
  Bot,
  Heart,
  HelpCircle,
  Receipt,
  BarChart,
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

export function EmployeePortalSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { t } = useLanguage();
  const { logout } = useAuth();
  const currentPath = location.pathname;

  const navigationItems = [
    {
      title: t("employee.dashboard"),
      url: "/employee-portal",
      icon: LayoutDashboard,
    },
    {
      title: t("employee.profile"),
      url: "/employee-portal/profile",
      icon: User,
    },
    {
      title: t("employee.payslips"),
      url: "/employee-portal/payslips",
      icon: Receipt,
    },
    {
      title: t("employee.leaveRequests"),
      url: "/employee-portal/leave-requests",
      icon: Calendar,
    },
    {
      title: t("employee.expenseClaims"),
      url: "/employee-portal/expense-claims",
      icon: DollarSign,
    },
    {
      title: t("employee.training"),
      url: "/employee-portal/training",
      icon: BookOpen,
    },
    {
      title: t("employee.announcements"),
      url: "/employee-portal/announcements",
      icon: MessageSquare,
    },
    {
      title: t("employee.wellbeingSurvey"),
      url: "/employee-portal/wellbeing-survey",
      icon: Heart,
    },
    {
      title: t("employee.hrFaq"),
      url: "/employee-portal/hr-faq",
      icon: HelpCircle,
    },
    {
      title: t("employee.aiAssistant"),
      url: "/employee-portal/ai-assistant",
      icon: Bot,
    },
    {
      title: t("common.messages"),
      url: "/employee-portal/messages",
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
              <h2 className="text-lg font-semibold text-sidebar-foreground">{t("employee.title")}</h2>
              <p className="text-xs text-sidebar-foreground/70">{t("employee.subtitle")}</p>
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
                    <SidebarMenuButton>
                      <LogOut className="h-4 w-4" />
                      <span>{t("common.logout")}</span>
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
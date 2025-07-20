import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { NotificationBell } from './NotificationBell';
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

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const { t } = useLanguage();
  const isHomePage = location.pathname === '/';
  const isAuthPage = ['/login'].includes(location.pathname);
  const isPortalPage = location.pathname.includes('-portal');

  // Don't show sidebar on homepage, auth pages, or portal pages (they have their own layouts)
  if (isHomePage || isAuthPage || isPortalPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          {/* Top bar with logout */}
          <header className="flex justify-between items-center px-4 py-2 bg-background border-b">
            <div className="font-bold text-lg">{t("common.hrms")}</div>
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <NotificationBell />
                <span className="text-sm text-muted-foreground">{user?.Names || user?.name}</span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      {t("common.logout")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("common.logout")}</AlertDialogTitle>
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
              </div>
            )}
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { RecruiterPortalSidebar } from "@/components/sidebars/RecruiterPortalSidebar";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
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

interface RecruiterPortalLayoutProps {
  children: React.ReactNode;
}

export function RecruiterPortalLayout({ children }: RecruiterPortalLayoutProps) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RecruiterPortalSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4 justify-end">
            <LanguageSwitcher />
            {user && <span className="text-sm text-muted-foreground">{user.Names || user.name || user.email}</span>}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  {t("common.logout") || "Logout"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("common.confirmLogout") || "Confirm Logout"}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("common.confirmLogoutDesc") || "Are you sure you want to log out?"}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("common.cancel") || "Cancel"}</AlertDialogCancel>
                  <AlertDialogAction onClick={logout}>
                    {t("common.logout") || "Logout"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
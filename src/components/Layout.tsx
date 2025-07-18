import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { NotificationBell } from './NotificationBell';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const isHomePage = location.pathname === '/';
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
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
            <div className="font-bold text-lg">HRMS</div>
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <NotificationBell />
                <span className="text-sm text-muted-foreground">{user?.Names || user?.name}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
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
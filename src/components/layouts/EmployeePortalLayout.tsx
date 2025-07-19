import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { EmployeePortalSidebar } from "@/components/sidebars/EmployeePortalSidebar";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmployeePortalLayoutProps {
  children: React.ReactNode;
}

export function EmployeePortalLayout({ children }: EmployeePortalLayoutProps) {
  const { t } = useLanguage();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <EmployeePortalSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
            <LanguageSwitcher />
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
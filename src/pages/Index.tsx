import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { 
  Shield, 
  Users, 
  User, 
  UserPlus, 
  GraduationCap, 
  FileCheck,
  ArrowRight
} from "lucide-react";
import HomeNavbar from "@/components/HomeNavbar";

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handlePortalClick = (path: string) => {
    navigate(path);
  };

  const portals = [
    {
      title: t("admin.title"),
      description: t("admin.subtitle"),
      icon: Shield,
      path: "/admin-portal",
      color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    },
    {
      title: t("manager.title"),
      description: t("manager.subtitle"),
      icon: Users,
      path: "/manager-portal",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    },
    {
      title: t("employee.title"),
      description: t("employee.subtitle"),
      icon: User,
      path: "/employee-portal",
      color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    },
    {
      title: t("recruiter.title"),
      description: t("recruiter.subtitle"),
      icon: UserPlus,
      path: "/recruiter-portal",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
    },
    {
      title: t("trainer.title"),
      description: t("trainer.subtitle"),
      icon: GraduationCap,
      path: "/trainer-portal",
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
    },
    {
      title: t("auditor.title"),
      description: t("auditor.subtitle"),
      icon: FileCheck,
      path: "/auditor-portal",
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    }
  ];

  return (
    <div className="min-h-screen bg-background"> 
      <HomeNavbar />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">{t("home.selectPortal")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("home.subtitle")}
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {portals.map((portal, idx) => (
            <Card
              key={idx}
              className={`cursor-pointer hover:shadow-lg transition-shadow ${portal.color}`}
              onClick={() => handlePortalClick(portal.path)}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <portal.icon className="h-8 w-8" />
                <div>
                  <CardTitle>{portal.title}</CardTitle>
                  <CardDescription>{portal.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
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

  const portals = [
    {
      title: t('home.administrator'),
      description: t('home.administrator.desc'),
      icon: Shield,
      path: "/admin-portal",
      color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    },
    {
      title: t('home.manager'),
      description: t('home.manager.desc'),
      icon: Users,
      path: "/manager-portal",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    },
    {
      title: t('home.employee'),
      description: t('home.employee.desc'),
      icon: User,
      path: "/employee-portal",
      color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    },
    {
      title: t('home.recruiter'),
      description: t('home.recruiter.desc'),
      icon: UserPlus,
      path: "/recruiter-portal",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
    },
    {
      title: t('home.trainer'),
      description: t('home.trainer.desc'),
      icon: GraduationCap,
      path: "/trainer-portal",
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
    },
    {
      title: t('home.auditor'),
      description: t('home.auditor.desc'),
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
          <h2 className="text-4xl font-bold text-foreground mb-4">{t('home.selectRole')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {portals.map((portal, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${portal.color}`}>
                    <portal.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{portal.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {portal.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={portal.path}>
                  <Button className="w-full group">
                    {t('home.accessPortal')}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;

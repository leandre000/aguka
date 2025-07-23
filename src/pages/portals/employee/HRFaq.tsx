
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Search, HelpCircle } from "lucide-react";
import { EmployeePortalLayout } from "@/components/layouts/EmployeePortalLayout";

export default function HRFaq() {
  const { t } = useLanguage();

  const faqCategories = [
    {
      category: "Leave Policy",
      questions: [
        {
          q: "How many vacation days do I get?",
          a: "Full-time employees receive 25 vacation days per year.",
        },
        {
          q: "How do I request sick leave?",
          a: "Submit a leave request through the employee portal or contact HR directly.",
        },
      ],
    },
    {
      category: "Benefits",
      questions: [
        {
          q: "When can I enroll in health insurance?",
          a: "Open enrollment is in November, or within 30 days of starting.",
        },
        {
          q: "What retirement benefits are available?",
          a: "We offer a 401(k) plan with company matching up to 4%.",
        },
      ],
    },
  ];

  const translations = {
    en: {
      title: "HR FAQ",
      search: "Search FAQ...",
      leavePolicy: "Leave Policy",
      benefits: "Benefits",
      vacationDaysQ: "How many vacation days do I get?",
      vacationDaysA: "Full-time employees receive 25 vacation days per year.",
      sickLeaveQ: "How do I request sick leave?",
      sickLeaveA: "Submit a leave request through the employee portal or contact HR directly.",
      enrollInsuranceQ: "When can I enroll in health insurance?",
      enrollInsuranceA: "Open enrollment is in November, or within 30 days of starting.",
      retirementQ: "What retirement benefits are available?",
      retirementA: "We offer a 401(k) plan with company matching up to 4%.",
    },
    fr: {
      title: "FAQ RH",
      search: "Rechercher dans la FAQ...",
      leavePolicy: "Politique de congé",
      benefits: "Avantages",
      vacationDaysQ: "Combien de jours de vacances ai-je?",
      vacationDaysA: "Les employés à temps plein reçoivent 25 jours de vacances par an.",
      sickLeaveQ: "Comment demander un congé maladie?",
      sickLeaveA: "Soumettez une demande de congé via le portail des employés ou contactez directement les RH.",
      enrollInsuranceQ: "Quand puis-je m'inscrire à l'assurance maladie?",
      enrollInsuranceA: "La période d'inscription est en novembre, ou dans les 30 jours suivant le début.",
      retirementQ: "Quels avantages de retraite sont disponibles?",
      retirementA: "Nous offrons un plan 401(k) avec une contrepartie de l'entreprise jusqu'à 4%.",
    },
  };

  return (
    <EmployeePortalLayout>
      <div className="space-y-4 md:space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <HelpCircle className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold">HR FAQ</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search FAQ..." className="pl-10 w-full" />
        </div>

        <div className="space-y-4">
          {faqCategories.map((category, index) => (
            <Card key={index}>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg md:text-xl">{category.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {category.questions.map((item, qIndex) => (
                  <Collapsible key={qIndex}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left hover:bg-muted rounded text-sm md:text-base">
                      <span className="font-medium pr-2">{item.q}</span>
                      <ChevronDown className="h-4 w-4 flex-shrink-0" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pb-3 text-muted-foreground text-sm md:text-base">
                      {item.a}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </EmployeePortalLayout>
  );
}

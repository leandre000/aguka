
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
      category: t('employee.hrFaq.leavePolicy'),
      questions: [
        {
          q: t('employee.hrFaq.vacationDaysQ'),
          a: t('employee.hrFaq.vacationDaysA'),
        },
        {
          q: t('employee.hrFaq.sickLeaveQ'),
          a: t('employee.hrFaq.sickLeaveA'),
        },
      ],
    },
    {
      category: t('employee.hrFaq.benefits'),
      questions: [
        {
          q: t('employee.hrFaq.enrollInsuranceQ'),
          a: t('employee.hrFaq.enrollInsuranceA'),
        },
        {
          q: t('employee.hrFaq.retirementQ'),
          a: t('employee.hrFaq.retirementA'),
        },
      ],
    },
  ];

  return (
    <EmployeePortalLayout>
      <div className="space-y-4 md:space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <HelpCircle className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold">{t('employee.hrFaq.title')}</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t('employee.hrFaq.search')} className="pl-10 w-full" />
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

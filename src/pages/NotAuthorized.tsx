// src/pages/NotAuthorized.tsx
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotAuthorized() {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">{t("auth.notAuthorizedTitle")}</h1>
      <p className="text-lg">{t("auth.notAuthorized")}</p>
    </div>
  );
}

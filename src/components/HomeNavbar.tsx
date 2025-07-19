import { useState } from "react";
import { Building2, Menu } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const HomeNavbar = () => {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {t("home.title")}
              </h1>
            </div>
          </div>
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <Link to="/login">
              <Button variant="outline">{t("auth.signIn")}</Button>
            </Link>
            <Link to="/signup">
              <Button>{t("auth.signUp")}</Button>
            </Link>
          </div>
          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring"
            aria-label={t("common.openMenu")}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="h-6 w-6 text-primary" />
          </button>
        </div>
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-6 pb-4 flex flex-col space-y-3 bg-background">
            <LanguageSwitcher />
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <Button variant="outline" className="w-full">
                {t("auth.signIn")}
              </Button>
            </Link>
            <Link to="/signup" onClick={() => setMenuOpen(false)}>
              <Button className="w-full">{t("auth.signUp")}</Button>
            </Link>
          </div>
        )}
      </header>
    </div>
  );
};

export default HomeNavbar;

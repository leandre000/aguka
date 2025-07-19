import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { NotAuthorizedDialog } from "./NotAuthorizedDialog";

export function RoleRoute({ allowedRoles }: { allowedRoles: string[] }) {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useLanguage();
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowDialog(true);
    } else if (!user || !allowedRoles.includes(user.role)) {
      setShowDialog(true);
    } else {
      setShowDialog(false);
    }
  }, [isAuthenticated, user, allowedRoles]);

  // If not authenticated, show dialog and redirect to landing page after close
  if (!isAuthenticated) {
    return (
      <NotAuthorizedDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        showLogout={false}
        message={t("auth.mustLogin")}
        onClose={() => navigate("/")}
      />
    );
  }

  // If authenticated but not authorized, show dialog with logout option
  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <NotAuthorizedDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        showLogout={true}
        onLogout={logout}
        message={t("auth.notAuthorized")}
      />
    );
  }

  return <Outlet />;
}

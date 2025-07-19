import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { NotAuthorizedDialog } from "./NotAuthorizedDialog";

export function RoleRoute({ allowedRoles }: { allowedRoles: string[] }) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // Only check role authorization since authentication is already handled by PrivateRoute
    if (!user || !allowedRoles.includes(user.role)) {
      setShowDialog(true);
    } else {
      setShowDialog(false);
    }
  }, [user, allowedRoles]);

  // If not authorized for this role, show dialog with logout option
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

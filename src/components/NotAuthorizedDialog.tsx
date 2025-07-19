import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function NotAuthorizedDialog({
  open,
  onOpenChange,
  showLogout = false,
  onLogout,
  message,
  onClose
}: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  showLogout?: boolean,
  onLogout?: () => void,
  message?: string,
  onClose?: () => void
}) {
  const { t } = useLanguage();
  
  const handleClose = () => {
    onOpenChange(false);
    if (onClose) onClose();
  };

  const defaultMessage = showLogout 
    ? t("auth.notAuthorized") 
    : t("auth.mustLogin");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("auth.notAuthorizedTitle")}</DialogTitle>
          <DialogDescription>
            {message || defaultMessage}
          </DialogDescription>
        </DialogHeader>
        {showLogout && onLogout && (
          <Button onClick={onLogout} className="mt-4 w-full">
            {t("common.logout")}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

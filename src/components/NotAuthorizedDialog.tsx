import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function NotAuthorizedDialog({
  open,
  onOpenChange,
  showLogout = false,
  onLogout,
  message = "You do not have permission to access this page.",
  onClose
}: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  showLogout?: boolean,
  onLogout?: () => void,
  message?: string,
  onClose?: () => void
}) {
  const handleClose = () => {
    onOpenChange(false);
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Not Authorized</DialogTitle>
          <DialogDescription>
            {message}
          </DialogDescription>
        </DialogHeader>
        {showLogout && onLogout && (
          <Button onClick={onLogout} className="mt-4 w-full">
            Logout
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

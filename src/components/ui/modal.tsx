import React from "react";

export const Modal = ({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded shadow-lg p-6" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

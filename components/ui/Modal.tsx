"use client";

import { useEffect, useRef } from "react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mouseDownOnBackdrop = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onMouseDown={(e) => {
        mouseDownOnBackdrop.current = e.target === dialogRef.current;
      }}
      onMouseUp={(e) => {
        if (mouseDownOnBackdrop.current && e.target === dialogRef.current) {
          onClose();
        }
        mouseDownOnBackdrop.current = false;
      }}
      className="m-auto max-h-[90vh] w-full max-w-md rounded-lg shadow-lg backdrop:bg-background/50"
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto p-6 pt-4">{children}</div>
      </div>
    </dialog>
  );
}

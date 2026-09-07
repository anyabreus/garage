"use client";

import { useTransition } from "react";
import { deleteFuelLog } from "@/actions/fuel-logs";
import { deleteMaintenanceLog } from "@/actions/maintenance-logs";
import Button from "../ui/Button";
import { Trash2 } from "lucide-react";

export default function DeleteLogButton({
  kind,
  logId,
}: {
  kind: "fuel" | "maintenance";
  logId: number;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Delete this log?")) return;

    startTransition(async () => {
      const result =
        kind === "fuel"
          ? await deleteFuelLog(logId)
          : await deleteMaintenanceLog(logId);

      if (!result.success) alert(result.error);
    });
  };

  return (
    <Button
      variant="danger"
      size="icon"
      onClick={handleDelete}
      disabled={isPending}
      aria-label="Delete log"
    >
      <Trash2 size={14} />
    </Button>
  );
}

"use client";

import { useTransition } from "react";
import { deleteFuelLog } from "@/actions/fuel-logs";
import { deleteMaintenanceLog } from "@/actions/maintenance-logs";

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
    <button onClick={handleDelete} disabled={isPending}>
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}

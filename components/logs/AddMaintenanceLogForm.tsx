"use client";

import { useActionState } from "react";
import { useParams } from "next/navigation";
import { addMaintenanceLogFromForm } from "@/actions/maintenance-logs";
import { MAINTENANCE_TYPES } from "@/types/maintenance-logs";
import Button from "../ui/Button";

export default function AddMaintenanceLogForm() {
  const id = useParams().id;
  const addMaintenanceLogWithId = addMaintenanceLogFromForm.bind(
    null,
    Number(id),
  );
  const [state, formAction, isPending] = useActionState(
    addMaintenanceLogWithId,
    null,
  );

  return (
    <form action={formAction}>
      <input type="date" name="date" placeholder="Date" required />
      <input type="number" name="odometer" placeholder="Odometer" required />
      <select name="type" defaultValue="other" required>
        {MAINTENANCE_TYPES.map((t) => (
          <option key={t} value={t}>
            {t.replace("_", " ")}
          </option>
        ))}
      </select>
      <textarea name="description" placeholder="Description" />
      <input
        type="number"
        step="0.01"
        name="cost"
        placeholder="Cost"
        required
      />
      {state && !state.success && <p className="text-red-500">{state.error}</p>}
      <Button disabled={isPending}>
        {isPending ? "Saving..." : "Add Maintenance Log"}
      </Button>
    </form>
  );
}

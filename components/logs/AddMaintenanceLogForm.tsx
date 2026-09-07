"use client";

import { useActionState } from "react";
import { useParams } from "next/navigation";
import { addMaintenanceLogFromForm } from "@/actions/maintenance-logs";
import { MAINTENANCE_TYPES } from "@/types/maintenance-logs";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import { capitalizeString } from "@/lib/utils";

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
      <Input type="date" name="date" placeholder="Date" required />
      <Input type="number" name="odometer" placeholder="Odometer" required />
      <Select name="type" defaultValue="other" required>
        {MAINTENANCE_TYPES.map((t) => (
          <option key={t} value={t}>
            {capitalizeString(t.replace("_", " "))}
          </option>
        ))}
      </Select>
      <Textarea name="description" placeholder="Description" />
      <Input
        type="number"
        step="0.01"
        min="0"
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

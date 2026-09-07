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
import FormField from "../ui/FormField";
import FormError from "../ui/FormError";
import SubmitButton from "../ui/SubmitButton";

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
    <form action={formAction} className="flex flex-col gap-2">
      <FormField label="Date" htmlFor="date">
        <Input id="date" type="date" name="date" required />
      </FormField>
      <FormField label="Odometer" htmlFor="odometer">
        <Input id="odometer" type="number" name="odometer" required />
      </FormField>
      <FormField label="Type" htmlFor="type">
        <Select id="type" name="type" defaultValue="other" required>
          {MAINTENANCE_TYPES.map((t) => (
            <option key={t} value={t}>
              {capitalizeString(t.replace("_", " "))}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label="Description" htmlFor="description">
        <Textarea id="description" name="description" />
      </FormField>
      <FormField label="Cost" htmlFor="cost">
        <Input
          id="cost"
          type="number"
          step="0.01"
          min="0"
          name="cost"
          required
        />
      </FormField>
      <FormError message={!state?.success ? state?.error : undefined} />
      <SubmitButton isPending={isPending} label="Add Maintenance Log" />
    </form>
  );
}

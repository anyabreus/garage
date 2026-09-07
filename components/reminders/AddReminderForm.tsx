"use client";

import { useActionState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createReminderFromForm } from "@/actions/reminders";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import FormField from "../ui/FormField";
import FormError from "../ui/FormError";
import SubmitButton from "../ui/SubmitButton";

export default function AddReminderForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const { id } = useParams<{ id: string }>();
  const vehicleId = Number(id);

  const createReminderWithId = createReminderFromForm.bind(null, vehicleId);
  const [state, formAction, isPending] = useActionState(
    createReminderWithId,
    null,
  );

  useEffect(() => {
    if (state?.success) onSuccess();
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <FormField label="Label" htmlFor="label">
        <Input id="label" name="label" placeholder="e.g. Oil change" required />
      </FormField>

      <FormField label="Repeats by" htmlFor="intervalType">
        <Select id="intervalType" name="intervalType" defaultValue="odometer">
          <option value="odometer">Distance (km)</option>
          <option value="date">Time (days)</option>
        </Select>
      </FormField>

      <FormField label="Interval Value" htmlFor="intervalValue">
        <Input
          id="intervalValue"
          name="intervalValue"
          type="number"
          min={1}
          placeholder="Interval Value"
          required
        />
      </FormField>

      <FormError message={!state?.success ? state?.error : undefined} />
      <SubmitButton isPending={isPending} label="Add Reminder" />
    </form>
  );
}

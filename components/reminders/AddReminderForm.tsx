"use client";

import { useActionState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createReminderFromForm } from "@/actions/reminders";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

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
    <form action={formAction}>
      <Input name="label" placeholder="Label (e.g. Oil change)" required />

      <label>
        Repeats by
        <Select name="intervalType" defaultValue="odometer">
          <option value="odometer">Distance (km)</option>
          <option value="date">Time (days)</option>
        </Select>
      </label>

      <Input
        name="intervalValue"
        type="number"
        min={1}
        placeholder="Interval Value"
        required
      />

      {state && !state.success && <p className="text-red-500">{state.error}</p>}

      <Button disabled={isPending}>
        {isPending ? "Saving..." : "Add Reminder"}
      </Button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { useParams } from "next/navigation";
import { addFuelLogFromForm } from "@/actions/fuel-logs";
import Input from "../ui/Input";
import FormField from "../ui/FormField";
import FormError from "../ui/FormError";
import SubmitButton from "../ui/SubmitButton";

export default function AddFuelLogForm() {
  const id = useParams().id;
  const addFuelLogWithId = addFuelLogFromForm.bind(null, Number(id));
  const [state, formAction, isPending] = useActionState(addFuelLogWithId, null);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <FormField label="Date" htmlFor="date">
        <Input id="date" type="date" name="date" placeholder="Date" required />
      </FormField>
      <FormField label="Odometer" htmlFor="odometer">
        <Input id="odometer" type="number" name="odometer" required />
      </FormField>
      <FormField label="Fuel Amount" htmlFor="fuelAmount">
        <Input id="fuelAmount" type="number" step="0.01" min="0" required />
      </FormField>
      <FormField label="Price Per Unit" htmlFor="pricePerUnit">
        <Input
          id="pricePerUnit"
          type="number"
          step="0.001"
          min="0"
          name="pricePerUnit"
          required
        />
      </FormField>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isFullTank"
          name="isFullTank"
          defaultChecked
        />
        <label htmlFor="isFullTank" className="mb-0 text-sm">
          Filled the tank completely
        </label>
      </div>

      <FormError message={!state?.success ? state?.error : undefined} />
      <SubmitButton isPending={isPending} label="Add Fuel Log" />
    </form>
  );
}

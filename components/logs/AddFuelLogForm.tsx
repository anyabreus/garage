"use client";

import { useActionState } from "react";
import { useParams } from "next/navigation";
import { addFuelLogFromForm } from "@/actions/fuel-logs";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function AddFuelLogForm() {
  const id = useParams().id;
  const addFuelLogWithId = addFuelLogFromForm.bind(null, Number(id));
  const [state, formAction, isPending] = useActionState(addFuelLogWithId, null);

  return (
    <form action={formAction}>
      <Input type="date" name="date" placeholder="Date" required />
      <Input type="number" name="odometer" placeholder="Odometer" required />
      <Input
        type="number"
        step="0.01"
        min="0"
        name="fuelAmount"
        placeholder="Fuel Amount"
        required
      />
      <Input
        type="number"
        step="0.001"
        min="0"
        name="pricePerUnit"
        placeholder="Price Per Unit"
        required
      />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isFullTank"
          name="isFullTank"
          defaultChecked
        />
        <label htmlFor="isFullTank" className="mb-0 text-sm text-foreground">
          Filled the tank completely
        </label>
      </div>

      {state && !state.success && <p className="text-red-500">{state.error}</p>}

      <Button disabled={isPending}>
        {isPending ? "Saving..." : "Add Fuel Log"}
      </Button>
    </form>
  );
}

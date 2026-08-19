"use client";

import { useActionState } from "react";
import { useParams } from "next/navigation";
import { addFuelLogFromForm } from "@/actions/fuel-logs";

export default function AddFuelLogForm() {
  const id = useParams().id;
  const addFuelLogWithId = addFuelLogFromForm.bind(null, Number(id));
  const [state, formAction, isPending] = useActionState(addFuelLogWithId, null);

  return (
    <form action={formAction}>
      <input type="date" name="date" placeholder="Date" required />
      <input type="number" name="odometer" placeholder="Odometer" required />
      <input
        type="number"
        step="0.01"
        name="fuelAmount"
        placeholder="Fuel Amount"
        required
      />
      <input
        type="number"
        step="0.001"
        name="pricePerUnit"
        placeholder="Price Per Unit"
        required
      />
      <label>
        <input type="checkbox" name="isFullTank" defaultChecked />
        Filled the tank completely
      </label>

      {state && !state.success && <p className="text-red-500">{state.error}</p>}

      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Add Fuel Log"}
      </button>
    </form>
  );
}

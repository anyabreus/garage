"use client";

import { useActionState } from "react";
import { createVehicle } from "@/actions/vehicles";

export default function NewVehicleForm() {
  const [state, formAction, isPending] = useActionState(createVehicle, null);

  return (
    <form action={formAction}>
      <input name="make" placeholder="Make" required />
      <input name="model" placeholder="Model" required />
      <input type="number" name="year" placeholder="Year" required />
      <input type="number" name="odometer" placeholder="Odometer" required />
      <input name="vin" placeholder="VIN (Optional)" />
      <input name="nickname" placeholder="Nickname (Optional)" />

      {state && !state.success && <p className="text-red-500">{state.error}</p>}

      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Add Vehicle"}
      </button>
    </form>
  );
}

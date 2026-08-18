"use client";

import { useActionState } from "react";
import { vehiclesTable } from "@/db/schema";
import { updateVehicle } from "@/actions/vehicles";

export default function VehicleEditForm({
  vehicleData,
}: {
  vehicleData: typeof vehiclesTable.$inferSelect;
}) {
  const updateVehicleWithId = updateVehicle.bind(null, vehicleData.id);
  const [state, formAction, isPending] = useActionState(
    updateVehicleWithId,
    null,
  );

  return (
    <form action={formAction}>
      <input
        name="nickname"
        placeholder="Nickname (Optional)"
        defaultValue={vehicleData?.nickname || ""}
      />
      <input
        name="make"
        placeholder="Make"
        defaultValue={vehicleData?.make}
        required
      />
      <input
        name="model"
        placeholder="Model"
        defaultValue={vehicleData?.model}
        required
      />
      <input
        type="number"
        name="year"
        placeholder="Year"
        defaultValue={vehicleData?.year}
        required
      />
      <input
        type="number"
        name="currentOdometer"
        placeholder="Current Odometer"
        defaultValue={vehicleData?.currentOdometer}
        required
      />
      <input
        name="vin"
        placeholder="VIN (Optional)"
        defaultValue={vehicleData?.vin || ""}
      />

      {state && !state.success && <p className="text-red-500">{state.error}</p>}

      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}

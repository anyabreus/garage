"use client";

import { useActionState } from "react";
import { vehiclesTable } from "@/db/schema";
import { updateVehicleFromForm } from "@/actions/vehicles";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function VehicleEditForm({
  vehicleData,
}: {
  vehicleData: typeof vehiclesTable.$inferSelect;
}) {
  const updateVehicleWithId = updateVehicleFromForm.bind(null, vehicleData.id);
  const [state, formAction, isPending] = useActionState(
    updateVehicleWithId,
    null,
  );

  return (
    <form action={formAction}>
      <Input
        name="nickname"
        placeholder="Nickname (Optional)"
        defaultValue={vehicleData?.nickname || ""}
      />
      <Input
        name="make"
        placeholder="Make"
        defaultValue={vehicleData?.make}
        required
      />
      <Input
        name="model"
        placeholder="Model"
        defaultValue={vehicleData?.model}
        required
      />
      <Input
        type="number"
        name="year"
        placeholder="Year"
        defaultValue={vehicleData?.year}
        required
      />
      <Input
        type="number"
        name="currentOdometer"
        placeholder="Current Odometer"
        defaultValue={vehicleData?.currentOdometer}
        required
      />
      <Input
        name="vin"
        placeholder="VIN (Optional)"
        defaultValue={vehicleData?.vin || ""}
      />

      {state && !state.success && <p className="text-red-500">{state.error}</p>}

      <Button disabled={isPending}>{isPending ? "Saving..." : "Save"}</Button>
    </form>
  );
}

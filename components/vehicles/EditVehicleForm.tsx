"use client";

import { useActionState } from "react";
import { vehiclesTable } from "@/db/schema";
import { updateVehicleFromForm } from "@/actions/vehicles";
import Button from "../ui/Button";
import Input from "../ui/Input";
import FormField from "../ui/FormField";
import FormError from "../ui/FormError";
import SubmitButton from "../ui/SubmitButton";

export default function EditVehicleForm({
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
    <form action={formAction} className="flex flex-col gap-2">
      <FormField label="Nickname (Optional)" htmlFor="nickname">
        <Input
          id="nickname"
          name="nickname"
          defaultValue={vehicleData?.nickname || ""}
        />
      </FormField>
      <FormField label="Make" htmlFor="make">
        <Input
          id="make"
          name="make"
          defaultValue={vehicleData?.make}
          required
        />
      </FormField>
      <FormField label="Model" htmlFor="model">
        <Input
          id="model"
          name="model"
          defaultValue={vehicleData?.model}
          required
        />
      </FormField>
      <FormField label="Year" htmlFor="year">
        <Input
          id="year"
          name="year"
          type="number"
          defaultValue={vehicleData?.year}
          required
        />
      </FormField>
      <FormField label="Current Odometer" htmlFor="currentOdometer">
        <Input
          id="currentOdometer"
          type="number"
          name="currentOdometer"
          defaultValue={vehicleData?.currentOdometer}
          required
        />
      </FormField>
      <FormField label="VIN (Optional)" htmlFor="vin">
        <Input id="vin" name="vin" defaultValue={vehicleData?.vin || ""} />
      </FormField>

      <FormError message={!state?.success ? state?.error : undefined} />

      <SubmitButton isPending={isPending} label="Save" />
    </form>
  );
}

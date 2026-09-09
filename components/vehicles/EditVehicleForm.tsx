"use client";

import { useActionState } from "react";
import { vehiclesTable } from "@/db/schema";
import { updateVehicleFromForm } from "@/actions/vehicles";
import { useVinDecode } from "@/hooks/useVinDecode";
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
  const { decoding, decodeError, prefill, handleVinBlur } = useVinDecode();

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <FormField label="VIN (Optional)" htmlFor="vin">
        <Input
          id="vin"
          name="vin"
          defaultValue={vehicleData?.vin || ""}
          maxLength={17}
          onBlur={handleVinBlur}
        />
        {decoding && (
          <p className="text-xs text-text-secondary">Decoding VIN...</p>
        )}
        {decodeError && <p className="text-xs text-signal">{decodeError}</p>}
      </FormField>
      <FormField label="Make" htmlFor="make">
        <Input
          id="make"
          name="make"
          defaultValue={prefill.make ?? vehicleData?.make}
          key={prefill.make ?? "make"}
          required
        />
      </FormField>
      <FormField label="Model" htmlFor="model">
        <Input
          id="model"
          name="model"
          defaultValue={prefill.model ?? vehicleData?.model}
          key={prefill.model ?? "model"}
          required
        />
      </FormField>
      <FormField label="Year" htmlFor="year">
        <Input
          id="year"
          name="year"
          type="number"
          defaultValue={prefill.year ?? vehicleData?.year}
          key={prefill.year ?? "year"}
          required
        />
      </FormField>
      <FormField label="Nickname (Optional)" htmlFor="nickname">
        <Input
          id="nickname"
          name="nickname"
          defaultValue={vehicleData?.nickname || ""}
        />
      </FormField>
      <FormField label="Current Odometer" htmlFor="currentOdometer">
        <Input
          id="currentOdometer"
          type="number"
          name="currentOdometer"
          min={0}
          defaultValue={vehicleData?.currentOdometer}
          required
        />
      </FormField>

      <FormError message={!state?.success ? state?.error : undefined} />
      <SubmitButton isPending={isPending} label="Save Changes" />
    </form>
  );
}

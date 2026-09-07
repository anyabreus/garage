"use client";

import { useActionState } from "react";
import { createVehicle } from "@/actions/vehicles";
import { useVinDecode } from "@/hooks/useVinDecode";
import Input from "../ui/Input";
import FormField from "../ui/FormField";
import FormError from "../ui/FormError";
import SubmitButton from "../ui/SubmitButton";

export default function NewVehicleForm() {
  const [state, formAction, isPending] = useActionState(createVehicle, null);
  const { decoding, decodeError, prefill, handleVinBlur } = useVinDecode();

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <FormField label="VIN (optional)" htmlFor="vin">
        <Input id="vin" name="vin" maxLength={17} onBlur={handleVinBlur} />
        {decoding && (
          <p className="text-xs text-text-secondary">Decoding VIN...</p>
        )}
        {decodeError && <p className="text-xs text-signal">{decodeError}</p>}
      </FormField>

      <FormField label="Make" htmlFor="make">
        <Input
          id="make"
          name="make"
          defaultValue={prefill.make}
          key={prefill.make ?? "make"}
          required
        />
      </FormField>
      <FormField label="Model" htmlFor="model">
        <Input
          id="model"
          name="model"
          defaultValue={prefill.model}
          key={prefill.model}
          required
        />
      </FormField>
      <FormField label="Year" htmlFor="year">
        <Input
          id="year"
          name="year"
          defaultValue={prefill.year}
          key={prefill.year}
          required
        />
      </FormField>
      <FormField label="Odometer" htmlFor="odometer">
        <Input id="odometer" type="number" name="odometer" required />
      </FormField>
      <FormField label="Nickname (Optional)" htmlFor="nickname">
        <Input id="nickname" name="nickname" />
      </FormField>

      <FormError message={!state?.success ? state?.error : undefined} />
      <SubmitButton isPending={isPending} label="Add Vehicle" />
    </form>
  );
}

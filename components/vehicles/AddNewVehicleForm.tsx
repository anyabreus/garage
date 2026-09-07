"use client";

import { useActionState, useState } from "react";
import { createVehicle } from "@/actions/vehicles";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function NewVehicleForm() {
  const [state, formAction, isPending] = useActionState(createVehicle, null);
  const [decoding, setDecoding] = useState(false);
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const [prefill, setPrefill] = useState<{
    make?: string;
    model?: string;
    year?: number;
  }>({});

  const handleVinBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const vin = e.target.value.trim().toUpperCase();
    if (vin.length !== 17) return;

    setDecoding(true);
    setDecodeError(null);

    try {
      const res = await fetch(`/api/vin?vin=${vin}`);
      if (!res.ok) {
        setDecodeError(
          "Couldn't decode this VIN — you can still fill in the details manually.",
        );
        return;
      }
      const data = await res.json();
      setPrefill({ make: data.make, model: data.model, year: data.year });
    } catch {
      setDecodeError(
        "Couldn't reach the VIN decoder — you can still fill in the details manually.",
      );
    } finally {
      setDecoding(false);
    }
  };

  return (
    <form action={formAction}>
      <Input
        name="vin"
        placeholder="VIN (Optional)"
        maxLength={17}
        onBlur={handleVinBlur}
      />
      {decoding && <p className="text-sm text-gray-500">Decoding VIN...</p>}
      {decodeError && <p className="text-sm text-amber-600">{decodeError}</p>}

      <Input
        name="make"
        defaultValue={prefill.make}
        key={prefill.make}
        placeholder="Make"
        required
      />
      <Input
        name="model"
        defaultValue={prefill.model}
        key={prefill.model}
        placeholder="Model"
        required
      />
      <Input
        type="number"
        name="year"
        defaultValue={prefill.year}
        key={prefill.year}
        placeholder="Year"
        required
      />
      <Input type="number" name="odometer" placeholder="Odometer" required />
      <Input name="nickname" placeholder="Nickname (Optional)" />

      {state && !state.success && <p className="text-red-500">{state.error}</p>}

      <Button disabled={isPending}>
        {isPending ? "Saving..." : "Add Vehicle"}
      </Button>
    </form>
  );
}

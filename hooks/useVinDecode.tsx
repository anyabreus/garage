"use client";

import { useState } from "react";

export function useVinDecode() {
  const [decoding, setDecoding] = useState(false);
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const [prefill, setPrefill] = useState<{
    make?: string;
    model?: string;
    year?: number;
  }>({});

  const handleVinBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const vin = e.target.value.trim().toUpperCase();
    if (vin.length !== 17) {
      if (!!decodeError) {
        setDecodeError(null);
      }
      return;
    }

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

  return { decoding, decodeError, prefill, handleVinBlur };
}

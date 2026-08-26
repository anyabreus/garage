type NhtsaResponse = {
  Results: Record<string, string>[];
};

export type DecodedVin = {
  make: string | null;
  model: string | null;
  year: number | null;
};

export async function decodeVin(vin: string): Promise<DecodedVin | null> {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data: NhtsaResponse = await res.json();
  const result = data.Results?.[0];

  console.log("Decoded VIN result:", result);

  if (!result) return null;

  const make = result.Make || null;
  const model = result.Model || null;
  const yearRaw = result.ModelYear || null;

  return {
    make,
    model,
    year: yearRaw ? Number(yearRaw) : null,
  };
}

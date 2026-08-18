import { notFound } from "next/navigation";
import { getVehicle } from "@/db/queries/vehicles";
import Link from "next/link";

export default async function VehiclePage({
  params,
}: PageProps<"/vehicles/[id]">) {
  const { id } = await params;
  const vehicleData = await getVehicle(Number(id));

  if (!vehicleData) return notFound();

  return (
    <div>
      <h1>
        {vehicleData.nickname && <span>{vehicleData.nickname} </span>}Vehicle
        Details
      </h1>

      <p>Make: {vehicleData.make}</p>
      <p>Model: {vehicleData.model}</p>
      <p>Year: {vehicleData.year}</p>
      <p>Current Odometer: {vehicleData.currentOdometer}</p>
      {vehicleData.vin && <p>VIN: {vehicleData.vin}</p>}
      <Link href={`/vehicles/${vehicleData.id}/settings`}>Settings</Link>
    </div>
  );
}

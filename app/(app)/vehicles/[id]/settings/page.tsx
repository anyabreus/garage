import { notFound } from "next/navigation";
import { getVehicle } from "@/db/queries/vehicles";
import EditVehicleForm from "@/components/vehicles/EditVehicleForm";
import DeleteVehicleButton from "@/components/vehicles/DeleteVehicleButton";

export default async function VehicleSettingsPage({
  params,
}: PageProps<"/vehicles/[id]/settings">) {
  const { id } = await params;
  const vehicleData = await getVehicle(Number(id));

  if (!vehicleData) notFound();

  return (
    <div>
      <h1>Vehicle Settings</h1>
      <EditVehicleForm vehicleData={vehicleData} />
      <DeleteVehicleButton vehicleId={vehicleData.id} />
    </div>
  );
}

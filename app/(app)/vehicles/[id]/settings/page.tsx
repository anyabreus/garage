import { notFound } from "next/navigation";
import { getVehicle } from "@/db/queries/vehicles";
import EditVehicleForm from "@/components/vehicles/EditVehicleForm";
import DeleteVehicleButton from "@/components/vehicles/DeleteVehicleButton";
import BackLink from "@/components/ui/BackLink";

export default async function VehicleSettingsPage({
  params,
}: PageProps<"/vehicles/[id]/settings">) {
  const { id } = await params;
  const vehicleData = await getVehicle(Number(id));

  if (!vehicleData) notFound();

  return (
    <>
      <BackLink
        href={`/vehicles/${vehicleData.id}`}
        label={`Back to ${vehicleData.nickname || `${vehicleData.make} ${vehicleData.model}`}`}
      />

      <div className="mx-auto flex max-w-lg flex-col gap-4">
        <h1>Edit vehicle</h1>
        <div className="rounded-xl border border-border bg-surface p-5">
          <EditVehicleForm vehicleData={vehicleData} />
        </div>

        <div className="rounded-xl border border-danger/25 bg-danger/3 p-5">
          <h2 className="mb-1 text-danger">Danger zone</h2>
          <p className="mb-3 text-xs text-text-secondary">
            Deleting a vehicle removes all its fuel logs, service history, and
            reminders. This can&apos;t be undone.
          </p>
          <DeleteVehicleButton vehicleId={vehicleData.id} />
        </div>
      </div>
    </>
  );
}

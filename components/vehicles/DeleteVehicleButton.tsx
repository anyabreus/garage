"use client";

import { useRouter } from "next/navigation";
import { deleteVehicle } from "@/actions/vehicles";
import { vehiclesTable } from "@/db/schema";

export default function DeleteVehicleButton({
  vehicleId,
}: {
  vehicleId: (typeof vehiclesTable.$inferSelect)["id"];
}) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this vehicle?")) return;
    const result = await deleteVehicle(vehicleId);
    if (result.success) router.push("/vehicles");
  };

  return (
    <button type="button" onClick={handleDelete}>
      Delete Vehicle
    </button>
  );
}

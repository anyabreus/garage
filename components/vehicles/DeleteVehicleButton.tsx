"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteVehicle } from "@/actions/vehicles";
import { vehiclesTable } from "@/db/schema";
import Button from "../ui/Button";

export default function DeleteVehicleButton({
  vehicleId,
}: {
  vehicleId: (typeof vehiclesTable.$inferSelect)["id"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (!confirm("Delete this vehicle? This action cannot be undone.")) return;

    startTransition(() => {
      deleteVehicle(vehicleId).then((result) => {
        if (result.success) {
          router.push("/vehicles");
        } else {
          alert(result.error);
        }
      });
    });
  };

  return (
    <Button
      variant="danger"
      type="button"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 size={14} />
      {isPending ? "Deleting..." : "Delete vehicle"}
    </Button>
  );
}

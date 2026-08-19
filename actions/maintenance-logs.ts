"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import db from "@/db";
import { getVehicle } from "@/db/queries/vehicles";
import { maintenanceLogsTable, vehiclesTable } from "@/db/schema";
import { updateVehicle } from "./vehicles";
import { ActionResult } from "@/types/action-result";
import { MAINTENANCE_TYPES, MaintenanceType } from "@/types/maintenance-logs";

export const addMaintenanceLog = async (
  maintenanceLogData: typeof maintenanceLogsTable.$inferInsert,
) => {
  const [newMaintenanceLog] = await db
    .insert(maintenanceLogsTable)
    .values(maintenanceLogData)
    .returning();

  try {
    const vehicle = await getVehicle(maintenanceLogData.vehicleId);

    if (vehicle && maintenanceLogData.odometer > vehicle.currentOdometer) {
      await updateVehicle(maintenanceLogData.vehicleId, {
        currentOdometer: maintenanceLogData.odometer,
      });
    }
  } catch (err) {
    console.error(
      "Failed to sync vehicle odometer after maintenance log:",
      err,
    );
  }

  return newMaintenanceLog;
};

export const addMaintenanceLogFromForm = async (
  vehicleId: (typeof vehiclesTable.$inferSelect)["id"],
  _prevState: ActionResult<typeof maintenanceLogsTable.$inferSelect> | null,
  formData: FormData,
): Promise<ActionResult<typeof maintenanceLogsTable.$inferSelect>> => {
  const rawType = formData.get("type") as string;
  const type = MAINTENANCE_TYPES.includes(rawType as MaintenanceType)
    ? (rawType as MaintenanceType)
    : "other";

  const maintenanceLogData = {
    vehicleId,
    date: new Date(formData.get("date") as string),
    odometer: Number(formData.get("odometer")),
    type,
    description: formData.get("description") as string,
    cost: Number(formData.get("cost")),
  };

  try {
    await addMaintenanceLog(maintenanceLogData);
  } catch {
    return { success: false, error: "Could not save maintenance log." };
  }

  revalidatePath(`/vehicles/${vehicleId}`);
  redirect(`/vehicles/${vehicleId}`);
};

export const deleteMaintenanceLog = async (
  maintenanceLogId: (typeof maintenanceLogsTable.$inferSelect)["id"],
): Promise<ActionResult> => {
  try {
    const [deleted] = await db
      .delete(maintenanceLogsTable)
      .where(eq(maintenanceLogsTable.id, maintenanceLogId))
      .returning();

    if (!deleted)
      return { success: false, error: "Maintenance log not found." };
    revalidatePath(`/vehicles/${deleted.vehicleId}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Could not delete maintenance log." };
  }
};

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import db from "@/db";
import { getVehicle } from "@/db/queries/vehicles";
import {
  MaintenanceLog,
  NewMaintenanceLog,
  Vehicle,
  maintenanceLogsTable,
} from "@/db/schema";
import { updateVehicle } from "./vehicles";
import { ActionResult } from "@/types/action-result";
import { MAINTENANCE_TYPES, MaintenanceType } from "@/types/maintenance-logs";
import { ownsVehicle, requireUserId } from "@/lib/auth-helpers";

export const addMaintenanceLog = async (
  maintenanceLogData: NewMaintenanceLog,
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
  vehicleId: Vehicle["id"],
  _prevState: ActionResult<MaintenanceLog> | null,
  formData: FormData,
): Promise<ActionResult<MaintenanceLog>> => {
  const userId = await requireUserId();
  if (!userId) return { success: false, error: "Not authenticated." };

  const allowed = await ownsVehicle(vehicleId, userId);
  if (!allowed) return { success: false, error: "Vehicle not found." };

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
  maintenanceLogId: MaintenanceLog["id"],
): Promise<ActionResult> => {
  const userId = await requireUserId();
  if (!userId) return { success: false, error: "Not authenticated." };

  try {
    const [log] = await db
      .select()
      .from(maintenanceLogsTable)
      .where(eq(maintenanceLogsTable.id, maintenanceLogId));
    if (!log) return { success: false, error: "Maintenance log not found." };

    const allowed = await ownsVehicle(log.vehicleId, userId);
    if (!allowed)
      return { success: false, error: "Maintenance log not found." };

    await db
      .delete(maintenanceLogsTable)
      .where(eq(maintenanceLogsTable.id, maintenanceLogId));

    revalidatePath(`/vehicles/${log.vehicleId}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Could not delete maintenance log." };
  }
};

"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import db from "@/db";
import { fuelLogsTable, vehiclesTable } from "@/db/schema";
import { getVehicle } from "@/db/queries/vehicles";
import { updateVehicle } from "./vehicles";
import { ActionResult } from "@/types/action-result";
import { ownsVehicle, requireUserId } from "@/lib/auth-helpers";

export const addFuelLog = async (
  fuelLogData: typeof fuelLogsTable.$inferInsert,
) => {
  const [newFuelLog] = await db
    .insert(fuelLogsTable)
    .values(fuelLogData)
    .returning();

  try {
    const vehicle = await getVehicle(fuelLogData.vehicleId);

    if (vehicle && fuelLogData.odometer > vehicle.currentOdometer) {
      await updateVehicle(fuelLogData.vehicleId, {
        currentOdometer: fuelLogData.odometer,
      });
    }
  } catch (err) {
    console.error("Failed to sync vehicle odometer after fuel log:", err);
  }

  return newFuelLog;
};

export const addFuelLogFromForm = async (
  vehicleId: (typeof vehiclesTable.$inferSelect)["id"],
  _prevState: ActionResult<typeof fuelLogsTable.$inferSelect> | null,
  formData: FormData,
): Promise<ActionResult<typeof fuelLogsTable.$inferSelect>> => {
  const userId = await requireUserId();
  if (!userId) return { success: false, error: "Not authenticated." };

  const allowed = await ownsVehicle(vehicleId, userId);
  if (!allowed) return { success: false, error: "Vehicle not found." };

  const fuelAmount = Number(formData.get("fuelAmount"));
  console.log(fuelAmount);
  const pricePerUnit = Number(formData.get("pricePerUnit"));

  const fuelLogData = {
    vehicleId,
    date: new Date(formData.get("date") as string),
    odometer: Number(formData.get("odometer")),
    fuelAmount,
    pricePerUnit,
    totalCost: fuelAmount * pricePerUnit,
    isFullTank: formData.get("isFullTank") === "on",
  };

  try {
    await addFuelLog(fuelLogData);
  } catch {
    return { success: false, error: "Could not save fuel log." };
  }

  revalidatePath(`/vehicles/${vehicleId}`);
  redirect(`/vehicles/${vehicleId}`);
};

export const deleteFuelLog = async (
  fuelLogId: (typeof fuelLogsTable.$inferSelect)["id"],
): Promise<ActionResult> => {
  const userId = await requireUserId();
  if (!userId) return { success: false, error: "Not authenticated." };

  try {
    const [log] = await db
      .select()
      .from(fuelLogsTable)
      .where(eq(fuelLogsTable.id, fuelLogId));
    if (!log) return { success: false, error: "Fuel log not found." };

    const allowed = await ownsVehicle(log.vehicleId, userId);
    if (!allowed) return { success: false, error: "Fuel log not found." };

    await db
      .delete(fuelLogsTable)
      .where(eq(fuelLogsTable.id, fuelLogId))
      .returning();

    revalidatePath(`/vehicles/${log.vehicleId}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Could not delete fuel log." };
  }
};

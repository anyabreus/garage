"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import db from "@/db";
import { fuelLogsTable } from "@/db/schema";
import { getVehicle } from "@/db/queries/vehicles";
import { updateVehicle } from "./vehicles";
import { ActionResult } from "@/types/action-result";

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
  vehicleId: number,
  _prevState: ActionResult<typeof fuelLogsTable.$inferSelect> | null,
  formData: FormData,
): Promise<ActionResult<typeof fuelLogsTable.$inferSelect>> => {
  const fuelAmount = Number(formData.get("fuelAmount"));
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
  fuelLogId: number,
): Promise<ActionResult> => {
  try {
    const [deleted] = await db
      .delete(fuelLogsTable)
      .where(eq(fuelLogsTable.id, fuelLogId))
      .returning();

    if (!deleted) return { success: false, error: "Fuel log not found." };
    revalidatePath(`/vehicles/${deleted.vehicleId}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Could not delete fuel log." };
  }
};

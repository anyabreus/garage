"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import db from "@/db";
import { vehiclesTable } from "@/db/schema";
import { ActionResult } from "@/types/action-result";

export const createVehicle = async (
  _prevState: ActionResult<typeof vehiclesTable.$inferSelect> | null,
  formData: FormData,
): Promise<ActionResult<typeof vehiclesTable.$inferSelect>> => {
  const vehicleData = {
    make: formData.get("make") as string,
    model: formData.get("model") as string,
    year: Number(formData.get("year")),
    initialOdometer: Number(formData.get("currentOdometer")),
    currentOdometer: Number(formData.get("currentOdometer")),
    vin: (formData.get("vin") as string) || undefined,
    nickname: (formData.get("nickname") as string) || undefined,
  };

  let newVehicle: typeof vehiclesTable.$inferSelect;

  try {
    const normalized = {
      ...vehicleData,
      vin: vehicleData.vin?.toUpperCase(),
    };

    const [inserted] = await db
      .insert(vehiclesTable)
      .values(normalized)
      .returning();

    newVehicle = inserted;
  } catch {
    return {
      success: false,
      error: "Could not create vehicle. Please try again later.", // TODO: Add more specific error handling
    };
  }

  revalidatePath("/vehicles");
  redirect(`/vehicles/${newVehicle.id}`);
};

export const updateVehicle = async (
  vehicleId: number,
  vehicleData: Partial<typeof vehiclesTable.$inferInsert>,
) => {
  const normalized = {
    ...vehicleData,
    vin: vehicleData.vin?.toUpperCase(),
  };

  const [updatedVehicle] = await db
    .update(vehiclesTable)
    .set(normalized)
    .where(eq(vehiclesTable.id, vehicleId))
    .returning();

  return updatedVehicle;
};

export const updateVehicleFromForm = async (
  vehicleId: number,
  _prevState: ActionResult<typeof vehiclesTable.$inferSelect> | null,
  formData: FormData,
): Promise<ActionResult<typeof vehiclesTable.$inferSelect>> => {
  const vehicleData = {
    make: formData.get("make") as string,
    model: formData.get("model") as string,
    year: Number(formData.get("year")),
    currentOdometer: Number(formData.get("currentOdometer")),
    vin: (formData.get("vin") as string) || undefined,
    nickname: (formData.get("nickname") as string) || undefined,
  };

  try {
    const updatedVehicle = await updateVehicle(vehicleId, vehicleData);
    if (!updatedVehicle) {
      return { success: false, error: "Vehicle not found." };
    }
  } catch {
    return {
      success: false,
      error: "Could not update vehicle. Please try again later.",
    };
  }

  revalidatePath("/vehicles");
  revalidatePath(`/vehicles/${vehicleId}`);
  redirect(`/vehicles/${vehicleId}`);
};

export const deleteVehicle = async (
  vehicleId: (typeof vehiclesTable.$inferSelect)["id"],
): Promise<ActionResult> => {
  try {
    const [deletedVehicle] = await db
      .delete(vehiclesTable)
      .where(eq(vehiclesTable.id, vehicleId))
      .returning();

    if (!deletedVehicle) {
      return { success: false, error: "Vehicle not found." };
    }

    revalidatePath("/vehicles");

    return { success: true, data: undefined };
  } catch {
    return {
      success: false,
      error: "Could not delete vehicle. Please try again later.",
    };
  }
};

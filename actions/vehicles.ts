"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import db from "@/db";
import { Vehicle, vehiclesTable } from "@/db/schema";
import { ActionResult } from "@/types/action-result";
import { requireUserId } from "@/lib/auth-helpers";

export const createVehicle = async (
  _prevState: ActionResult<Vehicle> | null,
  formData: FormData,
): Promise<ActionResult<Vehicle>> => {
  const userId = await requireUserId();
  if (!userId) return { success: false, error: "Not authenticated." };

  const vehicleData = {
    userId,
    make: formData.get("make") as string,
    model: formData.get("model") as string,
    year: Number(formData.get("year")),
    initialOdometer: Number(formData.get("odometer")),
    currentOdometer: Number(formData.get("odometer")),
    vin: (formData.get("vin") as string) || undefined,
    nickname: (formData.get("nickname") as string) || undefined,
  };

  let newVehicle: Vehicle;

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
  vehicleData: Partial<Vehicle>,
) => {
  const userId = await requireUserId();
  if (!userId) throw new Error("Not authenticated.");

  const normalized = {
    ...vehicleData,
    vin: vehicleData.vin?.toUpperCase(),
  };

  const [updatedVehicle] = await db
    .update(vehiclesTable)
    .set(normalized)
    .where(
      and(eq(vehiclesTable.id, vehicleId), eq(vehiclesTable.userId, userId)),
    )
    .returning();

  return updatedVehicle;
};

export const updateVehicleFromForm = async (
  vehicleId: number,
  _prevState: ActionResult<Vehicle> | null,
  formData: FormData,
): Promise<ActionResult<Vehicle>> => {
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
  vehicleId: Vehicle["id"],
): Promise<ActionResult> => {
  const userId = await requireUserId();
  if (!userId) return { success: false, error: "Not authenticated." };

  try {
    const [deletedVehicle] = await db
      .delete(vehiclesTable)
      .where(
        and(eq(vehiclesTable.id, vehicleId), eq(vehiclesTable.userId, userId)),
      )
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

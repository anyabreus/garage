"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import db from "@/db";
import { remindersTable } from "@/db/schema";
import { getVehicle } from "@/db/queries/vehicles";
import type { ActionResult } from "@/types/action-result";

export const createReminder = async (
  reminderData: Omit<
    typeof remindersTable.$inferInsert,
    "lastDoneAt" | "lastDoneOdometer"
  >,
) => {
  const vehicle = await getVehicle(reminderData.vehicleId);
  if (!vehicle) throw new Error("Vehicle not found");

  const [newReminder] = await db
    .insert(remindersTable)
    .values({
      ...reminderData,
      lastDoneAt: new Date(),
      lastDoneOdometer: vehicle.currentOdometer,
    })
    .returning();

  return newReminder;
};

export const createReminderFromForm = async (
  vehicleId: number,
  _prevState: ActionResult<typeof remindersTable.$inferSelect> | null,
  formData: FormData,
): Promise<ActionResult<typeof remindersTable.$inferSelect>> => {
  const reminderData = {
    vehicleId,
    label: formData.get("label") as string,
    intervalType: formData.get("intervalType") as "odometer" | "date",
    intervalValue: Number(formData.get("intervalValue")),
  };
  let newReminder: typeof remindersTable.$inferSelect;

  try {
    newReminder = await createReminder(reminderData);
  } catch {
    return { success: false, error: "Could not create reminder." };
  }

  revalidatePath("/reminders");
  return { success: true, data: newReminder };
};

export const dismissReminder = async (
  reminderId: (typeof remindersTable.$inferSelect)["id"],
): Promise<ActionResult> => {
  try {
    const [reminder] = await db
      .select()
      .from(remindersTable)
      .where(eq(remindersTable.id, reminderId));

    if (!reminder) return { success: false, error: "Reminder not found." };

    const vehicle = await getVehicle(reminder.vehicleId);
    if (!vehicle) return { success: false, error: "Vehicle not found." };

    await db
      .update(remindersTable)
      .set({
        lastDoneAt: new Date(),
        lastDoneOdometer: vehicle.currentOdometer,
      })
      .where(eq(remindersTable.id, reminderId));
  } catch {
    return { success: false, error: "Could not update reminder." };
  }

  revalidatePath("/reminders");
  return { success: true, data: undefined };
};

export const deleteReminder = async (
  reminderId: (typeof remindersTable.$inferSelect)["id"],
): Promise<ActionResult> => {
  try {
    const [deleted] = await db
      .delete(remindersTable)
      .where(eq(remindersTable.id, reminderId))
      .returning();

    if (!deleted) return { success: false, error: "Reminder not found." };

    revalidatePath("/reminders");
    revalidatePath(`/vehicles/${deleted.vehicleId}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Could not delete reminder." };
  }
};

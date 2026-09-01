import { eq } from "drizzle-orm";
import db from "@/db";
import { remindersTable, vehiclesTable } from "@/db/schema";

export const getReminders = async (
  vehicleId: (typeof vehiclesTable.$inferSelect)["id"],
) =>
  await db
    .select()
    .from(remindersTable)
    .where(eq(remindersTable.vehicleId, vehicleId));

export const getReminder = async (
  reminderId: (typeof remindersTable.$inferSelect)["id"],
) => {
  const [reminder] = await db
    .select()
    .from(remindersTable)
    .where(eq(remindersTable.id, reminderId));

  return reminder;
};

export type ReminderStatus = {
  reminder: typeof remindersTable.$inferSelect;
  vehicle: typeof vehiclesTable.$inferSelect;
  isDue: boolean;
  progress: number;
  remaining: number;
};

export const getUpcomingReminders = async (): Promise<ReminderStatus[]> => {
  const rows = await db
    .select()
    .from(remindersTable)
    .innerJoin(vehiclesTable, eq(remindersTable.vehicleId, vehiclesTable.id));

  const now = new Date();

  return rows
    .map(({ reminders: reminder, vehicles: vehicle }) => {
      if (reminder.intervalType === "odometer") {
        const traveled = vehicle.currentOdometer - reminder.lastDoneOdometer;
        const remaining = reminder.intervalValue - traveled;
        return {
          reminder,
          vehicle,
          isDue: remaining <= 0,
          progress: traveled / reminder.intervalValue,
          remaining,
        };
      }

      const daysSince = Math.floor(
        (now.getTime() - reminder.lastDoneAt.getTime()) / (1000 * 60 * 60 * 24),
      );
      const remaining = reminder.intervalValue - daysSince;
      return {
        reminder,
        vehicle,
        isDue: remaining <= 0,
        progress: daysSince / reminder.intervalValue,
        remaining,
      };
    })
    .sort((a, b) => a.remaining - b.remaining);
};

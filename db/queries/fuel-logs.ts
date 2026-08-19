import { eq, desc } from "drizzle-orm";
import db from "..";
import { fuelLogsTable, vehiclesTable } from "../schema";

export const getFuelLogs = async (
  vehicleId: (typeof vehiclesTable.$inferSelect)["id"],
) =>
  await db
    .select()
    .from(fuelLogsTable)
    .where(eq(fuelLogsTable.vehicleId, vehicleId))
    .orderBy(desc(fuelLogsTable.date));

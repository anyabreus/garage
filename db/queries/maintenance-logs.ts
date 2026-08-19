import { eq, desc } from "drizzle-orm";
import db from "..";
import { maintenanceLogsTable, vehiclesTable } from "../schema";

export const getMaintenanceLogs = async (
  vehicleId: (typeof vehiclesTable.$inferSelect)["id"],
) =>
  await db
    .select()
    .from(maintenanceLogsTable)
    .where(eq(maintenanceLogsTable.vehicleId, vehicleId))
    .orderBy(desc(maintenanceLogsTable.date));

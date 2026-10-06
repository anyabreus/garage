import { eq, desc } from "drizzle-orm";
import db from "..";
import { maintenanceLogsTable, vehiclesTable } from "../schema";
import { ownsVehicle, requireUserId } from "@/lib/auth-helpers";

export const getMaintenanceLogs = async (
  vehicleId: (typeof vehiclesTable.$inferSelect)["id"],
) => {
  const userId = await requireUserId();
  if (!userId) return [];

  const allowed = await ownsVehicle(vehicleId, userId);
  if (!allowed) return [];

  return await db
    .select()
    .from(maintenanceLogsTable)
    .where(eq(maintenanceLogsTable.vehicleId, vehicleId))
    .orderBy(desc(maintenanceLogsTable.date));
};

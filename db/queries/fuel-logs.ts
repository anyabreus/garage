import { eq, desc } from "drizzle-orm";
import db from "..";
import { fuelLogsTable, Vehicle } from "../schema";
import { ownsVehicle, requireUserId } from "@/lib/auth-helpers";

export const getFuelLogs = async (vehicleId: Vehicle["id"]) => {
  const userId = await requireUserId();
  if (!userId) return [];

  const allowed = await ownsVehicle(vehicleId, userId);
  if (!allowed) return [];

  return await db
    .select()
    .from(fuelLogsTable)
    .where(eq(fuelLogsTable.vehicleId, vehicleId))
    .orderBy(desc(fuelLogsTable.date));
};

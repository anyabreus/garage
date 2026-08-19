import { eq, desc } from "drizzle-orm";
import db from "..";
import { fuelLogsTable } from "../schema";

export const getFuelLogs = async (vehicleId: number) =>
  await db
    .select()
    .from(fuelLogsTable)
    .where(eq(fuelLogsTable.vehicleId, vehicleId))
    .orderBy(desc(fuelLogsTable.date));

import { eq } from "drizzle-orm";
import db from "..";
import { vehiclesTable } from "../schema";

export const getVehicles = async () => await db.select().from(vehiclesTable);

export const getVehicle = async (
  vehicleId: (typeof vehiclesTable.$inferSelect)["id"],
) => {
  const [vehicle] = await db
    .select()
    .from(vehiclesTable)
    .where(eq(vehiclesTable.id, vehicleId));

  return vehicle;
};

import { eq, and } from "drizzle-orm";
import db from "..";
import { vehiclesTable } from "../schema";
import { requireUserId } from "@/lib/auth-helpers";

export const getVehicles = async () => {
  const userId = await requireUserId();
  if (!userId) return [];

  return await db
    .select()
    .from(vehiclesTable)
    .where(eq(vehiclesTable.userId, userId));
};

export const getVehicle = async (vehicleId: number, userId?: string) => {
  const resolvedUserId = userId ?? (await requireUserId());
  if (!resolvedUserId) return undefined;

  const [vehicle] = await db
    .select()
    .from(vehiclesTable)
    .where(
      and(
        eq(vehiclesTable.id, vehicleId),
        eq(vehiclesTable.userId, resolvedUserId),
      ),
    );

  return vehicle;
};

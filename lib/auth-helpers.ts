import { auth } from "@/auth";
import { getVehicle } from "@/db/queries/vehicles";

export async function requireUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function ownsVehicle(
  vehicleId: number,
  userId: string,
): Promise<boolean> {
  const vehicle = await getVehicle(vehicleId, userId);
  return !!vehicle;
}

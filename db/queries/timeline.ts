import { TimelineEntry } from "@/types/timeline";
import { getFuelLogs } from "./fuel-logs";
import { getMaintenanceLogs } from "./maintenance-logs";
import { vehiclesTable } from "../schema";

export const getVehicleTimeline = async (
  vehicleId: (typeof vehiclesTable.$inferSelect)["id"],
): Promise<TimelineEntry[]> => {
  const [fuelLogs, maintenanceLogs] = await Promise.all([
    getFuelLogs(vehicleId),
    getMaintenanceLogs(vehicleId),
  ]);

  const entries: TimelineEntry[] = [
    ...fuelLogs.map((log) => ({
      kind: "fuel" as const,
      date: log.date,
      data: log,
    })),
    ...maintenanceLogs.map((log) => ({
      kind: "maintenance" as const,
      date: log.date,
      data: log,
    })),
  ];

  return entries.sort((a, b) => b.date.getTime() - a.date.getTime());
};

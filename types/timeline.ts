import { getFuelLogs } from "@/db/queries/fuel-logs";
import { getMaintenanceLogs } from "@/db/queries/maintenance-logs";

export type TimelineEntry =
  | {
      kind: "fuel";
      date: Date;
      data: Awaited<ReturnType<typeof getFuelLogs>>[number];
    }
  | {
      kind: "maintenance";
      date: Date;
      data: Awaited<ReturnType<typeof getMaintenanceLogs>>[number];
    };

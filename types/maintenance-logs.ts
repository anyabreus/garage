export const MAINTENANCE_TYPES = [
  "oil_change",
  "tires",
  "brakes",
  "inspection",
  "other",
] as const;

export type MaintenanceType = (typeof MAINTENANCE_TYPES)[number];

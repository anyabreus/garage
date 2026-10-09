import type { FuelLog, MaintenanceLog } from "@/db/schema";

let nextId = 1;

export function fuelLog(overrides: Partial<FuelLog> = {}): FuelLog {
  return {
    id: nextId++,
    vehicleId: 1,
    date: new Date("2026-01-15T12:00:00Z"),
    odometer: 1000,
    fuelAmount: 40,
    pricePerUnit: 1.5,
    totalCost: 60,
    isFullTank: true,
    ...overrides,
  };
}

export function maintenanceLog(
  overrides: Partial<MaintenanceLog> = {},
): MaintenanceLog {
  return {
    id: nextId++,
    vehicleId: 1,
    date: new Date("2026-01-15T12:00:00Z"),
    odometer: 1000,
    type: "oil_change",
    description: null,
    cost: 100,
    ...overrides,
  };
}

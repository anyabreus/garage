import { describe, expect, it } from "vitest";
import { spendByMaintenanceType, totalSpend } from "./stats";
import type { FuelLog, MaintenanceLog } from "@/db/schema";
import { fuelLog, maintenanceLog } from "@/test/factories";

const fuelLogs: FuelLog[] = [
  fuelLog({ totalCost: 50 }),
  fuelLog({ totalCost: 30 }),
];

const maintenanceLogs: MaintenanceLog[] = [
  maintenanceLog({ cost: 100 }),
  maintenanceLog({ cost: 50 }),
];

describe("totalSpend", () => {
  it("should calculate the total spend correctly", () => {
    const result = totalSpend(fuelLogs, maintenanceLogs);
    expect(result).toEqual({ fuel: 80, maintenance: 150, total: 230 });
  });

  it("should return zero for empty logs", () => {
    const result = totalSpend([], []);
    expect(result).toEqual({ fuel: 0, maintenance: 0, total: 0 });
  });

  it("should handle only fuel logs", () => {
    const result = totalSpend(fuelLogs, []);
    expect(result).toEqual({ fuel: 80, maintenance: 0, total: 80 });
  });

  it("should handle only maintenance logs", () => {
    const result = totalSpend([], maintenanceLogs);
    expect(result).toEqual({ fuel: 0, maintenance: 150, total: 150 });
  });

  it("should handle decimal costs correctly", () => {
    const decimalFuelLogs: FuelLog[] = [
      fuelLog({ totalCost: 50.75 }),
      fuelLog({ totalCost: 30.25 }),
    ];
    const decimalMaintenanceLogs: MaintenanceLog[] = [
      maintenanceLog({ cost: 100.5 }),
      maintenanceLog({ cost: 50.25 }),
    ];
    const result = totalSpend(decimalFuelLogs, decimalMaintenanceLogs);
    expect(result).toEqual({ fuel: 81, maintenance: 150.75, total: 231.75 });
  });
});

describe("spendByMaintenanceType", () => {
  it("should calculate spend by maintenance type correctly", () => {
    const maintenanceLogsUpd: MaintenanceLog[] = [
      ...maintenanceLogs,
      maintenanceLog({ type: "tires", cost: 200 }),
    ];
    const result = spendByMaintenanceType(maintenanceLogsUpd);
    expect(result).toEqual({ oil_change: 150, tires: 200 });
  });

  it("should return an empty object for empty logs", () => {
    const result = spendByMaintenanceType([]);
    expect(result).toEqual({});
  });

  it("should handle multiple logs of the same type", () => {
    const maintenanceLogsUpd: MaintenanceLog[] = [
      ...maintenanceLogs,
      maintenanceLog({ type: "oil_change", cost: 75 }),
    ];
    const result = spendByMaintenanceType(maintenanceLogsUpd);
    expect(result).toEqual({ oil_change: 225 });
  });

  it("should handle decimal costs correctly", () => {
    const maintenanceLogsUpd: MaintenanceLog[] = [
      maintenanceLog({ type: "oil_change", cost: 100.5 }),
      maintenanceLog({ type: "tires", cost: 200.25 }),
      maintenanceLog({ type: "oil_change", cost: 50.75 }),
    ];
    const result = spendByMaintenanceType(maintenanceLogsUpd);
    expect(result).toEqual({ oil_change: 151.25, tires: 200.25 });
  });
});

describe.todo("calculateCostPerDistance", () => {});

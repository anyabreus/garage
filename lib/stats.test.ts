import { describe, expect, it } from "vitest";
import {
  calculateCostPerDistance,
  calculateFuelConsumption,
  calculateFuelConsumptionSeries,
  spendByMaintenanceType,
  spendByMonth,
  totalSpend,
} from "./stats";
import type { FuelLog, MaintenanceLog } from "@/db/schema";
import { fuelLog, maintenanceLog, vehicle } from "@/test/factories";

const fuelLogs: FuelLog[] = [
  fuelLog({ totalCost: 50 }),
  fuelLog({ totalCost: 30 }),
];

const maintenanceLogs: MaintenanceLog[] = [
  maintenanceLog({ cost: 100 }),
  maintenanceLog({ cost: 50 }),
];

describe("calculateFuelConsumption", () => {
  it("returns null when there are fewer than two full-tank logs", () => {
    expect(calculateFuelConsumption([])).toBeNull();
    expect(calculateFuelConsumption([fuelLog({ odometer: 1000 })])).toBeNull();
    expect(
      calculateFuelConsumption([
        fuelLog({ odometer: 1000 }),
        fuelLog({ odometer: 1300, isFullTank: false }),
      ]),
    ).toBeNull();
  });

  it("does not count the first full-tank log's fuel", () => {
    const result = calculateFuelConsumption([
      fuelLog({ odometer: 1000, fuelAmount: 40 }),
      fuelLog({ odometer: 1500, fuelAmount: 30 }),
      fuelLog({ odometer: 2000, fuelAmount: 35 }),
    ]);

    expect(result).toBeCloseTo(6.5);
  });

  it("counts partial fills between two full tanks", () => {
    const result = calculateFuelConsumption([
      fuelLog({ odometer: 1000, fuelAmount: 40 }),
      fuelLog({ odometer: 1300, fuelAmount: 10, isFullTank: false }),
      fuelLog({ odometer: 1500, fuelAmount: 30 }),
    ]);

    expect(result).toBeCloseTo(8);
  });

  it("ignores partial fills after the last full tank", () => {
    const result = calculateFuelConsumption([
      fuelLog({ odometer: 1000, fuelAmount: 40 }),
      fuelLog({ odometer: 1300, fuelAmount: 10, isFullTank: false }),
      fuelLog({ odometer: 1500, fuelAmount: 30 }),
      fuelLog({ odometer: 1800, fuelAmount: 20, isFullTank: false }),
    ]);

    expect(result).toBeCloseTo(8);
  });

  it("skips an interval with no distance and still uses the rest", () => {
    const result = calculateFuelConsumption([
      fuelLog({ odometer: 1000, fuelAmount: 40 }),
      fuelLog({ odometer: 1000, fuelAmount: 10, isFullTank: false }),
      fuelLog({ odometer: 1500, fuelAmount: 30 }),
    ]);

    expect(result).toBeCloseTo(6);
  });

  it("gives the same result whatever order the logs are in, and leaves the input unchanged", () => {
    const logs = [
      fuelLog({ odometer: 1500, fuelAmount: 30 }),
      fuelLog({ odometer: 1000, fuelAmount: 40 }),
    ];

    const logsCopy = [...logs];
    const result1 = calculateFuelConsumption(logs);
    const result2 = calculateFuelConsumption([...logs].reverse());

    expect(result1).toEqual(result2);
    expect(logs).toEqual(logsCopy);
  });
});

describe("calculateFuelConsumptionSeries", () => {
  it("returns an empty array when there are fewer than two full-tank logs", () => {
    expect(calculateFuelConsumptionSeries([])).toEqual([]);
    expect(
      calculateFuelConsumptionSeries([fuelLog({ odometer: 1000 })]),
    ).toEqual([]);
  });

  it("returns one entry per interval, dated by the later log", () => {
    const feb = new Date("2026-02-01T12:00:00Z");
    const mar = new Date("2026-03-01T12:00:00Z");

    const result = calculateFuelConsumptionSeries([
      fuelLog({
        odometer: 1000,
        fuelAmount: 40,
        date: new Date("2026-01-01T12:00:00Z"),
      }),
      fuelLog({ odometer: 1100, fuelAmount: 10, date: feb }),
      fuelLog({ odometer: 1500, fuelAmount: 20, date: mar }),
    ]);

    expect(result).toHaveLength(2);
    expect(result[0].date).toEqual(feb);
    expect(result[0].consumptionRate).toBeCloseTo(10);
    expect(result[1].date).toEqual(mar);
    expect(result[1].consumptionRate).toBeCloseTo(5);
  });

  it("counts partial fills inside an interval", () => {
    const result = calculateFuelConsumptionSeries([
      fuelLog({ odometer: 1000, fuelAmount: 40 }),
      fuelLog({ odometer: 1300, fuelAmount: 10, isFullTank: false }),
      fuelLog({ odometer: 1500, fuelAmount: 30 }),
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].consumptionRate).toBeCloseTo(8);
  });

  it("skips an interval with no distance", () => {
    const result = calculateFuelConsumptionSeries([
      fuelLog({ odometer: 1000, fuelAmount: 40 }),
      fuelLog({ odometer: 1000, fuelAmount: 10, isFullTank: false }),
      fuelLog({ odometer: 1500, fuelAmount: 30 }),
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].consumptionRate).toBeCloseTo(6);
  });
});

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

describe("calculateCostPerDistance", () => {
  it("returns null when there are no logs", () => {
    expect(calculateCostPerDistance(vehicle(), [], [])).toBeNull();
  });

  it("returns null when no distance was covered", () => {
    const result = calculateCostPerDistance(
      vehicle({ initialOdometer: 1000 }),
      [fuelLog({ odometer: 1000 })],
      [],
    );

    expect(result).toBeNull();
  });

  it("divides total spend by the distance since the starting odometer", () => {
    const result = calculateCostPerDistance(
      vehicle({ initialOdometer: 1000 }),
      [fuelLog({ odometer: 1500, totalCost: 50 })],
      [maintenanceLog({ odometer: 2000, cost: 150 })],
    );

    expect(result).toBeCloseTo(0.2);
  });

  it("gives the same result whatever order the logs are in", () => {
    const logs = [
      fuelLog({ odometer: 1500, totalCost: 50 }),
      fuelLog({ odometer: 2000, totalCost: 150 }),
    ];
    const start = vehicle({ initialOdometer: 1000 });

    expect(calculateCostPerDistance(start, logs, [])).toBeCloseTo(0.2);
    expect(
      calculateCostPerDistance(start, [...logs].reverse(), []),
    ).toBeCloseTo(0.2);
  });
});

describe("spendByMonth", () => {
  it("returns an empty array when there are no logs", () => {
    expect(spendByMonth([], [])).toEqual([]);
  });

  it("adds fuel and maintenance spend from the same month together", () => {
    expect(spendByMonth(fuelLogs, maintenanceLogs)).toEqual([
      { amount: 230, month: "2026-01" },
    ]);
  });

  it("returns months in chronological order whatever order the logs are in", () => {
    const result = spendByMonth(
      [
        fuelLog({ date: new Date("2026-03-10T12:00:00Z"), totalCost: 30 }),
        fuelLog({ date: new Date("2026-01-10T12:00:00Z"), totalCost: 10 }),
        fuelLog({ date: new Date("2026-02-10T12:00:00Z"), totalCost: 20 }),
      ],
      [],
    );

    expect(result.map((entry) => entry.month)).toEqual([
      "2026-01",
      "2026-02",
      "2026-03",
    ]);
  });

  it("pads single-digit months so September sorts before October", () => {
    const result = spendByMonth(
      [],
      [
        maintenanceLog({ date: new Date("2026-09-10T12:00:00Z") }),
        maintenanceLog({ date: new Date("2026-10-10T12:00:00Z") }),
      ],
    );

    expect(result.map((entry) => entry.month)).toEqual(["2026-09", "2026-10"]);
  });

  it("sorts December of one year before January of the next", () => {
    const result = spendByMonth(
      [],
      [
        maintenanceLog({ date: new Date("2026-01-10T12:00:00Z") }),
        maintenanceLog({ date: new Date("2025-12-10T12:00:00Z") }),
      ],
    );

    expect(result.map((entry) => entry.month)).toEqual(["2025-12", "2026-01"]);
  });

  it("keeps the same month of different years separate", () => {
    const result = spendByMonth(
      [
        fuelLog({ date: new Date("2025-01-10T12:00:00Z"), totalCost: 10 }),
        fuelLog({ date: new Date("2026-01-10T12:00:00Z"), totalCost: 20 }),
      ],
      [],
    );

    expect(result).toEqual([
      { month: "2025-01", amount: 10 },
      { month: "2026-01", amount: 20 },
    ]);
  });

  it("puts a log at the end of a month in that month, whatever the machine's timezone", () => {
    const result = spendByMonth(
      [fuelLog({ date: new Date("2026-02-01T00:30:00Z") })],
      [],
    );

    expect(result).toEqual([{ month: "2026-02", amount: 60 }]);
  });
});

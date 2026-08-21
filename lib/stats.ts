import {
  fuelLogsTable,
  maintenanceLogsTable,
  vehiclesTable,
} from "@/db/schema";

type FuelLog = typeof fuelLogsTable.$inferSelect;
type MaintenanceLog = typeof maintenanceLogsTable.$inferSelect;
type Vehicle = typeof vehiclesTable.$inferSelect;

/**
 * Average fuel consumption in L/100km, computed only across full-tank-to-full-tank
 * intervals (partial fills are folded into the interval they fall within,
 * not treated as their own boundary).
 *
 * Returns null if there aren't at least two full-tank logs to form an interval.
 */
export function calculateFuelConsumption(fuelLogs: FuelLog[]): number | null {
  const sorted = [...fuelLogs].sort((a, b) => a.odometer - b.odometer);
  const fillUps = sorted.filter((log) => log.isFullTank);

  if (fillUps.length < 2) return null;

  let totalDistance = 0;
  let totalFuel = 0;

  for (let i = 1; i < fillUps.length; i++) {
    const prev = fillUps[i - 1];
    const curr = fillUps[i];
    const distance = curr.odometer - prev.odometer;

    if (distance <= 0) continue; // skip bad/out-of-order data rather than divide by zero

    // sum all fuel added between these two full-tank points (includes any partial fills)
    const fuelInInterval = sorted
      .filter(
        (log) => log.odometer > prev.odometer && log.odometer <= curr.odometer,
      )
      .reduce((sum, log) => sum + log.fuelAmount, 0);

    totalDistance += distance;
    totalFuel += fuelInInterval;
  }

  if (totalDistance === 0) return null;

  return (totalFuel / totalDistance) * 100; // L/100km
}

/**
 * Fuel consumption per individual full-tank-to-full-tank interval, useful for
 * charting a trend over time rather than a single rolling average.
 * Each entry is tagged with the date of the *later* log in the interval.
 */
export function calculateFuelConsumptionSeries(
  fuelLogs: FuelLog[],
): { date: Date; consumptionRate: number }[] {
  const sorted = [...fuelLogs].sort((a, b) => a.odometer - b.odometer);
  const fillUps = sorted.filter((log) => log.isFullTank);

  const series: { date: Date; consumptionRate: number }[] = [];

  for (let i = 1; i < fillUps.length; i++) {
    const prev = fillUps[i - 1];
    const curr = fillUps[i];
    const distance = curr.odometer - prev.odometer;

    if (distance <= 0) continue;

    const fuelInInterval = sorted
      .filter(
        (log) => log.odometer > prev.odometer && log.odometer <= curr.odometer,
      )
      .reduce((sum, log) => sum + log.fuelAmount, 0);

    series.push({
      date: curr.date,
      consumptionRate: (fuelInInterval / distance) * 100,
    });
  }

  return series;
}

/**
 * Total spend across fuel + maintenance.
 */
export function totalSpend(
  fuelLogs: FuelLog[],
  maintenanceLogs: MaintenanceLog[],
): {
  fuel: number;
  maintenance: number;
  total: number;
} {
  const fuel = fuelLogs.reduce((sum, log) => sum + log.totalCost, 0);
  const maintenance = maintenanceLogs.reduce((sum, log) => sum + log.cost, 0);

  return { fuel, maintenance, total: fuel + maintenance };
}

/**
 * Maintenance spend broken down by type (oil_change, tires, etc.).
 */
export function spendByMaintenanceType(
  maintenanceLogs: MaintenanceLog[],
): Record<string, number> {
  return maintenanceLogs.reduce<Record<string, number>>((acc, log) => {
    acc[log.type] = (acc[log.type] ?? 0) + log.cost;
    return acc;
  }, {});
}

/**
 * Overall cost per km driven — total money spent (fuel + maintenance) divided by
 * total distance covered since the vehicle's first recorded odometer reading.
 * Returns null if there's no meaningful distance to divide by yet.
 */
export function calculateCostPerDistance(
  vehicle: Vehicle,
  fuelLogs: FuelLog[],
  maintenanceLogs: MaintenanceLog[],
): number | null {
  const allOdometers = [
    vehicle.initialOdometer,
    ...fuelLogs.map((l) => l.odometer),
    ...maintenanceLogs.map((l) => l.odometer),
  ];

  if (allOdometers.length < 2) return null;

  const distance = Math.max(...allOdometers) - Math.min(...allOdometers);
  if (distance <= 0) return null;

  const { total } = totalSpend(fuelLogs, maintenanceLogs);

  return total / distance;
}

/**
 * Monthly spend series (fuel + maintenance combined), keyed by "YYYY-MM",
 * for a spend-over-time chart.
 */
export function spendByMonth(
  fuelLogs: FuelLog[],
  maintenanceLogs: MaintenanceLog[],
): { month: string; amount: number }[] {
  const monthly: Record<string, number> = {};

  const addToMonth = (date: Date, amount: number) => {
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthly[key] = (monthly[key] ?? 0) + amount;
  };

  fuelLogs.forEach((log) => addToMonth(log.date, log.totalCost));
  maintenanceLogs.forEach((log) => addToMonth(log.date, log.cost));

  return Object.entries(monthly)
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

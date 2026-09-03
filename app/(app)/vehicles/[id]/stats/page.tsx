import { notFound } from "next/navigation";
import { getVehicle } from "@/db/queries/vehicles";
import { getFuelLogs } from "@/db/queries/fuel-logs";
import { getMaintenanceLogs } from "@/db/queries/maintenance-logs";
import {
  calculateFuelConsumption,
  calculateFuelConsumptionSeries,
  totalSpend,
  spendByMaintenanceType,
  spendByMonth,
  calculateCostPerDistance,
} from "@/lib/stats";
import StatsCard from "@/components/stats/StatsCard";
import ConsumptionChart from "@/components/stats/ConsumptionChart";
import SpendByMonthChart from "@/components/stats/SpendByMonthChart";

export default async function VehicleStatsPage({
  params,
}: PageProps<"/vehicles/[id]/stats">) {
  const { id } = await params;
  const vehicleId = Number(id);

  const vehicle = await getVehicle(vehicleId);
  if (!vehicle) return notFound();

  const [fuelLogs, maintenanceLogs] = await Promise.all([
    getFuelLogs(vehicleId),
    getMaintenanceLogs(vehicleId),
  ]);

  const avgConsumption = calculateFuelConsumption(fuelLogs);
  const consumptionSeries = calculateFuelConsumptionSeries(fuelLogs);
  const spend = totalSpend(fuelLogs, maintenanceLogs);
  const maintenanceBreakdown = spendByMaintenanceType(maintenanceLogs);
  const monthlySpend = spendByMonth(fuelLogs, maintenanceLogs);
  const costPerDistance = calculateCostPerDistance(
    vehicle,
    fuelLogs,
    maintenanceLogs,
  );

  return (
    <div>
      <h1>
        Stats —{" "}
        {vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      </h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatsCard
          label="Avg. Consumption"
          value={
            avgConsumption !== null
              ? `${avgConsumption.toFixed(1)} L/100km`
              : "—"
          }
        />
        <StatsCard
          label="Cost per Distance"
          value={costPerDistance !== null ? costPerDistance.toFixed(2) : "—"}
        />
        <StatsCard label="Total Fuel Spend" value={spend.fuel.toFixed(2)} />
        <StatsCard
          label="Total Maintenance Spend"
          value={spend.maintenance.toFixed(2)}
        />
      </div>

      {consumptionSeries.length > 0 && (
        <section>
          <h2>Consumption Over Time</h2>
          <ConsumptionChart data={consumptionSeries} />
        </section>
      )}

      {monthlySpend.length > 0 && (
        <section>
          <h2>Spend by Month</h2>
          <SpendByMonthChart data={monthlySpend} />
        </section>
      )}

      {Object.keys(maintenanceBreakdown).length > 0 && (
        <section>
          <h2>Maintenance by Type</h2>
          <ul>
            {Object.entries(maintenanceBreakdown).map(([type, cost]) => (
              <li key={type}>
                <span>{type.replace("_", " ")}</span>
                <span>{cost.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {fuelLogs.length === 0 && maintenanceLogs.length === 0 && (
        <p>No logs yet — stats will appear once you add some.</p>
      )}
    </div>
  );
}

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
import BackLink from "@/components/ui/BackLink";

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

  const hasData = fuelLogs.length > 0 || maintenanceLogs.length > 0;
  const vehicleName = vehicle.nickname || `${vehicle.make} ${vehicle.model}`;

  return (
    <>
      <BackLink
        href={`/vehicles/${vehicle.id}`}
        label={`Back to ${vehicleName}`}
      />
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <h1>Stats — {vehicleName}</h1>

        {!hasData ? (
          <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-sm text-text-secondary">
            No logs yet — stats will appear once you add fuel or service
            entries.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-3">
              <StatsCard
                label="Avg. consumption"
                value={
                  avgConsumption !== null ? avgConsumption.toFixed(1) : "—"
                }
                unit={avgConsumption !== null ? "L/100km" : undefined}
              />
              <StatsCard
                label="Cost per km"
                value={
                  costPerDistance !== null
                    ? `$${costPerDistance.toFixed(2)}`
                    : "—"
                }
              />
              <StatsCard
                label="Fuel spend"
                value={`$${spend.fuel.toFixed(2)}`}
              />
              <StatsCard
                label="Maintenance spend"
                value={`$${spend.maintenance.toFixed(2)}`}
              />
            </div>

            {consumptionSeries.length > 0 && (
              <section className="rounded-xl border border-border bg-surface p-5">
                <h2 className="mb-3">Consumption over time</h2>
                <ConsumptionChart data={consumptionSeries} />
              </section>
            )}

            {monthlySpend.length > 0 && (
              <section className="rounded-xl border border-border bg-surface p-5">
                <h2 className="mb-3">Spend by month</h2>
                <SpendByMonthChart data={monthlySpend} />
              </section>
            )}

            {Object.keys(maintenanceBreakdown).length > 0 && (
              <section className="rounded-xl border border-border bg-surface p-5">
                <h2 className="mb-3">Maintenance by type</h2>
                <ul className="flex flex-col">
                  {Object.entries(maintenanceBreakdown).map(
                    ([type, cost], i, arr) => (
                      <li
                        key={type}
                        className={`flex items-center justify-between py-2 text-sm ${
                          i < arr.length - 1 ? "border-b border-border" : ""
                        }`}
                      >
                        <span className="capitalize">
                          {type.replace("_", " ")}
                        </span>
                        <span className="font-mono">${cost.toFixed(2)}</span>
                      </li>
                    ),
                  )}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}

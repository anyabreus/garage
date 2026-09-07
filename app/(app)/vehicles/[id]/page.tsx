import Link from "next/link";
import { notFound } from "next/navigation";
import { BarChart3, Settings } from "lucide-react";
import { getVehicle } from "@/db/queries/vehicles";
import { getVehicleTimeline } from "@/db/queries/timeline";
import AddLogButtons from "@/components/logs/AddLogButtons";
import AddReminderButton from "@/components/reminders/AddReminderButton";
import Timeline from "@/components/timeline/Timeline";

export default async function VehiclePage({
  params,
}: PageProps<"/vehicles/[id]">) {
  const { id } = await params;
  const vehicleId = Number(id);

  const vehicleData = await getVehicle(vehicleId);
  if (!vehicleData) return notFound();

  const timeline = await getVehicleTimeline(vehicleId);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-text-secondary">
            {vehicleData.nickname || `${vehicleData.make} ${vehicleData.model}`}
          </p>
          <h1>
            {vehicleData.year} {vehicleData.make} {vehicleData.model}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <AddLogButtons />
            <AddReminderButton />
          </div>
          <Link
            href={`/vehicles/${vehicleId}/stats`}
            aria-label="Stats"
            className="text-text-secondary hover:text-foreground"
          >
            <BarChart3 size={18} />
          </Link>
          <Link
            href={`/vehicles/${vehicleId}/settings`}
            aria-label="Settings"
            className="text-text-secondary hover:text-foreground"
          >
            <Settings size={18} />
          </Link>
        </div>
      </div>

      <h2>History</h2>
      {timeline.length === 0 ? (
        <p className="text-sm text-text-secondary">No logs yet.</p>
      ) : (
        <Timeline entries={timeline} />
      )}
    </div>
  );
}

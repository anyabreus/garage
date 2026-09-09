import { TimelineEntry } from "@/types/timeline";
import DeleteLogButton from "./DeleteLogButton";
import { Wrench, Fuel } from "lucide-react";

const TIMELINE_STYLES = {
  fuel: { Icon: Fuel, iconColor: "text-signal" },
  maintenance: { Icon: Wrench, iconColor: "text-coolant" },
} as const;

export default function TimelineItem({ entry }: { entry: TimelineEntry }) {
  const { Icon, iconColor } = TIMELINE_STYLES[entry.kind];

  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon size={16} className={`mt-0.5 ${iconColor} self-center`} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          {entry.kind === "fuel" ? (
            <span className="text-sm">Fuel — {entry.data.fuelAmount} L</span>
          ) : (
            <span className="text-sm capitalize">
              {entry.data.type.replace("_", " ")}
            </span>
          )}
          <span className="font-mono text-sm">
            $
            {(entry.kind === "fuel"
              ? entry.data.totalCost
              : entry.data.cost
            ).toFixed(2)}
          </span>
        </div>

        <p className="mt-0.5 text-xs text-text-secondary">
          {entry.data.odometer.toLocaleString()} km ·{" "}
          {entry.date.toDateString()}
        </p>

        {entry.kind === "maintenance" && entry.data.description && (
          <p className="mt-1 text-xs text-text-secondary">
            {entry.data.description}
          </p>
        )}
      </div>

      <DeleteLogButton kind={entry.kind} logId={entry.data.id} />
    </div>
  );
}

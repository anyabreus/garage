import { TimelineEntry } from "@/types/timeline";
import DeleteLogButton from "./DeleteLogButton";

const TIMELINE_STYLES = {
  fuel: { border: "border-blue-500", icon: "⛽" },
  maintenance: { border: "border-orange-500", icon: "🔧" },
} as const;

export default function TimelineItem({ entry }: { entry: TimelineEntry }) {
  const { border, icon } = TIMELINE_STYLES[entry.kind];

  return (
    <div className={`border-l-4 ${border} pl-3 py-2 space-y-1`}>
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        {entry.kind === "fuel" ? (
          <strong>
            {entry.data.fuelAmount} L — {entry.data.totalCost.toFixed(2)}
          </strong>
        ) : (
          <strong>
            {entry.data.type.replace("_", " ")} — {entry.data.cost.toFixed(2)}
          </strong>
        )}
      </div>

      <div>
        {entry.data.odometer} km · {entry.date.toDateString()}
      </div>

      {entry.kind === "maintenance" && entry.data.description && (
        <div>{entry.data.description}</div>
      )}

      <DeleteLogButton kind={entry.kind} logId={entry.data.id} />
    </div>
  );
}

import TimelineItem from "@/components/timeline/TimelineItem";
import { TimelineEntry } from "@/types/timeline";

export default function Timeline({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-text-secondary">No logs yet.</p>;
  }

  return (
    <ul>
      {entries.map((entry, i) => (
        <li
          key={`${entry.kind}-${entry.data.id}`}
          className={i < entries.length - 1 ? "border-b border-border" : ""}
        >
          <TimelineItem entry={entry} />
        </li>
      ))}
    </ul>
  );
}

export default function StatsCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs text-text-secondary">{label}</p>
      <p className="mt-1 font-mono text-lg font-medium">
        {value}
        {unit && (
          <span className="ml-1 text-xs font-sans font-normal text-text-secondary">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}

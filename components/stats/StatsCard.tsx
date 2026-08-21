export default function StatsCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border p-3">
      <div>{label}</div>
      <div>{value}</div>
    </div>
  );
}

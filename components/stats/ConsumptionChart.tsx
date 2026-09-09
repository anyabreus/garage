"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ConsumptionChart({
  data,
}: {
  data: { date: Date; consumptionRate: number }[];
}) {
  const chartData = data.map((d) => ({
    date: d.date.toISOString().split("T")[0],
    value: Number(d.consumptionRate.toFixed(2)),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData}>
        <CartesianGrid
          stroke="var(--color-border)"
          strokeDasharray="3 3"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          stroke="var(--color-text-secondary)"
          fontSize={11}
          tickLine={false}
        />
        <YAxis
          stroke="var(--color-text-secondary)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-signal)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

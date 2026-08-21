"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#3b82f6" />
      </LineChart>
    </ResponsiveContainer>
  );
}

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SpendByMonthChart({
  data,
}: {
  data: { month: string; amount: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid
          stroke="var(--color-border)"
          strokeDasharray="3 3"
          vertical={false}
        />
        <XAxis
          dataKey="month"
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
        <Bar
          dataKey="amount"
          fill="var(--color-coolant)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

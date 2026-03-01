"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { CategorySpending } from "@/lib/api";

const PIE_COLORS = [
  "#ED6E09",
  "#2D7DD2",
  "#97CE4C",
  "#F45D01",
  "#6C63FF",
  "#00B4D8",
  "#9D4EDD",
  "#2EC4B6",
  "#FF6B6B",
];

interface BudgetPieChartProps {
  categories: CategorySpending[];
}

export function BudgetPieChart({ categories }: BudgetPieChartProps) {
  const pieData = categories
    .filter((cat) => cat.amount > 0)
    .map((cat, i) => ({
      name: cat.label,
      value: cat.amount,
      fill: PIE_COLORS[i % PIE_COLORS.length],
      group: cat.group,
    }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {pieData.map((entry) => (
              <Cell key={`${entry.name}-${entry.value}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number | undefined) => [
              `$${(value ?? 0).toFixed(0)}`,
              "Amount",
            ]}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid rgba(66, 74, 86, 0.2)",
              borderRadius: "8px",
            }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(value) => (
              <span className="text-sm text-[#424A56]">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

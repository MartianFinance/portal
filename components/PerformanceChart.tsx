"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const mockData = [
  { time: "00:00", profit: 0 },
  { time: "04:00", profit: 245 },
  { time: "08:00", profit: 420 },
  { time: "12:00", profit: 680 },
  { time: "16:00", profit: 890 },
  { time: "20:00", profit: 1050 },
  { time: "24:00", profit: 1284 },
]

export function PerformanceChart() {
  return (
    <Card className="p-6 border-border/50 bg-background/50">
      <h2 className="text-lg font-semibold mb-4">Cumulative Profit (24h)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
          <YAxis stroke="rgba(255,255,255,0.5)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15, 15, 15, 0.9)",
              border: "1px solid rgba(255, 87, 34, 0.3)",
              borderRadius: "8px",
            }}
            formatter={(value) => `$${value}`}
          />
          <Line
            type="monotone"
            dataKey="profit"
            stroke="hsl(var(--color-primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--color-primary))", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

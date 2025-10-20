"use client"

import { Card } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, CheckCircle, AlertCircle } from "lucide-react"

interface Activity {
  id: string
  type: "buy" | "sell" | "success" | "error"
  pair: string
  amount: string
  profit: string
  timestamp: string
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "success",
    pair: "SOL/USDC",
    amount: "10.5 SOL",
    profit: "+$124.50",
    timestamp: "2 min ago",
  },
  {
    id: "2",
    type: "buy",
    pair: "RAY/SOL",
    amount: "250 RAY",
    profit: "+$45.20",
    timestamp: "5 min ago",
  },
  {
    id: "3",
    type: "sell",
    pair: "ORCA/USDC",
    amount: "500 ORCA",
    profit: "+$89.75",
    timestamp: "8 min ago",
  },
  {
    id: "4",
    type: "success",
    pair: "SOL/USDC",
    amount: "5.2 SOL",
    profit: "+$62.30",
    timestamp: "12 min ago",
  },
  {
    id: "5",
    type: "buy",
    pair: "COPE/SOL",
    amount: "1000 COPE",
    profit: "+$28.90",
    timestamp: "15 min ago",
  },
]

export function ActivityFeed() {
  return (
    <Card className="p-6 border-border/50 bg-background/50">
      <h2 className="text-lg font-semibold mb-4">Live Activity</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {mockActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                {activity.type === "buy" && <ArrowDownLeft className="w-4 h-4 text-accent" />}
                {activity.type === "sell" && <ArrowUpRight className="w-4 h-4 text-primary" />}
                {activity.type === "success" && <CheckCircle className="w-4 h-4 text-green-500" />}
                {activity.type === "error" && <AlertCircle className="w-4 h-4 text-red-500" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.pair}</p>
                <p className="text-xs text-muted-foreground">{activity.amount}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-500">{activity.profit}</p>
              <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

'use client'

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, Circle } from "lucide-react"

interface StatCardProps {
  label: string
  value: string
  change?: string
  changePositive?: boolean
  status?: "active" | "inactive"
  isLoading?: boolean
}

export function StatCard({ label, value, change, changePositive, status, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <Card className="p-6 border-border/50 bg-background/50">
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-8 w-1/2" />
        {change && <Skeleton className="h-4 w-1/4 mt-2" />}
      </Card>
    )
  }

  return (
    <Card className="p-6 border-border/50 bg-background/50 hover:bg-background/80 transition">
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        {status && (
          <div className="flex items-center gap-1">
            <Circle
              className={`w-2 h-2 ${
                status === "active" ? "fill-green-500 text-green-500" : "fill-red-500 text-red-500"
              }`}
            />
            <span className={`text-xs ${status === "active" ? "text-green-500" : "text-red-500"}`}>
              {status === "active" ? "Live" : "Offline"}
            </span>
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className={`w-4 h-4 ${changePositive ? "text-green-500" : "text-red-500"}`} />
              <span className={`text-sm ${changePositive ? "text-green-500" : "text-red-500"}`}>{change}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

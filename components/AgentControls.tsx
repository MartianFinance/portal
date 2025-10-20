"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Power, Loader2 } from "lucide-react"
import { useAgentStatus } from "@/hooks/useAgentStatus"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AgentControls() {
  const { status, isLoading, error, startAgent, stopAgent } = useAgentStatus()
  const [pools, setPools] = useState({
    raydium: true,
    orca: true,
    segaswap: true,
  })

  const togglePool = (pool: keyof typeof pools) => {
    setPools((prev) => ({ ...prev, [pool]: !prev[pool] }))
  }

  const handleToggle = () => {
    if (status?.active) {
      stopAgent()
    } else {
      startAgent()
    }
  }

  const isActive = status?.active ?? false

  return (
    <Card className="p-6 border-border/50 bg-background/50">
      <h2 className="text-lg font-semibold mb-6">Agent Controls</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Master Toggle */}
      <div className="mb-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Agent Status</p>
            <p className="text-sm text-muted-foreground">
              {isLoading && !status ? "Loading..." : isActive ? "Running" : "Stopped"}
            </p>
          </div>
          <Button
            onClick={handleToggle}
            disabled={isLoading}
            className={`gap-2 ${isActive ? "bg-green-600 hover:bg-green-700" : "bg-muted hover:bg-muted/80"}`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Power className="w-4 h-4" />
            )}
            {isActive ? "Stop" : "Start"}
          </Button>
        </div>
      </div>

      {/* Monitored Pools */}
      <div>
        <h3 className="font-semibold mb-4">Monitored Pools</h3>
        <div className="space-y-3">
          {[
            { id: "raydium", label: "Raydium", icon: "◎" },
            { id: "orca", label: "Orca", icon: "🐋" },
            { id: "segaswap", label: "SegaSwap", icon: "⚡" },
          ].map((pool) => (
            <label
              key={pool.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition"
            >
              <Checkbox
                checked={pools[pool.id as keyof typeof pools]}
                onCheckedChange={() => togglePool(pool.id as keyof typeof pools)}
              />
              <span className="text-lg">{pool.icon}</span>
              <span className="text-sm font-medium">{pool.label}</span>
            </label>
          ))}
        </div>
      </div>
    </Card>
  )
}

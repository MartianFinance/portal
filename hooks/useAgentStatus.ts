"use client"

import { useState, useEffect, useCallback } from "react"

export interface AgentStatus {
  active: boolean
  pnl: number
  trades: number
}

export function useAgentStatus() {
  const [status, setStatus] = useState<AgentStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/status")
      if (!response.ok) {
        throw new Error("Failed to fetch agent status")
      }
      const data = await response.json()
      setStatus(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const startAgent = useCallback(async () => {
    try {
      const response = await fetch("/api/start", { method: "POST" })
      if (!response.ok) {
        throw new Error("Failed to start agent")
      }
      await fetchStatus()
    } catch (err: any) {
      setError(err.message)
    }
  }, [fetchStatus])

  const stopAgent = useCallback(async () => {
    try {
      const response = await fetch("/api/stop", { method: "POST" })
      if (!response.ok) {
        throw new Error("Failed to stop agent")
      }
      await fetchStatus()
    } catch (err: any) {
      setError(err.message)
    }
  }, [fetchStatus])

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 5000) // Poll every 5 seconds
    return () => clearInterval(interval)
  }, [fetchStatus])

  return { status, isLoading, error, startAgent, stopAgent }
}
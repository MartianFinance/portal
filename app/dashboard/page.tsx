'use client'

import { Header } from '@/components/Header'
import { StatCard } from '@/components/StatCard'
import { AgentControls } from '@/components/AgentControls'
import { ActivityFeed } from '@/components/ActivityFeed'
import { PerformanceChart } from '@/components/PerformanceChart'
import { useAgentStatus } from '@/hooks/useAgentStatus'

export default function Dashboard() {
  const { status, isLoading } = useAgentStatus()

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Profit"
            value={status ? formatCurrency(status.pnl) : '...'}
            isLoading={isLoading}
          />
          <StatCard label="24h Trades" value={status ? status.trades.toString() : '...'} isLoading={isLoading} />
          <StatCard label="Success Rate" value="96%" isLoading={isLoading} />
          <StatCard
            label="Agent Status"
            value={status?.active ? 'Active' : 'Inactive'}
            status={status?.active ? 'active' : 'inactive'}
            isLoading={isLoading}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Controls and Activity */}
          <div className="lg:col-span-1 space-y-8">
            <AgentControls />
          </div>

          {/* Right Column - Chart and Feed */}
          <div className="lg:col-span-2 space-y-8">
            <PerformanceChart />
            <ActivityFeed />
          </div>
        </div>
      </main>
    </div>
  )
}

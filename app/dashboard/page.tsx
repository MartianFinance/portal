'use client'

import { useState, useEffect, useRef } from 'react'
import { Header } from '@/components/Header'
import { StatCard } from '@/components/StatCard'
import { AgentControls } from '@/components/AgentControls'
import { ActivityFeed } from '@/components/ActivityFeed'
import { PerformanceChart } from '@/components/PerformanceChart'
import { useAgentStatus } from '@/hooks/useAgentStatus'

export default function Dashboard() {
  const { status, isLoading } = useAgentStatus()
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'agent'; text: string }[]>([])
  const [isSending, setIsSending] = useState(false)
  const spotlightRef = useRef<HTMLDivElement>(null)

  // Mouse tracking effect
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (spotlightRef.current) {
        const { clientX, clientY } = event
        spotlightRef.current.style.left = `${clientX}px`
        spotlightRef.current.style.top = `${clientY}px`
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    setIsSending(true)
    const newHistory = [...chatHistory, { sender: 'user' as const, text: message }]
    setChatHistory(newHistory)
    const currentMessage = message
    setMessage('')

    try {
      const response = await fetch('http://127.0.0.1:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentMessage }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()

      setChatHistory([...newHistory, { sender: 'agent' as const, text: data.response }])
    } catch (error) {
      console.error('Failed to send message:', error)
      setChatHistory([...newHistory, { sender: 'agent' as const, text: 'Sorry, I encountered an error.' }])
    } finally {
      setIsSending(false)
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

  return (
    <div className="min-h-screen bg-background">
      <div ref={spotlightRef} className="spotlight" />
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
          {/* Left Column - Controls and Chat */}
          <div className="lg:col-span-1 space-y-8">
            <AgentControls />

            {/* Chat with Martian */}
            <div className="bg-card p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Chat with Martian</h3>
              <div className="space-y-4 h-64 overflow-y-auto mb-4 p-2 border rounded bg-background">
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        chat.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                      {chat.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                  placeholder="Ask Martian anything..."
                  className="flex-grow bg-input border px-3 py-2 rounded"
                  disabled={isSending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isSending}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded disabled:opacity-50">
                  {isSending ? '...' : 'Send'}
                </button>
              </div>
            </div>
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

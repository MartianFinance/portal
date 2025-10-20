'use client'

import WalletConnect from '@/components/WalletConnect'

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/Martian-Logo.png" alt="Martian Logo" className="w-10 h-10" />
          <div>
            <h1 className="text-xl font-bold">Martian</h1>
            <p className="text-xs text-muted-foreground">DeFi Arbitrage Agent</p>
          </div>
        </div>
        <WalletConnect />
      </div>
    </header>
  )
}

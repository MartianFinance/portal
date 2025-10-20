'use client';

import WalletConnect from '@/components/WalletConnect';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ConnectWalletPage() {
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (connected) {
      // The drawer will open automatically from the WalletConnect component
    }
  }, [connected, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Connect Your Wallet</h1>
        <p className="text-muted-foreground mb-8">
          Please connect your wallet to continue to the dashboard.
        </p>
        <WalletConnect />
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState, useMemo } from "react";
import { User, LogOut, Wallet as WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet, type Wallet } from "@solana/wallet-adapter-react";
import type { WalletName } from "@solana/wallet-adapter-base";
import { Dialog } from "@headlessui/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { shorten } from "@/lib/helper";
import { ConnectionDrawer } from "./ConnectionDrawer";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function WalletConnect() {
  const {
    wallets,
    wallet,
    select,
    connect,
    disconnect,
    connected,
    connecting,
    publicKey,
  } = useWallet();

  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [usdValue, setUsdValue] = useState<number | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  const connection = useMemo(() => 
    new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.mainnet-beta.solana.com'), 
  []);

  // Fetch balance and open drawer on connect
  useEffect(() => {
    if (connected && publicKey) {
      const fetchBalance = async () => {
        setIsBalanceLoading(true);
        try {
          // Fetch SOL balance
          const balance = await connection.getBalance(publicKey);
          const solBalance = balance / LAMPORTS_PER_SOL;

          // Fetch SOL price from CoinGecko
          const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
          if (!priceResponse.ok) {
            throw new Error('Failed to fetch SOL price');
          }
          const priceData = await priceResponse.json();
          const solPrice = priceData.solana.usd;

          setUsdValue(solBalance * solPrice);
        } catch (error) {
          console.error("Failed to fetch wallet balance or price:", error);
          setUsdValue(null); // Set to null on error
        } finally {
          setIsBalanceLoading(false);
        }
      };

      fetchBalance();
      setDrawerOpen(true);
    }
  }, [connected, publicKey, connection]);


  // Detect mobile devices
  useEffect(() => {
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    setIsMobile(mobile);
  }, []);

  // Clear potentially corrupted localStorage data
  useEffect(() => {
    try {
      const saved = localStorage.getItem("walletName");
      if (saved) {
        try {
          JSON.parse(saved);
        } catch {
          localStorage.removeItem("walletName");
        }
      }
    } catch (e) {
      try {
        localStorage.removeItem("walletName");
      } catch (e) {
        console.warn("Could not access localStorage");
      }
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("walletName");
    if (saved && !connected) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed === "string") select(parsed as WalletName);
      } catch {
        if (typeof saved === "string" && saved.length < 50) {
          select(saved as WalletName);
        } else {
          localStorage.removeItem("walletName");
        }
      }
    }
  }, [select, connected]);

  useEffect(() => {
    if (wallet?.adapter.name) {
      localStorage.setItem("walletName", wallet.adapter.name);
    }
  }, [wallet]);

  const handleSelectWallet = async (walletName: WalletName) => {
    select(walletName);
    setModalOpen(false);
    
    if (!isMobile) {
      setTimeout(async () => {
        try {
          await connect();
        } catch (error) {
          console.error("Failed to connect wallet:", error);
        }
      }, 100);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      localStorage.removeItem("walletName");
      window.dispatchEvent(new Event("authchange"));
    } catch (error) {
      console.error("Disconnect failed:", error);
      localStorage.removeItem("walletName");
      window.dispatchEvent(new Event("authchange"));
      window.location.reload();
    }
  };

  const handleManualConnect = async () => {
    if (wallet && isMobile) {
      try {
        await connect();
      } catch (error) {
        console.error("Manual connect failed:", error);
      }
    }
  };

  const handleConnectAnother = () => {
    setDrawerOpen(false);
    handleDisconnect();
    setTimeout(() => {
        setModalOpen(true);
    }, 100)
  }

  return (
    <>
      <div className="w-full max-w-sm space-y-4">
        {connected && publicKey ? (
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm text-muted-foreground">
              {shorten(publicKey.toBase58())}
            </span>
            <Button variant="outline" onClick={handleDisconnect} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </div>
        ) : wallet && isMobile ? (
          <Button
            className="w-full"
            onClick={handleManualConnect}
            disabled={connecting}
          >
            {connecting ? "Connecting..." : `Connect to ${wallet.adapter.name}`}
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={() => setModalOpen(true)}
            disabled={connecting}
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </div>

      {/* Wallet Select Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-sm">
          <Dialog.Panel className="bg-white dark:bg-black p-6 rounded-md w-full max-w-md space-y-4">
            <Dialog.Title className="text-lg font-semibold text-center">
              Select Wallet
            </Dialog.Title>
            <div className="grid gap-3">
              {wallets.map((w: Wallet) => (
                <button
                  key={w.adapter.name}
                  onClick={() => handleSelectWallet(w.adapter.name)}
                  className="flex items-center gap-3 px-4 py-2 border rounded-md hover:bg-muted"
                  disabled={connecting}
                >
                  {w.adapter.icon && (
                    <img
                      src={w.adapter.icon}
                      alt={w.adapter.name}
                      className="w-6 h-6"
                    />
                  )}
                  <span>{w.adapter.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="w-full mt-4 px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
      <ConnectionDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        onConnectAnother={handleConnectAnother}
        publicKey={publicKey?.toBase58() || null}
        usdValue={usdValue}
        isBalanceLoading={isBalanceLoading}
      />
    </>
  );
}
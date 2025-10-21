'use client';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { shorten } from "@/lib/helper";

interface ConnectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectAnother: () => void;
  publicKey: string | null;
  usdValue: number | null;
  isBalanceLoading: boolean;
}

export function ConnectionDrawer({ 
  isOpen, 
  onClose, 
  onConnectAnother, 
  publicKey,
  usdValue,
  isBalanceLoading
}: ConnectionDrawerProps) {
  const router = useRouter();

  const handleProceed = () => {
    router.push('/dashboard');
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm text-center">
          <DrawerHeader>
            <DrawerTitle>Wallet Connected</DrawerTitle>
            <DrawerDescription>Your wallet is now securely connected to Martian.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Public Key</p>
                <p className="text-sm font-mono break-all">{publicKey ? shorten(publicKey) : '...'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Estimated Value</p>
                {isBalanceLoading ? (
                  <p className="text-lg font-bold">Loading...</p>
                ) : (
                  <p className="text-lg font-bold">${usdValue?.toFixed(2) ?? '0.00'}</p>
                )}
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleProceed}>Proceed to Dashboard</Button>
            <Button variant="outline" onClick={onConnectAnother}>Use Another Wallet</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
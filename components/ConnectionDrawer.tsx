'use client';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ConnectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectAnother: () => void;
}

export function ConnectionDrawer({ isOpen, onClose, onConnectAnother }: ConnectionDrawerProps) {
  const router = useRouter();

  const handleProceed = () => {
    router.push('/dashboard');
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Connection Successful</DrawerTitle>
            <DrawerDescription>What would you like to do next?</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button onClick={handleProceed}>Proceed to Dashboard</Button>
            <Button variant="outline" onClick={onConnectAnother}>Connect Another Wallet</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

"use client";
import { useEffect, useState } from "react";
import usePINUnlock from "@/hooks/usePINUnlock";
import PinModal from "@/components/PinModal";
import VaultList from "@/components/VaultList";

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  const { unlocked, setUnlocked, checkPIN } = usePINUnlock();
  const [isPinSet, setIsPinSet] = useState<boolean | null>(null);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (!isClient) return;
    (async () => {
      const pinExists = await checkPIN();
      setIsPinSet(pinExists);
    })();
  }, [isClient, checkPIN]);

  const handleUnlock = () => {
    setUnlocked(true);
    setIsPinSet(true);
  };

  if (isClient && (isPinSet === false || !unlocked)) {
    return <PinModal onUnlock={handleUnlock} isPinSet={isPinSet} />;
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-medium">Initializing...</p>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Your Secure Vault
      </h1>
      <VaultList />
    </main>
  );
}

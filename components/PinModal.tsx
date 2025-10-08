"use client";
import { useState } from "react";
import usePINUnlock from "@/hooks/usePINUnlock";
import { deriveKeyFromPassphrase } from "@/lib/crypto";

interface PinModalProps {
  onUnlock: () => void;
  isPinSet: boolean | null;
}

export default function PinModal({ onUnlock, isPinSet }: PinModalProps) {
  const { setPIN, verifyPIN } = usePINUnlock();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isPinSet === null) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
        <div className="text-white text-lg font-medium animate-pulse">
          Loading vault...
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (pin.length !== 6) {
      setError("PIN must be 6 digits.");
      return;
    }

    setLoading(true);

    let success = false;

    if (isPinSet) {
      success = await verifyPIN(pin);
    } else {
      success = await setPIN(pin);
    }

    if (success) {
      // Derive and store encryption key from PIN
      const key = await deriveKeyFromPassphrase(pin);
      const exportedKey = btoa(
        String.fromCharCode(
          ...new Uint8Array(await crypto.subtle.exportKey("raw", key))
        )
      );
      sessionStorage.setItem("vaultKey", exportedKey);

      onUnlock();
    } else {
      setError(isPinSet ? "Invalid PIN" : "Failed to set PIN");
    }
    setLoading(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          {isPinSet ? "Enter Your PIN" : "Set a New PIN"}
        </h2>
        <p className="text-center text-gray-400 mb-6">
          {isPinSet
            ? "Please enter your 6-digit PIN to unlock the vault."
            : "Choose a secure 6-digit PIN for your vault."}
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={6}
            placeholder="••••••"
            disabled={loading}
            className="w-full text-center tracking-[0.5em] font-mono text-2xl py-4 rounded-xl bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition mb-4"
          />
          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition transform hover:scale-105 disabled:opacity-50"
          >
            {loading
              ? isPinSet
                ? "Verifying..."
                : "Setting PIN..."
              : isPinSet
              ? "Unlock Vault"
              : "Set PIN"}
          </button>
        </form>
      </div>
    </div>
  );
}

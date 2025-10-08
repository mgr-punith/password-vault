"use client";
import { useState, useCallback } from "react";

interface PINResponse {
  isSet?: boolean;
  success?: boolean;
  error?: string;
}

export default function usePINUnlock() {
  const [unlocked, setUnlocked] = useState(false);

  // Fetch wrapper with credentials
  const fetchWithAuth = async (url: string, options?: RequestInit) => {
    return fetch(url, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  };

  // Check if PIN is set
  const checkPIN = useCallback(async (): Promise<boolean | null> => {
    try {
      const res = await fetchWithAuth("/api/vault/has-pin");
      if (!res.ok) return null;
      const data: PINResponse = await res.json();
      return data.isSet ?? null;
    } catch (err) {
      console.error("checkPIN failed:", err);
      return null;
    }
  }, []);

  // Set new PIN
  const setPIN = async (pin: string): Promise<boolean> => {
    try {
      const res = await fetchWithAuth("/api/vault/set-pin", {
        method: "POST",
        body: JSON.stringify({ pin }),
      });
      if (!res.ok) return false;
      return true;
    } catch (err) {
      console.error("Failed to set PIN:", err);
      return false;
    }
  };

  // Verify PIN
  const verifyPIN = async (pin: string): Promise<boolean> => {
    try {
      const res = await fetchWithAuth("/api/vault/verify-pin", {
        method: "POST",
        body: JSON.stringify({ pin }),
      });
      if (!res.ok) return false;
      const data: PINResponse = await res.json();
      if (data.success) setUnlocked(true);
      return data.success ?? false;
    } catch (err) {
      console.error("Failed to verify PIN:", err);
      return false;
    }
  };

  return { unlocked, setUnlocked, checkPIN, setPIN, verifyPIN };
}

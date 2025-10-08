"use client";

import React, { useEffect, useState } from "react";
import PasswordGenerator from "./PasswordGenerator";
import { encryptVaultData } from "@/lib/crypto";

interface VaultFormProps {
  onSave?: () => void;
  initial?: VaultItem | null;
  show: boolean;
  onClose: () => void;
}

export interface VaultItem {
  _id?: string;
  id?: string;
  site: string;
  username: string;
  password: string;
  notes?: string;
}

export default function VaultForm({
  onSave,
  initial,
  show,
  onClose,
}: VaultFormProps) {
  const [site, setSite] = useState(initial?.site || "");
  const [username, setUsername] = useState(initial?.username || "");
  const [password, setPassword] = useState(initial?.password || "");
  const [notes, setNotes] = useState(initial?.notes || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) {
      setSite(initial.site || "");
      setUsername(initial.username || "");
      setPassword(initial.password || "");
      setNotes(initial.notes || "");
    } else {
      setSite("");
      setUsername("");
      setPassword("");
      setNotes("");
    }
  }, [initial]);

  useEffect(() => {
    console.log("VaultForm initial item:", initial);
  }, [initial]);
  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const base64Key = sessionStorage.getItem("vaultKey");
      if (!base64Key) {
        setError("Vault is locked. Please unlock first.");
        setLoading(false);
        return;
      }

      const rawKey = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));
      const key = await crypto.subtle.importKey(
        "raw",
        rawKey,
        "AES-GCM",
        true,
        ["encrypt"]
      );

      const { ciphertext, iv } = await encryptVaultData(
        { site, username, password, notes },
        key
      );

      const endpoint = initial?._id
        ? `/api/vault/update/${initial._id}`
        : "/api/vault/create";

      const method = initial?._id ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ciphertext,
          iv,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save entry");
      }

      onSave?.();
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("VaultForm error:", err);
      setError(err.message || "Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col relative">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">
            {initial ? "Edit Entry" : "Add New Entry"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 text-xl"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="overflow-y-auto px-6 py-4 space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <input
              type="text"
              placeholder="Site or App Name / URL"
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-800"
              required
            />

            <input
              type="text"
              placeholder="Username / Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-800"
              required
            />

            <input
              type="text"
              placeholder="You can select a generated password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-800"
              required
            />

            <textarea
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-800"
              rows={4}
            />

            <PasswordGenerator onSelect={setPassword} />
          </div>

          <div className="p-6 border-t dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {loading ? "Saving..." : initial ? "Save Changes" : "Save Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

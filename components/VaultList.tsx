"use client";
import { useEffect, useState } from "react";
import VaultCard from "./VaultCard";
import VaultSearch from "./VaultSearch";
import VaultForm, { VaultItem } from "./VaultForm";
import { decryptVaultData, EncryptedData } from "@/lib/crypto";
import { Plus } from "lucide-react";

export default function VaultList() {
  const [vaults, setVaults] = useState<VaultItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<VaultItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredVaults, setFilteredVaults] = useState<VaultItem[]>([]);

  const fetchVaults = async () => {
    setLoading(true);
    setError(null);
    try {
      const base64Key = sessionStorage.getItem("vaultKey");
      if (!base64Key) {
        setError("Vault is locked. Please unlock to view entries.");
        setLoading(false);
        return;
      }

      const rawKey = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));
      const key = await crypto.subtle.importKey(
        "raw",
        rawKey,
        "AES-GCM",
        true,
        ["decrypt"]
      );

      const res = await fetch("/api/vault/list", { credentials: "include" });
      if (!res.ok) {
        throw new Error("Failed to fetch vault data.");
      }

      const { items = [] } = await res.json();

      const decryptedItems = await Promise.all(
        items.map(
          async (item: { _id: string; ciphertext: string; iv: string }) => {
            const encryptedData: EncryptedData = {
              ciphertext: item.ciphertext,
              iv: item.iv,
            };

            const decrypted = await decryptVaultData(encryptedData, key);
            return { ...(decrypted as VaultItem), _id: item._id, id: item._id };
          }
        )
      );

      setVaults(decryptedItems);
      setFilteredVaults(decryptedItems);
    } catch (err) {
      console.error("Failed to load vault items:", err);
      setError("Failed to load vault items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openForm = (item?: VaultItem) => {
    if (item) {
      setEditing({ ...item, _id: item._id || item.id });
    } else {
      // Creating new
      setEditing(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setIsModalOpen(false);
    await fetchVaults();
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/vault/delete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete entry");

      await fetchVaults();
    } catch (err) {
      console.error("Failed to delete:", err);
      setError("Failed to delete entry. Please try again.");
    }
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredVaults(vaults);
      return;
    }
    const lower = query.toLowerCase();
    setFilteredVaults(
      vaults.filter((v) => v.site.toLowerCase().includes(lower))
    );
  };
  const closeForm = () => {
    setEditing(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchVaults();
  }, []);

  return (
    <div className="space-y-6">
      <VaultForm
        show={isModalOpen}
        onClose={closeForm}
        onSave={handleSave}
        initial={editing}
      />
      {isModalOpen && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow space-y-6">
          <VaultForm
            show={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            initial={editing}
          />
          <button
            onClick={closeForm}
            className="mt-2 text-sm text-gray-400 hover:text-gray-300"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 order-2 sm:order-1">
          <VaultSearch onSearch={handleSearch} />
        </div>

        <button
          onClick={() => openForm()}
          className="flex-shrink-0 flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition order-1 sm:order-2"
        >
          <Plus className="text-white" />
          <span>Add New Password</span>
        </button>
      </div>

      <hr className="border-gray-700" />

      {loading ? (
        <p className="text-gray-400 text-center">Loading your vault...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredVaults.length > 0 ? (
        filteredVaults.map((item) => (
          <VaultCard
            key={item._id}
            item={item}
            onEdit={() => openForm(item)}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <p className="text-gray-400 text-center">No saved entries yet.</p>
      )}
    </div>
  );
}

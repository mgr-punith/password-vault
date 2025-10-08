"use client";
import { useState, useEffect } from "react";

interface VaultSearchProps {
  onSearch: (query: string) => void;
}

export default function VaultSearch({ onSearch }: VaultSearchProps) {
  const [query, setQuery] = useState("");
//   const [visible, setVisible] = useState(false);

  //Ctrl+K 
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        // setVisible((v) => !v); // toggle visibility
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  

//   if (!visible) return null;

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search vault..."
        autoFocus
        className="px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition w-full max-w-sm"
      />
    </div>
  );
}

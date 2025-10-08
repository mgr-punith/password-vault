"use client";

import { useEffect, useState, useCallback } from "react";
const LOOK_ALIKES: string[] = [
  "i",
  "I", // lowercase i, uppercase I
  "l", // lowercase l
  "1", // number one (confused with i and l)
  "o",
  "O", // lowercase o, uppercase O
  "0", // number zero (confused with o and O)
];

interface PasswordGeneratorProps {
  onSelect: (password: string) => void;
}

export default function PasswordGenerator({
  onSelect,
}: PasswordGeneratorProps) {
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true); 
  const [excludeLookAlikes, setExcludeLookAlikes] = useState(true); 
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  
  const generatePassword = useCallback(() => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";

    let chars = "";
    if (includeLowercase) chars += lowercase;
    if (includeUppercase) chars += uppercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (!chars.length) return "";

    if (excludeLookAlikes) {
      //Filtering the look-alike characters
      chars = chars
        .split("")
        .filter((c) => !LOOK_ALIKES.includes(c))
        .join("");
    }

    
    if (!chars.length) return "";

    let out = "";
    try {
      const buffer = new Uint32Array(length);
      window.crypto.getRandomValues(buffer); 

      for (let i = 0; i < length; i++) {
        out += chars[buffer[i] % chars.length];
      }
    } catch (e) {
      console.error(
        "Crypto API unavailable, falling back or failing gracefully.",
        e
      );
      return "ERROR"; 
    }

    return out;
  }, [
    length,
    includeLowercase,
    includeUppercase,
    includeNumbers,
    includeSymbols,
    excludeLookAlikes,
  ]);


  const refresh = useCallback(() => {
    setPasswords(Array.from({ length: 5 }, () => generatePassword()));
  }, [generatePassword]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleCopy = (pw: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = pw;
    textArea.style.position = "fixed"; 
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      setCopied(pw);
      setTimeout(() => setCopied(null), 10000); 
    } catch (err) {
      console.error("Copy failed: ", err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="space-y-4 p-4 border rounded-xl shadow-inner dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-lg font-semibold dark:text-gray-100">
        Strong Password Generator
      </h3>

      {/* Length Slider */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium dark:text-gray-300">
          Password Length:{" "}
          <span className="font-bold text-indigo-500">{length}</span>
        </label>
        <input
          type="range"
          min={8}
          max={64} // Increased max length for extra security
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 range-sm"
        />
      </div>

      {/* Checkbox Options */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-6 gap-y-3 text-sm dark:text-gray-300">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />{" "}
          Lowercase
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />{" "}
          Uppercase
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />{" "}
          Numbers
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />{" "}
          Symbols
        </label>
        {/* Look-Alikes Feature */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={excludeLookAlikes}
            onChange={(e) => setExcludeLookAlikes(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />{" "}
          Exclude look-alikes
        </label>
      </div>

      {/* Generated Passwords List */}
      <div className="grid grid-cols-1 gap-2 pt-2">
        {passwords.map((pw, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-3 border rounded-lg bg-white dark:bg-gray-700 shadow-sm"
          >
            <span
              className="truncate font-mono text-sm dark:text-white"
              title={pw}
            >
              {pw}
            </span>
            <div className="flex gap-2 min-w-max">
              <button
              type="button"
                onClick={() => onSelect(pw)}
                className="px-3 py-1 text-xs rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Select
              </button>
              <button
                onClick={() => handleCopy(pw)}
                className={`px-3 py-1 text-xs rounded-lg transition ${
                  copied === pw
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
                }`}
              >
                {copied === pw ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={refresh}
        className="w-full py-2 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        disabled={
          !includeLowercase &&
          !includeUppercase &&
          !includeNumbers &&
          !includeSymbols
        }
      >
        Refresh Passwords
      </button>
    </div>
  );
}

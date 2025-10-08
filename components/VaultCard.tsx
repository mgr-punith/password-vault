import { useState } from "react";
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Pencil,
  Trash2,
  Globe,
  User,
  Key,
  StickyNote,
} from "lucide-react";

interface VaultItem {
  _id?: string;
  site: string;
  username: string;
  password: string;
  notes?: string;
}

interface VaultCardProps {
  item: VaultItem;
  onEdit: (item: VaultItem) => void;
  onDelete: (_id: string) => void;
}

export default function VaultCard({ item, onEdit, onDelete }: VaultCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  const getCopyIcon = (field: string) =>
    copiedField === field ? (
      <Check className="h-4 w-4 text-green-500" />
    ) : (
      <Copy className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
    );

  return (
    <div className="bg-gray-700 dark:bg-gray-800 rounded-xl  shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-lg ">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg">
            <Globe className="h-5 w-5 text-gray-900" />
          </div>
          <h3 className="font-bold text-xl max-w-lg text-white">{item.site}</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 rounded-lg cursor-pointer bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all"
            title="Edit"
          >
            <Pencil className="h-4 w-4 text-gray-900" />
          </button>
          <button
            onClick={() => item._id && onDelete(item._id)}
            className="p-2 rounded-lg cursor-pointer bg-red-500 bg-opacity-20 text-white hover:bg-red-700 transition-all"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-start space-x-3">
          <div className="mt-1">
            <User className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="flex-1 min-w-0">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Username
            </label>
            <div className="flex items-center justify-between mt-1 group">
              <p className="text-sm text-gray-900 dark:text-white font-medium truncate">
                {item.username}
              </p>
              <button
                onClick={() => handleCopy(item.username, "username")}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                title="Copy username"
              >
                {getCopyIcon("username")}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="mt-1">
            <Key className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="flex-1 min-w-0">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Password
            </label>
            <div className="flex items-center justify-between mt-1 group">
              <div className="flex items-center space-x-2 flex-1">
                {revealed ? (
                  <p className="text-sm text-gray-900 dark:text-white font-mono break-all">
                    {item.password}
                  </p>
                ) : (
                  <p className="text-sm text-gray-900 dark:text-white">
                    ••••••••••••
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setRevealed(!revealed)}
                  className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title={revealed ? "Hide password" : "Show password"}
                >
                  {revealed ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
                <button
                  onClick={() => handleCopy(item.password, "password")}
                  className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Copy password"
                >
                  {getCopyIcon("password")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {item.notes && (
          <div className="flex items-start space-x-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="mt-1">
              <StickyNote className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="flex-1 min-w-0">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Notes
              </label>
              <div className="flex items-start justify-between mt-1 group">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words flex-1 pr-2">
                  {item.notes}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

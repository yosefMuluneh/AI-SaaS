"use client";

import { useState } from "react";
import { Workspace } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Layers, Plus, LogOut, Check, ChevronDown } from "lucide-react";

interface WorkspaceHeaderProps {
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  onSelectWorkspace: (ws: Workspace) => void;
  onCreateWorkspace: (name: string) => Promise<void>;
}

export default function WorkspaceHeader({
  workspaces,
  selectedWorkspace,
  onSelectWorkspace,
  onCreateWorkspace,
}: WorkspaceHeaderProps) {
  const { user, logout } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    setLoading(true);
    try {
      await onCreateWorkspace(newWsName);
      setNewWsName("");
      setIsCreating(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs relative z-20">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-200">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
              AI Competitive SaaS
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {user?.email || "Workspace Manager"}
            </p>
          </div>
        </div>

        {/* Workspace Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3.5 py-2 rounded-xl text-sm transition-all border border-slate-200"
          >
            <span className="truncate max-w-[180px]">
              {selectedWorkspace ? selectedWorkspace.name : "Select Workspace"}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-30">
              <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Workspaces
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    onSelectWorkspace(ws);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 flex items-center justify-between text-slate-800"
                >
                  <span className="truncate">{ws.name}</span>
                  {selectedWorkspace?.id === ws.id && (
                    <Check className="w-4 h-4 text-indigo-600" />
                  )}
                </button>
              ))}
              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setIsCreating(true);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create New Workspace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <Button
        variant="outline"
        onClick={logout}
        className="text-slate-700 hover:text-rose-600 hover:border-rose-300 font-bold"
      >
        <LogOut className="w-4 h-4 mr-2" /> Logout
      </Button>

      {/* Create Workspace Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Create New Workspace</h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">
              Add a new tenant workspace to organize your keyword rankings and AI campaign intelligence.
            </p>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Workspace Name"
                placeholder="e.g. Enterprise SEO, Q4 Growth"
                value={newWsName}
                onChange={(e) => setNewWsName(e.target.value)}
                required
                autoFocus
              />
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={loading}>
                  Create Workspace
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

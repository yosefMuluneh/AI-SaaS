"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { createWorkspace } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { Building2, Sparkles, ArrowRight, Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Handle side-effect navigation safely inside useEffect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim()) return;
    setError(null);
    setLoading(true);
    try {
      await createWorkspace({ name: workspaceName });
      router.push("/");
    } catch {
      setError("Failed to create workspace. Please try another name.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-200">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Step 1 of 1
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">Name Your Workspace</h1>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Your workspace is your dedicated tenant environment where your tracked keywords, competitor analysis, and AI-generated campaign briefs live.
        </p>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-3 rounded-xl font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Workspace Name"
            type="text"
            placeholder="e.g. Acme Corp Growth, SaaS Marketing"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            required
            autoFocus
          />
          <Button type="submit" isLoading={loading} className="w-full py-3 text-base">
            Continue to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
}

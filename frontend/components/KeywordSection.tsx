"use client";

import { useState } from "react";
import { Keyword } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Search, Sparkles, TrendingUp, Globe } from "lucide-react";

interface KeywordSectionProps {
  keywords: Keyword[];
  onAddKeyword: (keyword: string, targetUrl: string, searchVolume: number) => Promise<void>;
  onTriggerAnalysis: (keywordId: number) => Promise<void>;
  onSelectKeyword: (kw: Keyword) => void;
  selectedKeywordId?: number;
}

export default function KeywordSection({
  keywords,
  onAddKeyword,
  onTriggerAnalysis,
  onSelectKeyword,
  selectedKeywordId,
}: KeywordSectionProps) {
  const [newKeyword, setNewKeyword] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [searchVolume, setSearchVolume] = useState("1000");
  const [loading, setLoading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    setLoading(true);
    try {
      await onAddKeyword(newKeyword, targetUrl, parseInt(searchVolume) || 0);
      setNewKeyword("");
      setTargetUrl("");
      setSearchVolume("1000");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeClick = async (kwId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setAnalyzingId(kwId);
    try {
      await onTriggerAnalysis(kwId);
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Search className="w-5 h-5" />
          </div>
          <h2 className="text-base font-extrabold text-slate-900">Tracked Keywords</h2>
        </div>
        <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
          {keywords.length} Tracked
        </span>
      </div>

      {/* Add Keyword Form with Crystal Clear Contrast Inputs */}
      <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 mb-6">
        <Input
          label="Keyword"
          placeholder="e.g. AI Security Software"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Target URL (Optional)"
            placeholder="https://company.com"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
          />
          <Input
            label="Monthly Search Volume"
            type="number"
            placeholder="1000"
            value={searchVolume}
            onChange={(e) => setSearchVolume(e.target.value)}
          />
        </div>
        <Button type="submit" isLoading={loading} className="w-full mt-1">
          <Plus className="w-4 h-4 mr-1.5" /> Add & Track Keyword
        </Button>
      </form>

      {/* Keywords List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[500px]">
        {keywords.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Search className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold text-slate-600">No keywords tracked yet.</p>
            <p className="text-xs text-slate-400 mt-0.5">Add your first target keyword above to begin.</p>
          </div>
        ) : (
          keywords.map((kw) => {
            const isSelected = selectedKeywordId === kw.id;
            const isAnalyzing = analyzingId === kw.id;

            return (
              <div
                key={kw.id}
                onClick={() => onSelectKeyword(kw)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">{kw.keyword}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {kw.status}
                    </span>
                  </div>
                  {kw.target_url && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[200px]">{kw.target_url}</span>
                    </div>
                  )}
                  {kw.search_volume !== null && kw.search_volume !== undefined && (
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{kw.search_volume.toLocaleString()} searches/mo</span>
                    </div>
                  )}
                </div>

                <Button
                  variant={isSelected ? "primary" : "outline"}
                  isLoading={isAnalyzing}
                  onClick={(e) => handleAnalyzeClick(kw.id, e)}
                  className="text-xs px-3 py-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-300" /> Analyze
                </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

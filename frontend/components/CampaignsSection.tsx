"use client";

import { Campaign, Keyword } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import { Sparkles, FileText, Calendar, AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  selectedKeyword: Keyword | null;
  campaigns: Campaign[];
  loading: boolean;
  onRefresh: () => void;
}

export default function CampaignsSection({
  selectedKeyword,
  campaigns,
  loading,
  onRefresh,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">Generated AI Campaigns</h2>
        </div>
        <button
          onClick={onRefresh}
          disabled={!selectedKeyword || loading}
          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-30 cursor-pointer"
          title="Refresh Campaigns"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {!selectedKeyword ? (
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
          <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-3">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700 mb-1">No Keyword Selected</h3>
          <p className="text-xs text-slate-400 max-w-xs">
            Select a tracked keyword on the left to view its AI-generated competitor content campaigns.
          </p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="p-4 bg-amber-50 rounded-full text-amber-500 mb-3">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700 mb-1">No Campaigns Generated Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            Click the <strong className="text-indigo-600">Analyze</strong> button on &quot;{selectedKeyword.keyword}&quot; to run the Celery background worker and generate your first AI strategy brief.
          </p>
        </div>
      ) : (
        <div className="space-y-6 overflow-y-auto max-h-[500px] pr-2">
          {campaigns.map((camp) => (
            <div key={camp.id} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <h3 className="text-base font-bold text-slate-900">{camp.title}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                    {camp.status}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(camp.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-slate-700 bg-white p-4 rounded-lg border border-slate-200 shadow-inner">
                <ReactMarkdown>{camp.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

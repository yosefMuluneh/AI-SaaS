"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  getWorkspaces,
  createWorkspace,
  getKeywordsByWorkspace,
  createKeyword,
  triggerKeywordAnalysis,
  getCampaignsByKeyword,
} from "@/lib/api";
import { Workspace, Keyword, Campaign } from "@/lib/types";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import KeywordSection from "@/components/KeywordSection";
import CampaignsSection from "@/components/CampaignsSection";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Load Workspaces on mount when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;
    getWorkspaces()
      .then((data) => {
        if (isMounted) {
          if (data.length === 0) {
            router.push("/onboarding");
            return;
          }
          setWorkspaces(data);
          setSelectedWorkspace(data[0]);
        }
      })
      .catch((err) => console.error("Failed to fetch workspaces:", err))
      .finally(() => {
        if (isMounted) setLoadingInitial(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, router]);

  // Load Keywords when workspace changes
  useEffect(() => {
    if (!selectedWorkspace) return;

    let isMounted = true;
    getKeywordsByWorkspace(selectedWorkspace.id)
      .then((data) => {
        if (isMounted) {
          setKeywords(data);
          setSelectedKeyword(null);
          setCampaigns([]);
        }
      })
      .catch((err) => console.error("Failed to fetch keywords:", err));

    return () => {
      isMounted = false;
    };
  }, [selectedWorkspace]);

  // Load Campaigns when keyword changes
  const refreshCampaigns = useCallback(async (keywordId: number) => {
    setLoadingCampaigns(true);
    try {
      const data = await getCampaignsByKeyword(keywordId);
      setCampaigns(data);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    } finally {
      setLoadingCampaigns(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedKeyword) return;

    let isMounted = true;
    getCampaignsByKeyword(selectedKeyword.id)
      .then((data) => {
        if (isMounted) {
          setCampaigns(data);
        }
      })
      .catch((err) => console.error("Failed to fetch campaigns:", err));

    return () => {
      isMounted = false;
    };
  }, [selectedKeyword]);

  const handleCreateWorkspace = async (name: string) => {
    const newWs = await createWorkspace({ name });
    setWorkspaces((prev) => [...prev, newWs]);
    setSelectedWorkspace(newWs);
  };

  const handleAddKeyword = async (keyword: string, targetUrl: string, searchVolume: number) => {
    if (!selectedWorkspace) return;
    const newKw = await createKeyword({
      workspace_id: selectedWorkspace.id,
      keyword,
      target_url: targetUrl || undefined,
      search_volume: searchVolume,
    });
    setKeywords((prev) => [...prev, newKw]);
  };

  const handleTriggerAnalysis = async (keywordId: number) => {
    await triggerKeywordAnalysis(keywordId);
    setTimeout(() => {
      if (selectedKeyword?.id === keywordId) {
        refreshCampaigns(keywordId);
      }
    }, 4000);
  };

  if (authLoading || loadingInitial) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">Loading Secure AI Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <WorkspaceHeader
        workspaces={workspaces}
        selectedWorkspace={selectedWorkspace}
        onSelectWorkspace={setSelectedWorkspace}
        onCreateWorkspace={handleCreateWorkspace}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <KeywordSection
            keywords={keywords}
            onAddKeyword={handleAddKeyword}
            onTriggerAnalysis={handleTriggerAnalysis}
            onSelectKeyword={setSelectedKeyword}
            selectedKeywordId={selectedKeyword?.id}
          />
        </div>

        <div className="lg:col-span-7">
          <CampaignsSection
            selectedKeyword={selectedKeyword}
            campaigns={campaigns}
            loading={loadingCampaigns}
            onRefresh={() => selectedKeyword && refreshCampaigns(selectedKeyword.id)}
          />
        </div>
      </main>
    </div>
  );
}

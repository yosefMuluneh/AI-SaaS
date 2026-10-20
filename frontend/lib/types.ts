export interface User {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface Workspace {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface WorkspaceCreate {
  name: string;
}

export interface Keyword {
  id: number;
  workspace_id: number;
  keyword: string;
  target_url?: string | null;
  search_volume?: number | null;
  status: string;
  created_at: string;
}

export interface KeywordCreate {
  workspace_id: number;
  keyword: string;
  target_url?: string;
  search_volume?: number;
}

export interface Campaign {
  id: number;
  keyword_id: number;
  title: string;
  content: string;
  status: string;
  created_at: string;
}

export interface TaskAnalyzeResponse {
  message: string;
  task_id: string;
  status: string;
}

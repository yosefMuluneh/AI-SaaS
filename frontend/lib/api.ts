import axios from "axios";
import {
  Workspace,
  WorkspaceCreate,
  Keyword,
  KeywordCreate,
  Campaign,
  TaskAnalyzeResponse,
  User,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Crucial for HttpOnly cookies
});

// Auth Endpoints
export const loginUser = async (data: { email: string; password: string }) => {
  const response = await api.post<User>("/auth/login", data);
  return response.data;
};

export const registerUser = async (data: { email: string; password: string }) => {
  const response = await api.post<User>("/auth/register", data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>("/auth/me");
  return response.data;
};

// Workspaces & Keywords Endpoints
export const getWorkspaces = async (): Promise<Workspace[]> => {
  const response = await api.get<Workspace[]>("/workspaces/");
  return response.data;
};

export const createWorkspace = async (data: WorkspaceCreate): Promise<Workspace> => {
  const response = await api.post<Workspace>("/workspaces/", data);
  return response.data;
};

export const getKeywordsByWorkspace = async (workspaceId: number): Promise<Keyword[]> => {
  const response = await api.get<Keyword[]>(`/keywords/workspace/${workspaceId}`);
  return response.data;
};

export const createKeyword = async (data: KeywordCreate): Promise<Keyword> => {
  const response = await api.post<Keyword>("/keywords/", data);
  return response.data;
};

export const triggerKeywordAnalysis = async (keywordId: number): Promise<TaskAnalyzeResponse> => {
  const response = await api.post<TaskAnalyzeResponse>(`/keywords/${keywordId}/analyze`);
  return response.data;
};

export const getCampaignsByKeyword = async (keywordId: number): Promise<Campaign[]> => {
  const response = await api.get<Campaign[]>(`/campaigns/keyword/${keywordId}`);
  return response.data;
};

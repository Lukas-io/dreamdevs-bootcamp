import type {
  Award,
  Voter,
  Vote,
  AwardResults,
  WinnerResult,
  CreateAwardBody,
  RegisterVoterBody,
  CastVoteBody,
} from "./types";
import { getToken } from "./auth";

const BASE = "/api";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers as Record<string, string>),
    },
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
  return data as T;
}

export const authApi = {
  signup: (body: {
    name: string;
    studentId: string;
    password: string;
    imageUrl?: string;
  }): Promise<{ token: string; voter: Voter }> =>
    apiFetch("/auth/signup", { method: "POST", body: JSON.stringify(body) }),

  login: (studentId: string, password: string): Promise<{ token: string; voter: Voter }> =>
    apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ studentId, password }) }),

  adminLogin: (username: string, password: string): Promise<{ token: string }> =>
    apiFetch("/auth/admin/login", { method: "POST", body: JSON.stringify({ username, password }) }),
};

export const awardsApi = {
  list: (): Promise<Award[]> => apiFetch("/awards"),
  get: (id: string): Promise<Award> => apiFetch(`/awards/${id}`),
  create: (body: CreateAwardBody): Promise<Award> =>
    apiFetch("/awards", { method: "POST", body: JSON.stringify(body) }),
  delete: (id: string): Promise<void> =>
    apiFetch(`/awards/${id}`, { method: "DELETE" }),
  open: (id: string): Promise<void> =>
    apiFetch(`/awards/${id}/open`, { method: "PATCH" }),
  close: (id: string): Promise<void> =>
    apiFetch(`/awards/${id}/close`, { method: "PATCH" }),
  reveal: (id: string): Promise<void> =>
    apiFetch(`/awards/${id}/reveal`, { method: "PATCH" }),
};

export const votersApi = {
  list: (): Promise<Voter[]> => apiFetch("/voters"),
  get: (id: string): Promise<Voter> => apiFetch(`/voters/${id}`),
  register: (body: RegisterVoterBody): Promise<Voter> =>
    apiFetch("/voters", { method: "POST", body: JSON.stringify(body) }),
  deactivate: (id: string): Promise<void> =>
    apiFetch(`/voters/${id}/deactivate`, { method: "PATCH" }),
};

export const votesApi = {
  cast: (body: CastVoteBody): Promise<Vote> =>
    apiFetch("/votes", { method: "POST", body: JSON.stringify(body) }),
};

export const resultsApi = {
  forAward: (awardId: string): Promise<AwardResults> =>
    apiFetch(`/results/${awardId}`),
  winner: (awardId: string): Promise<WinnerResult> =>
    apiFetch(`/results/${awardId}/winner`),
  stats: (awardId: string): Promise<Record<string, number>> =>
    apiFetch(`/results/${awardId}/stats`),
  mvp: (): Promise<{ mvp: string }> => apiFetch("/results/mvp"),
  sweep: (): Promise<Record<string, string[]>> => apiFetch("/results/sweep"),
  mostNominated: (): Promise<{ mostNominated: string }> =>
    apiFetch("/results/most-nominated"),
  underdogs: (): Promise<Record<string, string[]>> =>
    apiFetch("/results/underdogs"),
  summary: (): Promise<{ summary: string }> => apiFetch("/results/summary"),
};

export const imageGenApi = {
  generate: (prompt: string, theme: string): Promise<{ imageUrl: string }> =>
    apiFetch("/image-gen", { method: "POST", body: JSON.stringify({ prompt, theme }) }),
};

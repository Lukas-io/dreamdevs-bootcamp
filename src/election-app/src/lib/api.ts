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

const BASE = "/api";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
  return data as T;
}

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

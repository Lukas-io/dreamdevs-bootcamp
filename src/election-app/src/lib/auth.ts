const TOKEN_KEY = "election_token";
const ROLE_KEY = "election_role";
const VOTER_KEY = "election_voter";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRole(): "VOTER" | "ADMIN" | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ROLE_KEY) as "VOTER" | "ADMIN" | null;
}

export function getStoredVoter(): import("./types").Voter | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(VOTER_KEY);
  return v ? JSON.parse(v) : null;
}

export function setAuth(token: string, role: "VOTER" | "ADMIN", voter?: import("./types").Voter): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
  if (voter) localStorage.setItem(VOTER_KEY, JSON.stringify(voter));
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(VOTER_KEY);
}

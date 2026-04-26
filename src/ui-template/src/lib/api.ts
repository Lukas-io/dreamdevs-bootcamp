// Generic API client — replace BASE_URL and add your own domain calls below.
// To proxy to your backend, add rewrites in next.config.ts:
//   { source: "/api/:path*", destination: "http://localhost:8080/:path*" }

const BASE_URL = "/api";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
  return data as T;
}

// Wire this to your image generation service.
// In next.config.ts add: { source: "/api/image-gen/:path*", destination: "http://localhost:3001/:path*" }
export const imageGenApi = {
  generate: (prompt: string, theme: string) =>
    apiFetch<{ imageUrl: string }>("/image-gen", {
      method: "POST",
      body: JSON.stringify({ prompt, theme }),
    }),
};

// Replace with your own domain API calls, e.g.:
// export const itemsApi = {
//   list: () => apiFetch<Item[]>("/items"),
//   create: (body: Omit<Item, "id" | "createdAt" | "updatedAt">) =>
//     apiFetch<Item>("/items", { method: "POST", body: JSON.stringify(body) }),
//   update: (id: string, body: Partial<Item>) =>
//     apiFetch<Item>(`/items/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
//   delete: (id: string) =>
//     apiFetch<void>(`/items/${id}`, { method: "DELETE" }),
// };

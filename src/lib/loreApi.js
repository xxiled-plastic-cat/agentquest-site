const WORLD_BASE_URL = import.meta.env.VITE_WORLD_API_BASE_URL ?? "http://localhost:8787";

async function fetchJson(path) {
  const res = await fetch(`${WORLD_BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}

export function getWorldBaseUrl() {
  return WORLD_BASE_URL;
}

export async function fetchLoreIndex() {
  const payload = await fetchJson("/lore");
  return Array.isArray(payload?.documents) ? payload.documents : [];
}

export async function fetchLoreDocument(slug) {
  return fetchJson(`/lore/${encodeURIComponent(slug)}`);
}

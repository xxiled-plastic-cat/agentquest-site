const LORE_BASE_URL = "/lore";

async function fetchJson(path) {
  const res = await fetch(`${LORE_BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}

export async function fetchLoreIndex() {
  const payload = await fetchJson("/index.json");
  return Array.isArray(payload?.documents) ? payload.documents : [];
}

export async function fetchLoreDocument(slug) {
  return fetchJson(`/documents/${encodeURIComponent(slug)}.json`);
}

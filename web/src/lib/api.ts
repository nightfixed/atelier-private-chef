const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

async function apiFetch(path: string, options?: RequestInit, token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getDishes: (category?: string) =>
    apiFetch(`/api/dishes${category ? `?category=${encodeURIComponent(category)}` : ""}`),
  getFeaturedDishes: () => apiFetch("/api/dishes/featured"),
  getDish: (id: string) => apiFetch(`/api/dishes/${id}`),
  createDish: (body: object, token: string) =>
    apiFetch("/api/dishes", { method: "POST", body: JSON.stringify(body) }, token),
  updateDish: (id: string, body: object, token: string) =>
    apiFetch(`/api/dishes/${id}`, { method: "PUT", body: JSON.stringify(body) }, token),
  deleteDish: (id: string, token: string) =>
    apiFetch(`/api/dishes/${id}`, { method: "DELETE" }, token),

  getRecipes: () => apiFetch("/api/recipes"),
  getRecipe: (id: string) => apiFetch(`/api/recipes/${id}`),
  createRecipe: (body: object, token: string) =>
    apiFetch("/api/recipes", { method: "POST", body: JSON.stringify(body) }, token),
  updateRecipe: (id: string, body: object, token: string) =>
    apiFetch(`/api/recipes/${id}`, { method: "PUT", body: JSON.stringify(body) }, token),
  deleteRecipe: (id: string, token: string) =>
    apiFetch(`/api/recipes/${id}`, { method: "DELETE" }, token),

  getGallery: (category?: string) =>
    apiFetch(`/api/gallery${category ? `?category=${encodeURIComponent(category)}` : ""}`),
  createGalleryItem: (body: object, token: string) =>
    apiFetch("/api/gallery", { method: "POST", body: JSON.stringify(body) }, token),
  updateGalleryItem: (id: string, body: object, token: string) =>
    apiFetch(`/api/gallery/${id}`, { method: "PUT", body: JSON.stringify(body) }, token),
  deleteGalleryItem: (id: string, token: string) =>
    apiFetch(`/api/gallery/${id}`, { method: "DELETE" }, token),

  submitContact: (body: object) =>
    apiFetch("/api/contact", { method: "POST", body: JSON.stringify(body) }),
  getContacts: (token: string, status?: string) =>
    apiFetch(`/api/contact${status ? `?status=${encodeURIComponent(status)}` : ""}`, {}, token),
  updateContactStatus: (id: string, status: string, token: string) =>
    apiFetch(`/api/contact/${id}`, { method: "PUT", body: JSON.stringify({ status }) }, token),

  getUploadUrl: (filename: string, contentType: string, token: string) =>
    apiFetch(`/api/upload?filename=${encodeURIComponent(filename)}&content_type=${encodeURIComponent(contentType)}`, {}, token),
};

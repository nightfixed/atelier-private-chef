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

  getHerbarium: () => apiFetch("/api/herbarium"),  getSpecimen: (id: string) => apiFetch(`/api/herbarium/${id}`),
  createSpecimen: (body: object, token: string) =>
    apiFetch("/api/herbarium", { method: "POST", body: JSON.stringify(body) }, token),
  updateSpecimen: (id: string, body: object, token: string) =>
    apiFetch(`/api/herbarium/${id}`, { method: "PUT", body: JSON.stringify(body) }, token),
  deleteSpecimen: (id: string, token: string) =>
    apiFetch(`/api/herbarium/${id}`, { method: "DELETE" }, token),

  generateMenu: (body: { occasion: string; guest_count: string; season: string; dietary: string[]; host_name: string }) =>
    apiFetch("/api/generate-menu", { method: "POST", body: JSON.stringify(body) }),

  generateCodex: (body: {
    guest_name: string;
    occasion: string;
    guest_count: number;
    season: string;
    protein: string;
    taste_profile: string;
    love?: string;
    avoid?: string;
    wish?: string;
    date?: string;
  }) =>
    apiFetch("/api/generate-codex", { method: "POST", body: JSON.stringify(body) }),

  chat: (messages: { role: "user" | "assistant"; content: string }[]) =>
    apiFetch("/api/chat", { method: "POST", body: JSON.stringify({ messages }) }),

  // Availability windows
  getAvailability: (token?: string) =>
    token
      ? apiFetch('/api/availability?all=true', {}, token)
      : apiFetch('/api/availability'),
  createAvailabilityWindow: (body: {
    date: string;
    start_time?: string;
    end_time?: string;
    max_guests?: number;
    notes?: string;
  }, token: string) =>
    apiFetch("/api/availability", { method: "POST", body: JSON.stringify(body) }, token),
  updateAvailabilityWindow: (id: string, body: {
    start_time?: string;
    end_time?: string;
    max_guests?: number;
    notes?: string;
    is_active?: boolean;
  }, token: string) =>
    apiFetch(`/api/availability/${id}`, { method: "PUT", body: JSON.stringify(body) }, token),
  deleteAvailabilityWindow: (id: string, token: string) =>
    apiFetch(`/api/availability/${id}`, { method: "DELETE" }, token),

  // Reservations
  submitReservation: (body: {
    window_id?: string;
    name: string;
    email: string;
    phone?: string;
    guests_count?: number;
    occasion?: string;
    message?: string;
  }) =>
    apiFetch("/api/reservations", { method: "POST", body: JSON.stringify(body) }),
  getReservations: (token: string, status?: string) =>
    apiFetch(`/api/reservations${status ? `?status=${encodeURIComponent(status)}` : ""}`, {}, token),
  updateReservationStatus: (id: string, status: string, token: string) =>
    apiFetch(`/api/reservations/${id}`, { method: "PUT", body: JSON.stringify({ status }) }, token),
};

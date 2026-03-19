package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/nightfixed/atelier-private-chef/api/internal/repository"
)

type contactRepo interface {
	CreateContactRequest(ctx context.Context, name, email string, message *string, eventDate *time.Time, guestsCount *int, occasion *string) (*repository.ContactRequest, error)
	ListContactRequests(ctx context.Context, status string) ([]repository.ContactRequest, error)
	UpdateContactRequestStatus(ctx context.Context, id, status string) (*repository.ContactRequest, error)
}

// NewContactHandler handles POST /api/contact (public) and GET /api/contact (admin).
func NewContactHandler(repo contactRepo, authMiddleware func(http.Handler) http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			// Public: anyone can submit a contact request.
			var body struct {
				Name        string  `json:"name"`
				Email       string  `json:"email"`
				Message     *string `json:"message"`
				EventDate   *string `json:"event_date"`
				GuestsCount *int    `json:"guests_count"`
				Occasion    *string `json:"occasion"`
			}
			if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
				writeError(w, http.StatusBadRequest, "invalid request body")
				return
			}
			if strings.TrimSpace(body.Name) == "" || strings.TrimSpace(body.Email) == "" {
				writeError(w, http.StatusBadRequest, "name and email are required")
				return
			}
			var eventDate *time.Time
			if body.EventDate != nil && *body.EventDate != "" {
				t, err := time.Parse("2006-01-02", *body.EventDate)
				if err != nil {
					writeError(w, http.StatusBadRequest, "event_date must be in YYYY-MM-DD format")
					return
				}
				eventDate = &t
			}
			cr, err := repo.CreateContactRequest(r.Context(), body.Name, body.Email, body.Message, eventDate, body.GuestsCount, body.Occasion)
			if err != nil {
				writeError(w, http.StatusInternalServerError, err.Error())
				return
			}
			writeJSON(w, http.StatusCreated, cr)

		case http.MethodGet:
			// Admin only: list all contact requests.
			authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				status := r.URL.Query().Get("status")
				items, err := repo.ListContactRequests(r.Context(), status)
				if err != nil {
					writeError(w, http.StatusInternalServerError, err.Error())
					return
				}
				if items == nil {
					items = []repository.ContactRequest{}
				}
				writeJSON(w, http.StatusOK, items)
			})).ServeHTTP(w, r)

		default:
			w.Header().Set("Allow", "GET, POST")
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		}
	})
}

// NewContactByIDHandler handles PUT /api/contact/{id} (admin: update status).
func NewContactByIDHandler(repo contactRepo, authMiddleware func(http.Handler) http.Handler) http.Handler {
	return authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		if id == "" {
			writeError(w, http.StatusBadRequest, "missing id")
			return
		}
		if r.Method != http.MethodPut {
			w.Header().Set("Allow", "PUT")
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
			return
		}
		var body struct {
			Status string `json:"status"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			writeError(w, http.StatusBadRequest, "invalid request body")
			return
		}
		cr, err := repo.UpdateContactRequestStatus(r.Context(), id, body.Status)
		if err != nil {
			writeError(w, http.StatusInternalServerError, err.Error())
			return
		}
		if cr == nil {
			writeError(w, http.StatusNotFound, "contact request not found")
			return
		}
		writeJSON(w, http.StatusOK, cr)
	}))
}

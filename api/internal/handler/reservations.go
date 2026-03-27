package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/nightfixed/atelier-private-chef/api/internal/repository"
)

type availabilityRepo interface {
	ListAvailableWindows(ctx context.Context, futureOnly bool) ([]repository.AvailabilityWindow, error)
	CreateWindow(ctx context.Context, date, startTime, endTime *string, maxGuests int, notes *string) (*repository.AvailabilityWindow, error)
	UpdateWindow(ctx context.Context, id string, startTime, endTime *string, maxGuests int, notes *string, isActive bool) (*repository.AvailabilityWindow, error)
	DeleteWindow(ctx context.Context, id string) error
}

type reservationRepo interface {
	CreateReservation(ctx context.Context, windowID *string, name, email string, phone *string, guestsCount *int, occasion, message *string) (*repository.Reservation, error)
	ListReservations(ctx context.Context, status string) ([]repository.Reservation, error)
	UpdateReservationStatus(ctx context.Context, id, status string) (*repository.Reservation, error)
}

// NewAvailabilityHandler handles GET+POST /api/availability
func NewAvailabilityHandler(avail availabilityRepo, auth func(http.Handler) http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			// ?all=true with a Bearer token returns all windows (admin)
			showAll := r.URL.Query().Get("all") == "true"
			windows, err := avail.ListAvailableWindows(r.Context(), !showAll)
			if err != nil {
				writeError(w, http.StatusInternalServerError, "could not fetch availability")
				return
			}
			if showAll {
				if windows == nil {
					windows = []repository.AvailabilityWindow{}
				}
				writeJSON(w, http.StatusOK, windows)
				return
			}
			// Public: filter out already-booked windows
			var available []repository.AvailabilityWindow
			for _, w := range windows {
				if !w.IsBooked {
					available = append(available, w)
				}
			}
			if available == nil {
				available = []repository.AvailabilityWindow{}
			}
			writeJSON(w, http.StatusOK, available)

		case http.MethodPost:
			// Admin: create availability window
			auth(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				var body struct {
					Date      string  `json:"date"`
					StartTime *string `json:"start_time"`
					EndTime   *string `json:"end_time"`
					MaxGuests int     `json:"max_guests"`
					Notes     *string `json:"notes"`
				}
				if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Date == "" {
					writeError(w, http.StatusBadRequest, "date is required")
					return
				}
				if body.MaxGuests == 0 {
					body.MaxGuests = 20
				}
				win, err := avail.CreateWindow(r.Context(), &body.Date, body.StartTime, body.EndTime, body.MaxGuests, body.Notes)
				if err != nil {
					writeError(w, http.StatusInternalServerError, "could not create window")
					return
				}
				writeJSON(w, http.StatusCreated, win)
			})).ServeHTTP(w, r)

		default:
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		}
	})
}

// NewAvailabilityByIDHandler handles PUT+DELETE /api/availability/{id}
func NewAvailabilityByIDHandler(avail availabilityRepo, auth func(http.Handler) http.Handler) http.Handler {
	return auth(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := strings.TrimPrefix(r.URL.Path, "/api/availability/")
		if id == "" {
			writeError(w, http.StatusBadRequest, "id required")
			return
		}
		switch r.Method {
		case http.MethodPut:
			var body struct {
				StartTime *string `json:"start_time"`
				EndTime   *string `json:"end_time"`
				MaxGuests int     `json:"max_guests"`
				Notes     *string `json:"notes"`
				IsActive  bool    `json:"is_active"`
			}
			body.IsActive = true // default
			if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
				writeError(w, http.StatusBadRequest, "invalid JSON")
				return
			}
			if body.MaxGuests == 0 {
				body.MaxGuests = 20
			}
			win, err := avail.UpdateWindow(r.Context(), id, body.StartTime, body.EndTime, body.MaxGuests, body.Notes, body.IsActive)
			if err != nil {
				writeError(w, http.StatusInternalServerError, "could not update window")
				return
			}
			writeJSON(w, http.StatusOK, win)

		case http.MethodDelete:
			if err := avail.DeleteWindow(r.Context(), id); err != nil {
				writeError(w, http.StatusInternalServerError, "could not delete window")
				return
			}
			writeJSON(w, http.StatusNoContent, nil)

		default:
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		}
	}))
}

// NewReservationsHandler handles GET+POST /api/reservations
func NewReservationsHandler(res reservationRepo, auth func(http.Handler) http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			// Public: guest submits a reservation request
			var body struct {
				WindowID    *string `json:"window_id"`
				Name        string  `json:"name"`
				Email       string  `json:"email"`
				Phone       *string `json:"phone"`
				GuestsCount *int    `json:"guests_count"`
				Occasion    *string `json:"occasion"`
				Message     *string `json:"message"`
			}
			if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
				writeError(w, http.StatusBadRequest, "invalid JSON")
				return
			}
			if body.Name == "" || body.Email == "" {
				writeError(w, http.StatusBadRequest, "name and email are required")
				return
			}
			reservation, err := res.CreateReservation(r.Context(), body.WindowID, body.Name, body.Email,
				body.Phone, body.GuestsCount, body.Occasion, body.Message)
			if err != nil {
				writeError(w, http.StatusInternalServerError, "could not create reservation")
				return
			}
			writeJSON(w, http.StatusCreated, reservation)

		case http.MethodGet:
			// Admin: list reservations
			auth(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				status := r.URL.Query().Get("status")
				reservations, err := res.ListReservations(r.Context(), status)
				if err != nil {
					writeError(w, http.StatusInternalServerError, "could not fetch reservations")
					return
				}
				if reservations == nil {
					reservations = []repository.Reservation{}
				}
				writeJSON(w, http.StatusOK, reservations)
			})).ServeHTTP(w, r)

		default:
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		}
	})
}

// NewReservationByIDHandler handles PUT /api/reservations/{id}
func NewReservationByIDHandler(res reservationRepo, auth func(http.Handler) http.Handler) http.Handler {
	return auth(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPut {
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
			return
		}
		id := strings.TrimPrefix(r.URL.Path, "/api/reservations/")
		if id == "" {
			writeError(w, http.StatusBadRequest, "id required")
			return
		}
		var body struct {
			Status string `json:"status"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			writeError(w, http.StatusBadRequest, "invalid JSON")
			return
		}
		valid := map[string]bool{"pending": true, "confirmed": true, "declined": true, "cancelled": true}
		if !valid[body.Status] {
			writeError(w, http.StatusBadRequest, "status must be pending, confirmed, declined, or cancelled")
			return
		}
		reservation, err := res.UpdateReservationStatus(r.Context(), id, body.Status)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "could not update reservation")
			return
		}
		writeJSON(w, http.StatusOK, reservation)
	}))
}

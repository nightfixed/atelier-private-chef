package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/nightfixed/atelier-private-chef/api/internal/repository"
	"github.com/nightfixed/atelier-private-chef/api/internal/storage"
)

type dishRepo interface {
	ListDishes(ctx context.Context, category string) ([]repository.Dish, error)
	ListFeaturedDishes(ctx context.Context) ([]repository.Dish, error)
	GetDishByID(ctx context.Context, id string) (*repository.Dish, error)
	CreateDish(ctx context.Context, title string, description, category, imageURL *string, featured bool) (*repository.Dish, error)
	UpdateDish(ctx context.Context, id, title string, description, category, imageURL *string, featured bool) (*repository.Dish, error)
	DeleteDish(ctx context.Context, id string) (bool, error)
}

// NewDishesHandler handles GET /api/dishes and POST /api/dishes.
func NewDishesHandler(repo dishRepo, authMiddleware func(http.Handler) http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			category := r.URL.Query().Get("category")
			dishes, err := repo.ListDishes(r.Context(), category)
			if err != nil {
				writeError(w, http.StatusInternalServerError, err.Error())
				return
			}
			if dishes == nil {
				dishes = []repository.Dish{}
			}
			writeJSON(w, http.StatusOK, dishes)

		case http.MethodPost:
			authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				var body struct {
					Title       string  `json:"title"`
					Description *string `json:"description"`
					Category    *string `json:"category"`
					ImageURL    *string `json:"image_url"`
					Featured    bool    `json:"featured"`
				}
				if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
					writeError(w, http.StatusBadRequest, "invalid request body")
					return
				}
				if strings.TrimSpace(body.Title) == "" {
					writeError(w, http.StatusBadRequest, "title is required")
					return
				}
				dish, err := repo.CreateDish(r.Context(), body.Title, body.Description, body.Category, body.ImageURL, body.Featured)
				if err != nil {
					writeError(w, http.StatusInternalServerError, err.Error())
					return
				}
				writeJSON(w, http.StatusCreated, dish)
			})).ServeHTTP(w, r)

		default:
			w.Header().Set("Allow", "GET, POST")
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		}
	})
}

// NewFeaturedDishesHandler handles GET /api/dishes/featured.
func NewFeaturedDishesHandler(repo dishRepo) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
			return
		}
		dishes, err := repo.ListFeaturedDishes(r.Context())
		if err != nil {
			writeError(w, http.StatusInternalServerError, err.Error())
			return
		}
		if dishes == nil {
			dishes = []repository.Dish{}
		}
		writeJSON(w, http.StatusOK, dishes)
	})
}

// NewDishByIDHandler handles GET, PUT, DELETE /api/dishes/{id}.
func NewDishByIDHandler(repo dishRepo, cdnBaseURL string, deleter storage.ObjectDeleter, authMiddleware func(http.Handler) http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		if id == "" {
			writeError(w, http.StatusBadRequest, "missing id")
			return
		}

		switch r.Method {
		case http.MethodGet:
			dish, err := repo.GetDishByID(r.Context(), id)
			if err != nil {
				writeError(w, http.StatusInternalServerError, err.Error())
				return
			}
			if dish == nil {
				writeError(w, http.StatusNotFound, "dish not found")
				return
			}
			writeJSON(w, http.StatusOK, dish)

		case http.MethodPut:
			authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				var body struct {
					Title       string  `json:"title"`
					Description *string `json:"description"`
					Category    *string `json:"category"`
					ImageURL    *string `json:"image_url"`
					Featured    bool    `json:"featured"`
				}
				if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
					writeError(w, http.StatusBadRequest, "invalid request body")
					return
				}
				dish, err := repo.UpdateDish(r.Context(), id, body.Title, body.Description, body.Category, body.ImageURL, body.Featured)
				if err != nil {
					writeError(w, http.StatusInternalServerError, err.Error())
					return
				}
				if dish == nil {
					writeError(w, http.StatusNotFound, "dish not found")
					return
				}
				writeJSON(w, http.StatusOK, dish)
			})).ServeHTTP(w, r)

		case http.MethodDelete:
			authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				dish, err := repo.GetDishByID(r.Context(), id)
				if err != nil {
					writeError(w, http.StatusInternalServerError, err.Error())
					return
				}
				if dish == nil {
					writeError(w, http.StatusNotFound, "dish not found")
					return
				}
				// Clean up GCS image if present.
				if dish.ImageURL != nil && cdnBaseURL != "" && deleter != nil {
					objectPath := strings.TrimPrefix(*dish.ImageURL, cdnBaseURL+"/")
					_ = deleter.DeleteObject(r.Context(), "", objectPath)
				}
				ok, err := repo.DeleteDish(r.Context(), id)
				if err != nil {
					writeError(w, http.StatusInternalServerError, err.Error())
					return
				}
				if !ok {
					writeError(w, http.StatusNotFound, "dish not found")
					return
				}
				w.WriteHeader(http.StatusNoContent)
			})).ServeHTTP(w, r)

		default:
			w.Header().Set("Allow", "GET, PUT, DELETE")
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		}
	})
}

func writeJSON(w http.ResponseWriter, status int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(map[string]string{"error": msg})
}

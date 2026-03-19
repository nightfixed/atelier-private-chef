package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/nightfixed/atelier-private-chef/api/internal/repository"
	"github.com/nightfixed/atelier-private-chef/api/internal/storage"
)

type galleryRepo interface {
	ListGalleryItems(ctx context.Context, category string) ([]repository.GalleryItem, error)
	GetGalleryItemByID(ctx context.Context, id string) (*repository.GalleryItem, error)
	CreateGalleryItem(ctx context.Context, imageURL string, caption, category *string, displayOrder int) (*repository.GalleryItem, error)
	UpdateGalleryItem(ctx context.Context, id, imageURL string, caption, category *string, displayOrder int) (*repository.GalleryItem, error)
	DeleteGalleryItem(ctx context.Context, id string) (bool, error)
}

// NewGalleryHandler handles GET /api/gallery and POST /api/gallery.
func NewGalleryHandler(repo galleryRepo, authMiddleware func(http.Handler) http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			category := r.URL.Query().Get("category")
			items, err := repo.ListGalleryItems(r.Context(), category)
			if err != nil {
				writeError(w, http.StatusInternalServerError, err.Error())
				return
			}
			if items == nil {
				items = []repository.GalleryItem{}
			}
			writeJSON(w, http.StatusOK, items)

		case http.MethodPost:
			authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				var body struct {
					ImageURL     string  `json:"image_url"`
					Caption      *string `json:"caption"`
					Category     *string `json:"category"`
					DisplayOrder int     `json:"display_order"`
				}
				if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
					writeError(w, http.StatusBadRequest, "invalid request body")
					return
				}
				if strings.TrimSpace(body.ImageURL) == "" {
					writeError(w, http.StatusBadRequest, "image_url is required")
					return
				}
				item, err := repo.CreateGalleryItem(r.Context(), body.ImageURL, body.Caption, body.Category, body.DisplayOrder)
				if err != nil {
					writeError(w, http.StatusInternalServerError, err.Error())
					return
				}
				writeJSON(w, http.StatusCreated, item)
			})).ServeHTTP(w, r)

		default:
			w.Header().Set("Allow", "GET, POST")
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		}
	})
}

// NewGalleryItemByIDHandler handles GET, PUT, DELETE /api/gallery/{id}.
func NewGalleryItemByIDHandler(repo galleryRepo, cdnBaseURL string, deleter storage.ObjectDeleter, authMiddleware func(http.Handler) http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		if id == "" {
			writeError(w, http.StatusBadRequest, "missing id")
			return
		}

		switch r.Method {
		case http.MethodGet:
			item, err := repo.GetGalleryItemByID(r.Context(), id)
			if err != nil {
				writeError(w, http.StatusInternalServerError, err.Error())
				return
			}
			if item == nil {
				writeError(w, http.StatusNotFound, "gallery item not found")
				return
			}
			writeJSON(w, http.StatusOK, item)

		case http.MethodPut:
			authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				var body struct {
					ImageURL     string  `json:"image_url"`
					Caption      *string `json:"caption"`
					Category     *string `json:"category"`
					DisplayOrder *int    `json:"display_order"`
				}
				if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
					writeError(w, http.StatusBadRequest, "invalid request body")
					return
				}
				order := 0
				if body.DisplayOrder != nil {
					order = *body.DisplayOrder
				}
				item, err := repo.UpdateGalleryItem(r.Context(), id, body.ImageURL, body.Caption, body.Category, order)
				if err != nil {
					writeError(w, http.StatusInternalServerError, err.Error())
					return
				}
				if item == nil {
					writeError(w, http.StatusNotFound, "gallery item not found")
					return
				}
				writeJSON(w, http.StatusOK, item)
			})).ServeHTTP(w, r)

		case http.MethodDelete:
			authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				item, err := repo.GetGalleryItemByID(r.Context(), id)
				if err != nil {
					writeError(w, http.StatusInternalServerError, err.Error())
					return
				}
				if item == nil {
					writeError(w, http.StatusNotFound, "gallery item not found")
					return
				}
				if cdnBaseURL != "" && deleter != nil {
					objectPath := strings.TrimPrefix(item.ImageURL, cdnBaseURL+"/")
					_ = deleter.DeleteObject(r.Context(), "", objectPath)
				}
				ok, err := repo.DeleteGalleryItem(r.Context(), id)
				if err != nil {
					writeError(w, http.StatusInternalServerError, err.Error())
					return
				}
				if !ok {
					writeError(w, http.StatusNotFound, "gallery item not found")
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



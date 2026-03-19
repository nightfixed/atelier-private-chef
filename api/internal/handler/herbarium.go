package handler

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/nightfixed/atelier-private-chef/api/internal/repository"
)

type herbariumRepo interface {
	ListSpecimens(ctx context.Context) ([]repository.HerbariumSpecimen, error)
	GetSpecimenByID(ctx context.Context, id string) (*repository.HerbariumSpecimen, error)
	CreateSpecimen(ctx context.Context, in repository.CreateSpecimenInput) (*repository.HerbariumSpecimen, error)
	UpdateSpecimen(ctx context.Context, id string, in repository.CreateSpecimenInput) (*repository.HerbariumSpecimen, error)
	DeleteSpecimen(ctx context.Context, id string) (bool, error)
}

// NewHerbariumHandler handles GET /api/herbarium and POST /api/herbarium.
func NewHerbariumHandler(repo herbariumRepo, authMiddleware func(http.Handler) http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			specimens, err := repo.ListSpecimens(r.Context())
			if err != nil {
				writeError(w, http.StatusInternalServerError, err.Error())
				return
			}
			if specimens == nil {
				specimens = []repository.HerbariumSpecimen{}
			}
			writeJSON(w, http.StatusOK, specimens)

		case http.MethodPost:
			authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				in, ok := decodeSpecimenInput(w, r)
				if !ok {
					return
				}
				s, err := repo.CreateSpecimen(r.Context(), in)
				if err != nil {
					writeError(w, http.StatusInternalServerError, err.Error())
					return
				}
				writeJSON(w, http.StatusCreated, s)
			})).ServeHTTP(w, r)

		default:
			w.Header().Set("Allow", "GET, POST")
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		}
	})
}

// NewHerbariumSpecimenByIDHandler handles GET, PUT, DELETE /api/herbarium/{id}.
func NewHerbariumSpecimenByIDHandler(repo herbariumRepo, authMiddleware func(http.Handler) http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		if id == "" {
			writeError(w, http.StatusBadRequest, "missing id")
			return
		}

		switch r.Method {
		case http.MethodGet:
			s, err := repo.GetSpecimenByID(r.Context(), id)
			if err != nil {
				writeError(w, http.StatusInternalServerError, err.Error())
				return
			}
			if s == nil {
				writeError(w, http.StatusNotFound, "specimen not found")
				return
			}
			writeJSON(w, http.StatusOK, s)

		case http.MethodPut:
			authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				in, ok := decodeSpecimenInput(w, r)
				if !ok {
					return
				}
				s, err := repo.UpdateSpecimen(r.Context(), id, in)
				if err != nil {
					writeError(w, http.StatusInternalServerError, err.Error())
					return
				}
				if s == nil {
					writeError(w, http.StatusNotFound, "specimen not found")
					return
				}
				writeJSON(w, http.StatusOK, s)
			})).ServeHTTP(w, r)

		case http.MethodDelete:
			authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				ok, err := repo.DeleteSpecimen(r.Context(), id)
				if err != nil {
					writeError(w, http.StatusInternalServerError, err.Error())
					return
				}
				if !ok {
					writeError(w, http.StatusNotFound, "specimen not found")
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

func decodeSpecimenInput(w http.ResponseWriter, r *http.Request) (repository.CreateSpecimenInput, bool) {
	var body struct {
		Num          string          `json:"num"`
		Code         string          `json:"code"`
		Category     *string         `json:"category"`
		NameRo       string          `json:"name_ro"`
		NameEn       *string         `json:"name_en"`
		LatinName    *string         `json:"latin_name"`
		NameLarge    *string         `json:"name_large"`
		Badge        *string         `json:"badge"`
		BadgeCls     string          `json:"badge_cls"`
		Meta         json.RawMessage `json:"meta"`
		Spectrum     json.RawMessage `json:"spectrum"`
		Pills        json.RawMessage `json:"pills"`
		DescRo       *string         `json:"desc_ro"`
		DescEn       *string         `json:"desc_en"`
		NoteRo       *string         `json:"note_ro"`
		NoteEn       *string         `json:"note_en"`
		UsageList    json.RawMessage `json:"usage_list"`
		DisplayOrder int             `json:"display_order"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return repository.CreateSpecimenInput{}, false
	}
	if body.Num == "" || body.Code == "" || body.NameRo == "" {
		writeError(w, http.StatusBadRequest, "num, code, and name_ro are required")
		return repository.CreateSpecimenInput{}, false
	}
	return repository.CreateSpecimenInput{
		Num:          body.Num,
		Code:         body.Code,
		Category:     body.Category,
		NameRo:       body.NameRo,
		NameEn:       body.NameEn,
		LatinName:    body.LatinName,
		NameLarge:    body.NameLarge,
		Badge:        body.Badge,
		BadgeCls:     body.BadgeCls,
		Meta:         body.Meta,
		Spectrum:     body.Spectrum,
		Pills:        body.Pills,
		DescRo:       body.DescRo,
		DescEn:       body.DescEn,
		NoteRo:       body.NoteRo,
		NoteEn:       body.NoteEn,
		UsageList:    body.UsageList,
		DisplayOrder: body.DisplayOrder,
	}, true
}

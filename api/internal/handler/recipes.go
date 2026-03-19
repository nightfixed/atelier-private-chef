package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/nightfixed/atelier-private-chef/api/internal/repository"
)

type recipeRepo interface {
	ListRecipes(ctx context.Context) ([]repository.Recipe, error)
	GetRecipeByID(ctx context.Context, id string) (*repository.Recipe, error)
	CreateRecipe(ctx context.Context, in repository.CreateRecipeInput) (*repository.Recipe, error)
	UpdateRecipe(ctx context.Context, id string, in repository.CreateRecipeInput) (*repository.Recipe, error)
	DeleteRecipe(ctx context.Context, id string) (bool, error)
}

// NewRecipesHandler handles GET /api/recipes and POST /api/recipes.
func NewRecipesHandler(repo recipeRepo, authMiddleware func(http.Handler) http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			recipes, err := repo.ListRecipes(r.Context())
			if err != nil {
				writeError(w, http.StatusInternalServerError, err.Error())
				return
			}
			if recipes == nil {
				recipes = []repository.Recipe{}
			}
			writeJSON(w, http.StatusOK, recipes)

		case http.MethodPost:
			authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				var in repository.CreateRecipeInput
				if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
					writeError(w, http.StatusBadRequest, "invalid request body")
					return
				}
				if strings.TrimSpace(in.Title) == "" {
					writeError(w, http.StatusBadRequest, "title is required")
					return
				}
				recipe, err := repo.CreateRecipe(r.Context(), in)
				if err != nil {
					writeError(w, http.StatusInternalServerError, err.Error())
					return
				}
				writeJSON(w, http.StatusCreated, recipe)
			})).ServeHTTP(w, r)

		default:
			w.Header().Set("Allow", "GET, POST")
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		}
	})
}

// NewRecipeByIDHandler handles GET, PUT, DELETE /api/recipes/{id}.
func NewRecipeByIDHandler(repo recipeRepo, authMiddleware func(http.Handler) http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		if id == "" {
			writeError(w, http.StatusBadRequest, "missing id")
			return
		}

		switch r.Method {
		case http.MethodGet:
			recipe, err := repo.GetRecipeByID(r.Context(), id)
			if err != nil {
				writeError(w, http.StatusInternalServerError, err.Error())
				return
			}
			if recipe == nil {
				writeError(w, http.StatusNotFound, "recipe not found")
				return
			}
			writeJSON(w, http.StatusOK, recipe)

		case http.MethodPut:
			authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				var in repository.CreateRecipeInput
				if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
					writeError(w, http.StatusBadRequest, "invalid request body")
					return
				}
				recipe, err := repo.UpdateRecipe(r.Context(), id, in)
				if err != nil {
					writeError(w, http.StatusInternalServerError, err.Error())
					return
				}
				if recipe == nil {
					writeError(w, http.StatusNotFound, "recipe not found")
					return
				}
				writeJSON(w, http.StatusOK, recipe)
			})).ServeHTTP(w, r)

		case http.MethodDelete:
			authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				ok, err := repo.DeleteRecipe(r.Context(), id)
				if err != nil {
					writeError(w, http.StatusInternalServerError, err.Error())
					return
				}
				if !ok {
					writeError(w, http.StatusNotFound, "recipe not found")
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

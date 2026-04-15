package handler

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/nightfixed/atelier-private-chef/api/internal/ai"
	"github.com/nightfixed/atelier-private-chef/api/internal/repository"
)

type herbariumLister interface {
	ListSpecimens(ctx context.Context) ([]repository.HerbariumSpecimen, error)
}

type recipeLister interface {
	ListRecipes(ctx context.Context) ([]repository.Recipe, error)
}

// NewGenerateHandler handles POST /api/generate-menu.
func NewGenerateHandler(provider ai.Provider, herbRepo herbariumLister, recipeRepo recipeLister) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
			return
		}

		var req ai.MenuRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeError(w, http.StatusBadRequest, "invalid JSON")
			return
		}
		if req.HostName == "" {
			req.HostName = "dumneavoastră"
		}

		// Inject recipes from DB so the AI knows Atelier's full repertoire.
		if recipes, err := recipeRepo.ListRecipes(r.Context()); err == nil {
			for _, rc := range recipes {
				ctx := ai.RecipeContext{Title: rc.Title}
				if rc.Description != nil {
					ctx.Description = *rc.Description
				}
				if rc.Ingredients != nil {
					ctx.Ingredients = string(rc.Ingredients)
				}
				if rc.Steps != nil {
					ctx.Steps = string(rc.Steps)
				}
				req.Recipes = append(req.Recipes, ctx)
			}
		} else {
			log.Printf("generate-menu: could not load recipes: %v", err)
		}

		resp, err := provider.GenerateMenu(r.Context(), req)
		if err != nil {
			log.Printf("generate-menu error: %v", err)
			writeError(w, http.StatusInternalServerError, "generation failed")
			return
		}

		writeJSON(w, http.StatusOK, resp)
	})
}

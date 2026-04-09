package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/nightfixed/atelier-private-chef/api/internal/ai"
)

// NewMatriceaHandler handles POST /api/generate-matricea.
func NewMatriceaHandler(provider ai.Provider) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
			return
		}

		var req ai.MatriceaRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeError(w, http.StatusBadRequest, "invalid JSON")
			return
		}
		if req.Type == "" {
			writeError(w, http.StatusBadRequest, "type required")
			return
		}

		resp, err := provider.GenerateMatricea(r.Context(), req)
		if err != nil {
			log.Printf("matricea error: %v", err)
			writeError(w, http.StatusInternalServerError, "generation failed")
			return
		}

		writeJSON(w, http.StatusOK, resp)
	})
}

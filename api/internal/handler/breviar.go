package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/nightfixed/atelier-private-chef/api/internal/ai"
)

// NewBreviarHandler handles POST /api/generate-breviar.
func NewBreviarHandler(provider ai.Provider) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
			return
		}

		var req ai.BreviarRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeError(w, http.StatusBadRequest, "invalid JSON")
			return
		}
		if req.Industry == "" {
			writeError(w, http.StatusBadRequest, "industry required")
			return
		}

		resp, err := provider.GenerateBreviar(r.Context(), req)
		if err != nil {
			log.Printf("breviar error: %v", err)
			writeError(w, http.StatusInternalServerError, "generation failed")
			return
		}

		writeJSON(w, http.StatusOK, resp)
	})
}

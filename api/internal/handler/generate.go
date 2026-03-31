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

// NewGenerateHandler handles POST /api/generate-menu.
func NewGenerateHandler(provider ai.Provider, herbRepo herbariumLister) http.Handler {
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


resp, err := provider.GenerateMenu(r.Context(), req)
if err != nil {
log.Printf("generate-menu error: %v", err)
writeError(w, http.StatusInternalServerError, "generation failed")
return
}

writeJSON(w, http.StatusOK, resp)
})
}

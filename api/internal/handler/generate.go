package handler

import (
"context"
"encoding/json"
"net/http"

"github.com/nightfixed/atelier-private-chef/api/internal/ai"
"github.com/nightfixed/atelier-private-chef/api/internal/repository"
)

type herbariumLister interface {
ListSpecimens(ctx context.Context, category string) ([]repository.HerbariumSpecimen, error)
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

// Inject herbarium context server-side — never trust the client for this.
if specimens, err := herbRepo.ListSpecimens(r.Context(), ""); err == nil {
for _, s := range specimens {
sc := ai.SpecimenContext{NameRo: s.NameRo}
			if s.LatinName != nil {
				sc.Latin = *s.LatinName
			}
if s.DescRo != nil {
sc.DescRo = *s.DescRo
}
req.Specimens = append(req.Specimens, sc)
}
}

resp, err := provider.GenerateMenu(r.Context(), req)
if err != nil {
writeError(w, http.StatusInternalServerError, "generation failed")
return
}

writeJSON(w, http.StatusOK, resp)
})
}

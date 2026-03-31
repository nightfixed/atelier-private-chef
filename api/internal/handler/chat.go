package handler

import (
"encoding/json"
"log"
	"net/http"

"github.com/nightfixed/atelier-private-chef/api/internal/ai"
)

// NewChatHandler handles POST /api/chat.
func NewChatHandler(provider ai.Provider) http.Handler {
return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
if r.Method != http.MethodPost {
writeError(w, http.StatusMethodNotAllowed, "method not allowed")
return
}

var req ai.ChatRequest
if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
writeError(w, http.StatusBadRequest, "invalid JSON")
return
}
if len(req.Messages) == 0 {
writeError(w, http.StatusBadRequest, "messages required")
return
}

resp, err := provider.Chat(r.Context(), req)
if err != nil {
log.Printf("chat error: %v", err)
writeError(w, http.StatusInternalServerError, "chat failed")
return
}

writeJSON(w, http.StatusOK, resp)
})
}

package middleware

import (
	"net/http"
	"os"
	"strings"
)

// defaultAllowedOrigins are the origins permitted when CORS_ORIGINS is not set.
var defaultAllowedOrigins = []string{
	"https://atelierprivatedining.ro",
	"https://www.atelierprivatedining.ro",
	"https://atelier-private-chef.pages.dev",
}

// CORS adds Cross-Origin Resource Sharing headers.
// Set the CORS_ORIGINS env var to a comma-separated list to override defaults.
func CORS(next http.Handler) http.Handler {
	allowed := defaultAllowedOrigins
	if env := os.Getenv("CORS_ORIGINS"); env != "" {
		allowed = strings.Split(env, ",")
	}

	allowedSet := make(map[string]bool, len(allowed))
	for _, o := range allowed {
		allowedSet[strings.TrimSpace(o)] = true
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if allowedSet[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

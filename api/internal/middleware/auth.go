// Package middleware provides reusable HTTP middleware constructors.
package middleware

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/nightfixed/atelier-private-chef/api/internal/auth"
)

type contextKey int

const claimsKey contextKey = iota

// ClaimsFromContext retrieves the verified *auth.TokenClaims from the context.
func ClaimsFromContext(ctx context.Context) *auth.TokenClaims {
	v, _ := ctx.Value(claimsKey).(*auth.TokenClaims)
	return v
}

// RequireAuth returns a middleware that validates the Firebase ID token in the
// "Authorization: Bearer <token>" header. OPTIONS preflights are passed through.
func RequireAuth(verifier auth.TokenVerifier) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.Method == http.MethodOptions {
				next.ServeHTTP(w, r)
				return
			}

			token, ok := bearerToken(r)
			if !ok {
				writeUnauthorized(w, "missing or malformed Authorization header")
				return
			}

			claims, err := verifier.VerifyIDToken(r.Context(), token)
			if err != nil {
				writeUnauthorized(w, "invalid or expired token")
				return
			}

			ctx := context.WithValue(r.Context(), claimsKey, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func bearerToken(r *http.Request) (string, bool) {
	h := r.Header.Get("Authorization")
	if h == "" {
		return "", false
	}
	parts := strings.SplitN(h, " ", 2)
	if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
		return "", false
	}
	token := strings.TrimSpace(parts[1])
	if token == "" {
		return "", false
	}
	return token, true
}

func writeUnauthorized(w http.ResponseWriter, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusUnauthorized)
	_ = json.NewEncoder(w).Encode(map[string]string{"error": message})
}

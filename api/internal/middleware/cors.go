package middleware

import "net/http"

// allowedOrigin is the GitHub Pages URL for this project.
// Update this after enabling GitHub Pages on the repository.
const allowedOrigin = "https://nightfixed.github.io"

// CORS adds Cross-Origin Resource Sharing headers so the frontend on
// GitHub Pages can call the Cloud Run API.
func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

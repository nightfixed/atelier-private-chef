package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/nightfixed/atelier-private-chef/api/internal/storage"
)

// NewUploadHandler returns an admin-only handler that issues a signed GCS PUT URL
// for direct browser image uploads. The caller must pass ?filename=<name>&content_type=<mime>.
func NewUploadHandler(signer storage.Signer, bucket string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.Header().Set("Allow", "GET")
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
			return
		}

		filename := r.URL.Query().Get("filename")
		contentType := r.URL.Query().Get("content_type")
		if filename == "" {
			writeError(w, http.StatusBadRequest, "filename is required")
			return
		}
		if contentType == "" {
			contentType = "image/jpeg"
		}

		objectPath := fmt.Sprintf("uploads/%d-%s", time.Now().UnixMilli(), filename)

		url, err := signer.SignPutURL(r.Context(), storage.SignedURLOptions{
			Bucket:      bucket,
			Object:      objectPath,
			ContentType: contentType,
			Expires:     15 * time.Minute,
		})
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to generate upload URL")
			return
		}

		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]string{
			"upload_url":  url,
			"object_path": objectPath,
		})
	})
}

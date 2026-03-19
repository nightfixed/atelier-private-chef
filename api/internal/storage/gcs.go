// Package storage provides GCS helpers for the Atelier API.
package storage

import (
	"context"
	"fmt"
	"net/http"
	"time"

	gcs "cloud.google.com/go/storage"
	"google.golang.org/api/iterator"
)

// SignedURLOptions configures signed URL generation.
type SignedURLOptions struct {
	Bucket      string
	Object      string
	ContentType string
	Expires     time.Duration
}

// Signer generates GCS signed PUT URLs.
type Signer interface {
	SignPutURL(ctx context.Context, opts SignedURLOptions) (string, error)
}

// GCSSigner generates signed PUT URLs using the real GCS client.
type GCSSigner struct {
	client *gcs.Client
}

// NewGCSSigner constructs a GCSSigner.
func NewGCSSigner(client *gcs.Client) *GCSSigner {
	return &GCSSigner{client: client}
}

// SignPutURL generates a V4 signed URL for an HTTP PUT of a single object.
func (s *GCSSigner) SignPutURL(ctx context.Context, opts SignedURLOptions) (string, error) {
	url, err := s.client.Bucket(opts.Bucket).SignedURL(opts.Object, &gcs.SignedURLOptions{
		Method:      http.MethodPut,
		ContentType: opts.ContentType,
		Expires:     time.Now().Add(opts.Expires),
		Scheme:      gcs.SigningSchemeV4,
	})
	if err != nil {
		return "", fmt.Errorf("sign PUT URL for gs://%s/%s: %w", opts.Bucket, opts.Object, err)
	}
	return url, nil
}

// ObjectDeleter abstracts GCS object deletion.
type ObjectDeleter interface {
	DeleteObject(ctx context.Context, bucket, object string) error
	DeletePrefix(ctx context.Context, bucket, prefix string) error
}

// GCSObjectDeleter implements ObjectDeleter using the real GCS client.
type GCSObjectDeleter struct {
	client *gcs.Client
}

// NewGCSObjectDeleter constructs a GCSObjectDeleter.
func NewGCSObjectDeleter(client *gcs.Client) *GCSObjectDeleter {
	return &GCSObjectDeleter{client: client}
}

// DeleteObject deletes the GCS object. Not-found errors are silently ignored.
func (d *GCSObjectDeleter) DeleteObject(ctx context.Context, bucket, object string) error {
	err := d.client.Bucket(bucket).Object(object).Delete(ctx)
	if err != nil && err != gcs.ErrObjectNotExist {
		return fmt.Errorf("delete gs://%s/%s: %w", bucket, object, err)
	}
	return nil
}

// DeletePrefix deletes all GCS objects under a given prefix.
func (d *GCSObjectDeleter) DeletePrefix(ctx context.Context, bucket, prefix string) error {
	it := d.client.Bucket(bucket).Objects(ctx, &gcs.Query{Prefix: prefix})
	for {
		attrs, err := it.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return fmt.Errorf("list objects under gs://%s/%s: %w", bucket, prefix, err)
		}
		if delErr := d.client.Bucket(bucket).Object(attrs.Name).Delete(ctx); delErr != nil && delErr != gcs.ErrObjectNotExist {
			return fmt.Errorf("delete gs://%s/%s: %w", bucket, attrs.Name, delErr)
		}
	}
	return nil
}

// NopObjectDeleter is a no-op ObjectDeleter for tests.
type NopObjectDeleter struct{}

func NewNopObjectDeleter() *NopObjectDeleter           { return &NopObjectDeleter{} }
func (*NopObjectDeleter) DeleteObject(_ context.Context, _, _ string) error { return nil }
func (*NopObjectDeleter) DeletePrefix(_ context.Context, _, _ string) error { return nil }

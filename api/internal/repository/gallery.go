package repository

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
)

// GalleryItem represents a standalone plating/prep photo.
type GalleryItem struct {
	ID           string    `json:"id"`
	ImageURL     string    `json:"image_url"`
	Caption      *string   `json:"caption"`
	Category     *string   `json:"category"`
	DisplayOrder int       `json:"display_order"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// GalleryRepository handles database operations for gallery items.
type GalleryRepository struct {
	db *sql.DB
}

// NewGalleryRepository creates a new GalleryRepository.
func NewGalleryRepository(db *sql.DB) *GalleryRepository {
	return &GalleryRepository{db: db}
}

// ListGalleryItems returns all gallery items ordered by display_order then created_at.
func (r *GalleryRepository) ListGalleryItems(ctx context.Context, category string) ([]GalleryItem, error) {
	query := `SELECT id, image_url, caption, category, display_order, created_at, updated_at FROM gallery_items`
	args := []interface{}{}
	if category != "" {
		query += ` WHERE category = $1`
		args = append(args, category)
	}
	query += ` ORDER BY display_order ASC, created_at DESC`

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []GalleryItem
	for rows.Next() {
		var g GalleryItem
		if err := rows.Scan(&g.ID, &g.ImageURL, &g.Caption, &g.Category, &g.DisplayOrder, &g.CreatedAt, &g.UpdatedAt); err != nil {
			return nil, err
		}
		items = append(items, g)
	}
	return items, rows.Err()
}

// GetGalleryItemByID returns a single gallery item.
func (r *GalleryRepository) GetGalleryItemByID(ctx context.Context, id string) (*GalleryItem, error) {
	var g GalleryItem
	err := r.db.QueryRowContext(ctx,
		`SELECT id, image_url, caption, category, display_order, created_at, updated_at
		 FROM gallery_items WHERE id=$1`, id).
		Scan(&g.ID, &g.ImageURL, &g.Caption, &g.Category, &g.DisplayOrder, &g.CreatedAt, &g.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &g, err
}

// CreateGalleryItem inserts a new gallery item.
func (r *GalleryRepository) CreateGalleryItem(ctx context.Context, imageURL string, caption, category *string, displayOrder int) (*GalleryItem, error) {
	id := uuid.New().String()
	var g GalleryItem
	err := r.db.QueryRowContext(ctx,
		`INSERT INTO gallery_items (id, image_url, caption, category, display_order)
		 VALUES ($1,$2,$3,$4,$5)
		 RETURNING id, image_url, caption, category, display_order, created_at, updated_at`,
		id, imageURL, caption, category, displayOrder).
		Scan(&g.ID, &g.ImageURL, &g.Caption, &g.Category, &g.DisplayOrder, &g.CreatedAt, &g.UpdatedAt)
	return &g, err
}

// UpdateGalleryItem updates an existing gallery item.
func (r *GalleryRepository) UpdateGalleryItem(ctx context.Context, id, imageURL string, caption, category *string, displayOrder int) (*GalleryItem, error) {
	var g GalleryItem
	err := r.db.QueryRowContext(ctx,
		`UPDATE gallery_items SET image_url=$2, caption=$3, category=$4, display_order=$5, updated_at=NOW()
		 WHERE id=$1
		 RETURNING id, image_url, caption, category, display_order, created_at, updated_at`,
		id, imageURL, caption, category, displayOrder).
		Scan(&g.ID, &g.ImageURL, &g.Caption, &g.Category, &g.DisplayOrder, &g.CreatedAt, &g.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &g, err
}

// DeleteGalleryItem deletes a gallery item by ID.
func (r *GalleryRepository) DeleteGalleryItem(ctx context.Context, id string) (bool, error) {
	res, err := r.db.ExecContext(ctx, `DELETE FROM gallery_items WHERE id=$1`, id)
	if err != nil {
		return false, err
	}
	n, _ := res.RowsAffected()
	return n > 0, nil
}

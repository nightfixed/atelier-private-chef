package repository

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
)

// Dish represents a chef's creation.
type Dish struct {
	ID          string     `json:"id"`
	Title       string     `json:"title"`
	Description *string    `json:"description"`
	Category    *string    `json:"category"`
	ImageURL    *string    `json:"image_url"`
	Featured    bool       `json:"featured"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

// DishRepository handles database operations for dishes.
type DishRepository struct {
	db *sql.DB
}

// NewDishRepository creates a new DishRepository.
func NewDishRepository(db *sql.DB) *DishRepository {
	return &DishRepository{db: db}
}

// ListDishes returns all dishes, optionally filtered by category.
func (r *DishRepository) ListDishes(ctx context.Context, category string) ([]Dish, error) {
	query := `SELECT id, title, description, category, image_url, featured, created_at, updated_at FROM dishes`
	args := []interface{}{}
	if category != "" {
		query += ` WHERE category = $1`
		args = append(args, category)
	}
	query += ` ORDER BY created_at DESC`

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var dishes []Dish
	for rows.Next() {
		var d Dish
		if err := rows.Scan(&d.ID, &d.Title, &d.Description, &d.Category, &d.ImageURL, &d.Featured, &d.CreatedAt, &d.UpdatedAt); err != nil {
			return nil, err
		}
		dishes = append(dishes, d)
	}
	return dishes, rows.Err()
}

// ListFeaturedDishes returns only featured dishes.
func (r *DishRepository) ListFeaturedDishes(ctx context.Context) ([]Dish, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT id, title, description, category, image_url, featured, created_at, updated_at
		 FROM dishes WHERE featured = TRUE ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var dishes []Dish
	for rows.Next() {
		var d Dish
		if err := rows.Scan(&d.ID, &d.Title, &d.Description, &d.Category, &d.ImageURL, &d.Featured, &d.CreatedAt, &d.UpdatedAt); err != nil {
			return nil, err
		}
		dishes = append(dishes, d)
	}
	return dishes, rows.Err()
}

// GetDishByID returns a single dish by ID.
func (r *DishRepository) GetDishByID(ctx context.Context, id string) (*Dish, error) {
	var d Dish
	err := r.db.QueryRowContext(ctx,
		`SELECT id, title, description, category, image_url, featured, created_at, updated_at
		 FROM dishes WHERE id = $1`, id).
		Scan(&d.ID, &d.Title, &d.Description, &d.Category, &d.ImageURL, &d.Featured, &d.CreatedAt, &d.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &d, err
}

// CreateDish inserts a new dish and returns it.
func (r *DishRepository) CreateDish(ctx context.Context, title string, description, category, imageURL *string, featured bool) (*Dish, error) {
	id := uuid.New().String()
	var d Dish
	err := r.db.QueryRowContext(ctx,
		`INSERT INTO dishes (id, title, description, category, image_url, featured)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING id, title, description, category, image_url, featured, created_at, updated_at`,
		id, title, description, category, imageURL, featured).
		Scan(&d.ID, &d.Title, &d.Description, &d.Category, &d.ImageURL, &d.Featured, &d.CreatedAt, &d.UpdatedAt)
	return &d, err
}

// UpdateDish updates an existing dish.
func (r *DishRepository) UpdateDish(ctx context.Context, id, title string, description, category, imageURL *string, featured bool) (*Dish, error) {
	var d Dish
	err := r.db.QueryRowContext(ctx,
		`UPDATE dishes SET title=$2, description=$3, category=$4, image_url=$5, featured=$6, updated_at=NOW()
		 WHERE id=$1
		 RETURNING id, title, description, category, image_url, featured, created_at, updated_at`,
		id, title, description, category, imageURL, featured).
		Scan(&d.ID, &d.Title, &d.Description, &d.Category, &d.ImageURL, &d.Featured, &d.CreatedAt, &d.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &d, err
}

// DeleteDish deletes a dish by ID. Returns false if not found.
func (r *DishRepository) DeleteDish(ctx context.Context, id string) (bool, error) {
	res, err := r.db.ExecContext(ctx, `DELETE FROM dishes WHERE id=$1`, id)
	if err != nil {
		return false, err
	}
	n, _ := res.RowsAffected()
	return n > 0, nil
}

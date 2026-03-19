package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// Recipe represents a detailed recipe for a dish.
type Recipe struct {
	ID           string          `json:"id"`
	DishID       *string         `json:"dish_id"`
	Title        string          `json:"title"`
	Description  *string         `json:"description"`
	Ingredients  json.RawMessage `json:"ingredients"`
	Steps        json.RawMessage `json:"steps"`
	PrepTimeMins *int            `json:"prep_time_min"`
	CookTimeMins *int            `json:"cook_time_min"`
	Servings     *int            `json:"servings"`
	CreatedAt    time.Time       `json:"created_at"`
	UpdatedAt    time.Time       `json:"updated_at"`
}

// RecipeRepository handles database operations for recipes.
type RecipeRepository struct {
	db *sql.DB
}

// NewRecipeRepository creates a new RecipeRepository.
func NewRecipeRepository(db *sql.DB) *RecipeRepository {
	return &RecipeRepository{db: db}
}

// ListRecipes returns all recipes ordered by creation date.
func (r *RecipeRepository) ListRecipes(ctx context.Context) ([]Recipe, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT id, dish_id, title, description, ingredients, steps, prep_time_min, cook_time_min, servings, created_at, updated_at
		 FROM recipes ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var recipes []Recipe
	for rows.Next() {
		var rc Recipe
		if err := rows.Scan(&rc.ID, &rc.DishID, &rc.Title, &rc.Description, &rc.Ingredients, &rc.Steps,
			&rc.PrepTimeMins, &rc.CookTimeMins, &rc.Servings, &rc.CreatedAt, &rc.UpdatedAt); err != nil {
			return nil, err
		}
		recipes = append(recipes, rc)
	}
	return recipes, rows.Err()
}

// GetRecipeByID returns a single recipe by ID.
func (r *RecipeRepository) GetRecipeByID(ctx context.Context, id string) (*Recipe, error) {
	var rc Recipe
	err := r.db.QueryRowContext(ctx,
		`SELECT id, dish_id, title, description, ingredients, steps, prep_time_min, cook_time_min, servings, created_at, updated_at
		 FROM recipes WHERE id=$1`, id).
		Scan(&rc.ID, &rc.DishID, &rc.Title, &rc.Description, &rc.Ingredients, &rc.Steps,
			&rc.PrepTimeMins, &rc.CookTimeMins, &rc.Servings, &rc.CreatedAt, &rc.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &rc, err
}

// CreateRecipeInput holds all fields for creating a recipe.
type CreateRecipeInput struct {
	DishID       *string
	Title        string
	Description  *string
	Ingredients  json.RawMessage
	Steps        json.RawMessage
	PrepTimeMins *int
	CookTimeMins *int
	Servings     *int
}

// CreateRecipe inserts a new recipe.
func (r *RecipeRepository) CreateRecipe(ctx context.Context, in CreateRecipeInput) (*Recipe, error) {
	id := uuid.New().String()
	ingredients := in.Ingredients
	if ingredients == nil {
		ingredients = json.RawMessage("[]")
	}
	steps := in.Steps
	if steps == nil {
		steps = json.RawMessage("[]")
	}
	var rc Recipe
	err := r.db.QueryRowContext(ctx,
		`INSERT INTO recipes (id, dish_id, title, description, ingredients, steps, prep_time_min, cook_time_min, servings)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
		 RETURNING id, dish_id, title, description, ingredients, steps, prep_time_min, cook_time_min, servings, created_at, updated_at`,
		id, in.DishID, in.Title, in.Description, ingredients, steps, in.PrepTimeMins, in.CookTimeMins, in.Servings).
		Scan(&rc.ID, &rc.DishID, &rc.Title, &rc.Description, &rc.Ingredients, &rc.Steps,
			&rc.PrepTimeMins, &rc.CookTimeMins, &rc.Servings, &rc.CreatedAt, &rc.UpdatedAt)
	return &rc, err
}

// UpdateRecipe updates an existing recipe.
func (r *RecipeRepository) UpdateRecipe(ctx context.Context, id string, in CreateRecipeInput) (*Recipe, error) {
	ingredients := in.Ingredients
	if ingredients == nil {
		ingredients = json.RawMessage("[]")
	}
	steps := in.Steps
	if steps == nil {
		steps = json.RawMessage("[]")
	}
	var rc Recipe
	err := r.db.QueryRowContext(ctx,
		`UPDATE recipes SET dish_id=$2, title=$3, description=$4, ingredients=$5, steps=$6,
		 prep_time_min=$7, cook_time_min=$8, servings=$9, updated_at=NOW()
		 WHERE id=$1
		 RETURNING id, dish_id, title, description, ingredients, steps, prep_time_min, cook_time_min, servings, created_at, updated_at`,
		id, in.DishID, in.Title, in.Description, ingredients, steps, in.PrepTimeMins, in.CookTimeMins, in.Servings).
		Scan(&rc.ID, &rc.DishID, &rc.Title, &rc.Description, &rc.Ingredients, &rc.Steps,
			&rc.PrepTimeMins, &rc.CookTimeMins, &rc.Servings, &rc.CreatedAt, &rc.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &rc, err
}

// DeleteRecipe deletes a recipe by ID.
func (r *RecipeRepository) DeleteRecipe(ctx context.Context, id string) (bool, error) {
	res, err := r.db.ExecContext(ctx, `DELETE FROM recipes WHERE id=$1`, id)
	if err != nil {
		return false, err
	}
	n, _ := res.RowsAffected()
	return n > 0, nil
}

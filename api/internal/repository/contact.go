package repository

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
)

// ContactRequest represents a booking/event inquiry.
type ContactRequest struct {
	ID          string     `json:"id"`
	Name        string     `json:"name"`
	Email       string     `json:"email"`
	Message     *string    `json:"message"`
	EventDate   *time.Time `json:"event_date"`
	GuestsCount *int       `json:"guests_count"`
	Occasion    *string    `json:"occasion"`
	Status      string     `json:"status"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

// ContactRepository handles database operations for contact requests.
type ContactRepository struct {
	db *sql.DB
}

// NewContactRepository creates a new ContactRepository.
func NewContactRepository(db *sql.DB) *ContactRepository {
	return &ContactRepository{db: db}
}

// CreateContactRequest inserts a new contact request.
func (r *ContactRepository) CreateContactRequest(ctx context.Context, name, email string, message *string, eventDate *time.Time, guestsCount *int, occasion *string) (*ContactRequest, error) {
	id := uuid.New().String()
	var cr ContactRequest
	err := r.db.QueryRowContext(ctx,
		`INSERT INTO contact_requests (id, name, email, message, event_date, guests_count, occasion)
		 VALUES ($1,$2,$3,$4,$5,$6,$7)
		 RETURNING id, name, email, message, event_date, guests_count, occasion, status, created_at, updated_at`,
		id, name, email, message, eventDate, guestsCount, occasion).
		Scan(&cr.ID, &cr.Name, &cr.Email, &cr.Message, &cr.EventDate, &cr.GuestsCount, &cr.Occasion, &cr.Status, &cr.CreatedAt, &cr.UpdatedAt)
	return &cr, err
}

// ListContactRequests returns all contact requests ordered by creation date.
func (r *ContactRepository) ListContactRequests(ctx context.Context, status string) ([]ContactRequest, error) {
	query := `SELECT id, name, email, message, event_date, guests_count, occasion, status, created_at, updated_at FROM contact_requests`
	args := []interface{}{}
	if status != "" {
		query += ` WHERE status = $1`
		args = append(args, status)
	}
	query += ` ORDER BY created_at DESC`

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []ContactRequest
	for rows.Next() {
		var cr ContactRequest
		if err := rows.Scan(&cr.ID, &cr.Name, &cr.Email, &cr.Message, &cr.EventDate, &cr.GuestsCount, &cr.Occasion, &cr.Status, &cr.CreatedAt, &cr.UpdatedAt); err != nil {
			return nil, err
		}
		items = append(items, cr)
	}
	return items, rows.Err()
}

// UpdateContactRequestStatus updates the status of a contact request.
func (r *ContactRepository) UpdateContactRequestStatus(ctx context.Context, id, status string) (*ContactRequest, error) {
	var cr ContactRequest
	err := r.db.QueryRowContext(ctx,
		`UPDATE contact_requests SET status=$2, updated_at=NOW()
		 WHERE id=$1
		 RETURNING id, name, email, message, event_date, guests_count, occasion, status, created_at, updated_at`,
		id, status).
		Scan(&cr.ID, &cr.Name, &cr.Email, &cr.Message, &cr.EventDate, &cr.GuestsCount, &cr.Occasion, &cr.Status, &cr.CreatedAt, &cr.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &cr, err
}

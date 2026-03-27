package repository

import (
	"context"
	"database/sql"
	"time"
)

// AvailabilityWindow is a date the chef is available for a private dining event.
type AvailabilityWindow struct {
	ID         string     `json:"id"`
	Date       string     `json:"date"` // YYYY-MM-DD
	StartTime  *string    `json:"start_time,omitempty"`
	EndTime    *string    `json:"end_time,omitempty"`
	MaxGuests  int        `json:"max_guests"`
	Notes      *string    `json:"notes,omitempty"`
	IsActive   bool       `json:"is_active"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
	// Populated via JOIN when listing public availability
	IsBooked   bool       `json:"is_booked"`
}

// Reservation is a guest request for a specific availability window.
type Reservation struct {
	ID          string     `json:"id"`
	WindowID    *string    `json:"window_id,omitempty"`
	Name        string     `json:"name"`
	Email       string     `json:"email"`
	Phone       *string    `json:"phone,omitempty"`
	GuestsCount *int       `json:"guests_count,omitempty"`
	Occasion    *string    `json:"occasion,omitempty"`
	Message     *string    `json:"message,omitempty"`
	Status      string     `json:"status"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	// Populated via JOIN for admin view
	WindowDate  *string    `json:"window_date,omitempty"`
}

type AvailabilityRepository struct{ db *sql.DB }

func NewAvailabilityRepository(db *sql.DB) *AvailabilityRepository {
	return &AvailabilityRepository{db: db}
}

// ListAvailableWindows returns active windows that are not yet confirmed-booked,
// optionally filtered to future dates only.
func (r *AvailabilityRepository) ListAvailableWindows(ctx context.Context, futureOnly bool) ([]AvailabilityWindow, error) {
	query := `
		SELECT w.id, w.date, w.start_time, w.end_time, w.max_guests, w.notes, w.is_active,
		       w.created_at, w.updated_at,
		       EXISTS (
		           SELECT 1 FROM reservations res
		           WHERE res.window_id = w.id AND res.status = 'confirmed'
		       ) AS is_booked
		FROM availability_windows w
		WHERE w.is_active = TRUE`
	if futureOnly {
		query += ` AND w.date >= CURRENT_DATE`
	}
	query += ` ORDER BY w.date ASC`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var windows []AvailabilityWindow
	for rows.Next() {
		var w AvailabilityWindow
		if err := rows.Scan(&w.ID, &w.Date, &w.StartTime, &w.EndTime, &w.MaxGuests,
			&w.Notes, &w.IsActive, &w.CreatedAt, &w.UpdatedAt, &w.IsBooked); err != nil {
			return nil, err
		}
		windows = append(windows, w)
	}
	return windows, rows.Err()
}

// CreateWindow creates a new availability window.
func (r *AvailabilityRepository) CreateWindow(ctx context.Context, date, startTime, endTime *string, maxGuests int, notes *string) (*AvailabilityWindow, error) {
	var w AvailabilityWindow
	err := r.db.QueryRowContext(ctx,
		`INSERT INTO availability_windows (date, start_time, end_time, max_guests, notes)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING id, date, start_time, end_time, max_guests, notes, is_active, created_at, updated_at`,
		date, startTime, endTime, maxGuests, notes,
	).Scan(&w.ID, &w.Date, &w.StartTime, &w.EndTime, &w.MaxGuests, &w.Notes, &w.IsActive, &w.CreatedAt, &w.UpdatedAt)
	return &w, err
}

// UpdateWindow updates an availability window.
func (r *AvailabilityRepository) UpdateWindow(ctx context.Context, id string, startTime, endTime *string, maxGuests int, notes *string, isActive bool) (*AvailabilityWindow, error) {
	var w AvailabilityWindow
	err := r.db.QueryRowContext(ctx,
		`UPDATE availability_windows
		 SET start_time=$2, end_time=$3, max_guests=$4, notes=$5, is_active=$6, updated_at=NOW()
		 WHERE id=$1
		 RETURNING id, date, start_time, end_time, max_guests, notes, is_active, created_at, updated_at`,
		id, startTime, endTime, maxGuests, notes, isActive,
	).Scan(&w.ID, &w.Date, &w.StartTime, &w.EndTime, &w.MaxGuests, &w.Notes, &w.IsActive, &w.CreatedAt, &w.UpdatedAt)
	return &w, err
}

// DeleteWindow removes an availability window.
func (r *AvailabilityRepository) DeleteWindow(ctx context.Context, id string) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM availability_windows WHERE id=$1`, id)
	return err
}

// ReservationRepository handles reservation CRUD.
type ReservationRepository struct{ db *sql.DB }

func NewReservationRepository(db *sql.DB) *ReservationRepository {
	return &ReservationRepository{db: db}
}

// CreateReservation submits a guest reservation request.
func (r *ReservationRepository) CreateReservation(ctx context.Context, windowID *string, name, email string, phone *string, guestsCount *int, occasion, message *string) (*Reservation, error) {
	var res Reservation
	err := r.db.QueryRowContext(ctx,
		`INSERT INTO reservations (window_id, name, email, phone, guests_count, occasion, message)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)
		 RETURNING id, window_id, name, email, phone, guests_count, occasion, message, status, created_at, updated_at`,
		windowID, name, email, phone, guestsCount, occasion, message,
	).Scan(&res.ID, &res.WindowID, &res.Name, &res.Email, &res.Phone,
		&res.GuestsCount, &res.Occasion, &res.Message, &res.Status, &res.CreatedAt, &res.UpdatedAt)
	return &res, err
}

// ListReservations returns all reservations, optionally filtered by status, for admin.
func (r *ReservationRepository) ListReservations(ctx context.Context, status string) ([]Reservation, error) {
	query := `
		SELECT r.id, r.window_id, r.name, r.email, r.phone, r.guests_count,
		       r.occasion, r.message, r.status, r.created_at, r.updated_at,
		       w.date
		FROM reservations r
		LEFT JOIN availability_windows w ON r.window_id = w.id`
	args := []interface{}{}
	if status != "" {
		query += ` WHERE r.status = $1`
		args = append(args, status)
	}
	query += ` ORDER BY r.created_at DESC`

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reservations []Reservation
	for rows.Next() {
		var res Reservation
		if err := rows.Scan(&res.ID, &res.WindowID, &res.Name, &res.Email, &res.Phone,
			&res.GuestsCount, &res.Occasion, &res.Message, &res.Status,
			&res.CreatedAt, &res.UpdatedAt, &res.WindowDate); err != nil {
			return nil, err
		}
		reservations = append(reservations, res)
	}
	return reservations, rows.Err()
}

// UpdateReservationStatus updates the status of a reservation (confirm/decline/cancel).
func (r *ReservationRepository) UpdateReservationStatus(ctx context.Context, id, status string) (*Reservation, error) {
	var res Reservation
	err := r.db.QueryRowContext(ctx,
		`UPDATE reservations SET status=$2, updated_at=NOW() WHERE id=$1
		 RETURNING id, window_id, name, email, phone, guests_count, occasion, message, status, created_at, updated_at`,
		id, status,
	).Scan(&res.ID, &res.WindowID, &res.Name, &res.Email, &res.Phone,
		&res.GuestsCount, &res.Occasion, &res.Message, &res.Status, &res.CreatedAt, &res.UpdatedAt)
	return &res, err
}

package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// HerbariumSpecimen represents an ingredient in the Herbarium collection.
type HerbariumSpecimen struct {
	ID           string          `json:"id"`
	Num          string          `json:"num"`
	Code         string          `json:"code"`
	Category     *string         `json:"category"`
	NameRo       string          `json:"name_ro"`
	NameEn       *string         `json:"name_en"`
	LatinName    *string         `json:"latin_name"`
	NameLarge    *string         `json:"name_large"`
	Badge        *string         `json:"badge"`
	BadgeCls     string          `json:"badge_cls"`
	Meta         json.RawMessage `json:"meta"`
	Spectrum     json.RawMessage `json:"spectrum"`
	Pills        json.RawMessage `json:"pills"`
	DescRo       *string         `json:"desc_ro"`
	DescEn       *string         `json:"desc_en"`
	NoteRo       *string         `json:"note_ro"`
	NoteEn       *string         `json:"note_en"`
	UsageList    json.RawMessage `json:"usage_list"`
	DisplayOrder int             `json:"display_order"`
	CreatedAt    time.Time       `json:"created_at"`
	UpdatedAt    time.Time       `json:"updated_at"`
}

// HerbariumRepository handles database operations for herbarium specimens.
type HerbariumRepository struct {
	db *sql.DB
}

// NewHerbariumRepository creates a new HerbariumRepository.
func NewHerbariumRepository(db *sql.DB) *HerbariumRepository {
	return &HerbariumRepository{db: db}
}

const herbariumSelectCols = `id, num, code, category, name_ro, name_en, latin_name, name_large, badge, badge_cls,
	meta, spectrum, pills, desc_ro, desc_en, note_ro, note_en, usage_list, display_order, created_at, updated_at`

func scanSpecimen(row interface{ Scan(...any) error }) (*HerbariumSpecimen, error) {
	var s HerbariumSpecimen
	var meta, spectrum, pills, usage []byte
	err := row.Scan(
		&s.ID, &s.Num, &s.Code, &s.Category, &s.NameRo, &s.NameEn, &s.LatinName, &s.NameLarge,
		&s.Badge, &s.BadgeCls, &meta, &spectrum, &pills, &s.DescRo, &s.DescEn,
		&s.NoteRo, &s.NoteEn, &usage, &s.DisplayOrder, &s.CreatedAt, &s.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	s.Meta = json.RawMessage(meta)
	s.Spectrum = json.RawMessage(spectrum)
	s.Pills = json.RawMessage(pills)
	s.UsageList = json.RawMessage(usage)
	return &s, nil
}

// ListSpecimens returns all specimens ordered by display_order.
func (r *HerbariumRepository) ListSpecimens(ctx context.Context) ([]HerbariumSpecimen, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT `+herbariumSelectCols+` FROM herbarium_specimens ORDER BY display_order ASC, created_at ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []HerbariumSpecimen
	for rows.Next() {
		s, err := scanSpecimen(rows)
		if err != nil {
			return nil, err
		}
		items = append(items, *s)
	}
	return items, rows.Err()
}

// GetSpecimenByID returns a single specimen.
func (r *HerbariumRepository) GetSpecimenByID(ctx context.Context, id string) (*HerbariumSpecimen, error) {
	row := r.db.QueryRowContext(ctx,
		`SELECT `+herbariumSelectCols+` FROM herbarium_specimens WHERE id=$1`, id)
	s, err := scanSpecimen(row)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return s, err
}

// CreateSpecimenInput holds fields for creating a specimen.
type CreateSpecimenInput struct {
	Num          string
	Code         string
	Category     *string
	NameRo       string
	NameEn       *string
	LatinName    *string
	NameLarge    *string
	Badge        *string
	BadgeCls     string
	Meta         json.RawMessage
	Spectrum     json.RawMessage
	Pills        json.RawMessage
	DescRo       *string
	DescEn       *string
	NoteRo       *string
	NoteEn       *string
	UsageList    json.RawMessage
	DisplayOrder int
}

// CreateSpecimen inserts a new herbarium specimen.
func (r *HerbariumRepository) CreateSpecimen(ctx context.Context, in CreateSpecimenInput) (*HerbariumSpecimen, error) {
	id := uuid.New().String()
	meta := jsonOrEmpty(in.Meta)
	spectrum := jsonOrEmpty(in.Spectrum)
	pills := jsonOrEmpty(in.Pills)
	usage := jsonOrEmpty(in.UsageList)

	row := r.db.QueryRowContext(ctx,
		`INSERT INTO herbarium_specimens
		 (id, num, code, category, name_ro, name_en, latin_name, name_large, badge, badge_cls,
		  meta, spectrum, pills, desc_ro, desc_en, note_ro, note_en, usage_list, display_order)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
		 RETURNING `+herbariumSelectCols,
		id, in.Num, in.Code, in.Category, in.NameRo, in.NameEn, in.LatinName, in.NameLarge,
		in.Badge, in.BadgeCls, meta, spectrum, pills, in.DescRo, in.DescEn,
		in.NoteRo, in.NoteEn, usage, in.DisplayOrder)
	return scanSpecimen(row)
}

// UpdateSpecimen updates an existing herbarium specimen.
func (r *HerbariumRepository) UpdateSpecimen(ctx context.Context, id string, in CreateSpecimenInput) (*HerbariumSpecimen, error) {
	meta := jsonOrEmpty(in.Meta)
	spectrum := jsonOrEmpty(in.Spectrum)
	pills := jsonOrEmpty(in.Pills)
	usage := jsonOrEmpty(in.UsageList)

	row := r.db.QueryRowContext(ctx,
		`UPDATE herbarium_specimens SET
		 num=$2, code=$3, category=$4, name_ro=$5, name_en=$6, latin_name=$7, name_large=$8,
		 badge=$9, badge_cls=$10, meta=$11, spectrum=$12, pills=$13, desc_ro=$14, desc_en=$15,
		 note_ro=$16, note_en=$17, usage_list=$18, display_order=$19, updated_at=NOW()
		 WHERE id=$1
		 RETURNING `+herbariumSelectCols,
		id, in.Num, in.Code, in.Category, in.NameRo, in.NameEn, in.LatinName, in.NameLarge,
		in.Badge, in.BadgeCls, meta, spectrum, pills, in.DescRo, in.DescEn,
		in.NoteRo, in.NoteEn, usage, in.DisplayOrder)
	s, err := scanSpecimen(row)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return s, err
}

// DeleteSpecimen deletes a specimen by ID.
func (r *HerbariumRepository) DeleteSpecimen(ctx context.Context, id string) (bool, error) {
	res, err := r.db.ExecContext(ctx, `DELETE FROM herbarium_specimens WHERE id=$1`, id)
	if err != nil {
		return false, err
	}
	n, _ := res.RowsAffected()
	return n > 0, nil
}

func jsonOrEmpty(raw json.RawMessage) json.RawMessage {
	if raw == nil {
		return json.RawMessage("[]")
	}
	return raw
}

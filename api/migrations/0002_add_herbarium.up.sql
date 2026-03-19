CREATE TABLE IF NOT EXISTS herbarium_specimens (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    num           TEXT NOT NULL,
    code          TEXT NOT NULL UNIQUE,
    category      TEXT,
    name_ro       TEXT NOT NULL,
    name_en       TEXT,
    latin_name    TEXT,
    name_large    TEXT,
    badge         TEXT,
    badge_cls     TEXT NOT NULL DEFAULT '',
    meta          JSONB NOT NULL DEFAULT '[]',
    spectrum      JSONB NOT NULL DEFAULT '[]',
    pills         JSONB NOT NULL DEFAULT '[]',
    desc_ro       TEXT,
    desc_en       TEXT,
    note_ro       TEXT,
    note_en       TEXT,
    usage_list    JSONB NOT NULL DEFAULT '[]',
    display_order INT NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_herbarium_display_order ON herbarium_specimens(display_order);

ALTER TABLE contact_requests
    ADD COLUMN IF NOT EXISTS occasion TEXT;

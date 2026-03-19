CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS dishes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT NOT NULL,
    description TEXT,
    category    TEXT,
    image_url   TEXT,
    featured    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recipes (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dish_id       UUID REFERENCES dishes(id) ON DELETE CASCADE,
    title         TEXT NOT NULL,
    description   TEXT,
    ingredients   JSONB NOT NULL DEFAULT '[]',
    steps         JSONB NOT NULL DEFAULT '[]',
    prep_time_min INT,
    cook_time_min INT,
    servings      INT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url     TEXT NOT NULL,
    caption       TEXT,
    category      TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_requests (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name         TEXT NOT NULL,
    email        TEXT NOT NULL,
    message      TEXT,
    event_date   DATE,
    guests_count INT,
    status       TEXT NOT NULL DEFAULT 'new',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dishes_category ON dishes(category);
CREATE INDEX IF NOT EXISTS idx_dishes_featured ON dishes(featured);
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_gallery_items_display_order ON gallery_items(display_order);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);

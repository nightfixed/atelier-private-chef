-- Availability windows defined by the chef
CREATE TABLE availability_windows (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date        DATE        NOT NULL,
    start_time  TIME,
    end_time    TIME,
    max_guests  INTEGER     NOT NULL DEFAULT 20,
    notes       TEXT,
    is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (date)
);

-- Guest reservation requests
CREATE TABLE reservations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    window_id   UUID REFERENCES availability_windows(id) ON DELETE SET NULL,
    name        TEXT        NOT NULL,
    email       TEXT        NOT NULL,
    phone       TEXT,
    guests_count INTEGER,
    occasion    TEXT,
    message     TEXT,
    status      TEXT        NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','confirmed','declined','cancelled')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reservations_window_id ON reservations(window_id);
CREATE INDEX idx_reservations_status    ON reservations(status);
CREATE INDEX idx_availability_date      ON availability_windows(date);

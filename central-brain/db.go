package main

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"central-brain/models"

	_ "modernc.org/sqlite" // pure Go SQLite driver
)

// Database wraps SQL access for detection logs.
type Database struct {
	conn *sql.DB
}

// NewDatabase opens (or creates) SQLite database and runs migrations.
func NewDatabase(dsn string) (*Database, error) {
	if dsn == "" {
		// WAL mode for better concurrent reads; normal sync for speed.
		dsn = "file:railguard.db?_pragma=journal_mode(WAL)&_pragma=synchronous(NORMAL)"
	}

	db, err := sql.Open("sqlite", dsn)
	if err != nil {
		return nil, fmt.Errorf("open db: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("ping db: %w", err)
	}

	if err := migrate(db); err != nil {
		return nil, fmt.Errorf("migrate: %w", err)
	}

	return &Database{conn: db}, nil
}

func migrate(db *sql.DB) error {
	const ddl = `
CREATE TABLE IF NOT EXISTS detection_logs (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	type TEXT,
	object_class TEXT,
	confidence REAL,
	in_roi BOOLEAN,
	object_id INTEGER,
	duration_seconds REAL,
	timestamp DATETIME,
	camera_id TEXT,
	detail TEXT,
	image_url TEXT
);
`
	_, err := db.Exec(ddl)
	return err
}

// InsertDetection stores detection payload into DB.
func (d *Database) InsertDetection(ctx context.Context, payload models.DetectionPayload) error {
	if d == nil || d.conn == nil {
		return nil
	}

	if payload.Timestamp.IsZero() {
		payload.Timestamp = time.Now().UTC()
	}

	_, err := d.conn.ExecContext(
		ctx,
		`INSERT INTO detection_logs
		(type, object_class, confidence, in_roi, object_id, duration_seconds, timestamp, camera_id, detail, image_url)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		payload.Type,
		payload.ObjectClass,
		payload.Confidence,
		payload.InROI,
		payload.ObjectID,
		payload.DurationSeconds,
		payload.Timestamp,
		payload.CameraID,
		payload.AdditionalDetail,
		payload.ImageURL,
	)
	return err
}

// ListDetections returns latest detections ordered by timestamp desc.
func (d *Database) ListDetections(ctx context.Context, limit int) ([]models.DetectionPayload, error) {
	if d == nil || d.conn == nil {
		return nil, nil
	}
	if limit <= 0 || limit > 500 {
		limit = 100
	}

	rows, err := d.conn.QueryContext(
		ctx,
		`SELECT type, object_class, confidence, in_roi, object_id, duration_seconds, timestamp, camera_id, detail, image_url
		FROM detection_logs
		ORDER BY timestamp DESC
		LIMIT ?`, limit,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []models.DetectionPayload
	for rows.Next() {
		var p models.DetectionPayload
		var ts time.Time
		if err := rows.Scan(
			&p.Type,
			&p.ObjectClass,
			&p.Confidence,
			&p.InROI,
			&p.ObjectID,
			&p.DurationSeconds,
			&ts,
			&p.CameraID,
			&p.AdditionalDetail,
			&p.ImageURL,
		); err != nil {
			return nil, err
		}
		p.Timestamp = ts
		out = append(out, p)
	}
	return out, rows.Err()
}



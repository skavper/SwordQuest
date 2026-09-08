import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { digest, HttpError } from './core.mjs';

/** A persistent outbox for ONE process/replica on a persistent local volume. */
export class Store {
  constructor(path, maxQueue = 10000) {
    if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
    this.db = new DatabaseSync(path, { timeout: 1000 });
    this.maxQueue = maxQueue;
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY, fingerprint TEXT NOT NULL, payload TEXT NOT NULL,
        channel TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('queued','sent','failed','ignored')),
        attempts INTEGER NOT NULL DEFAULT 0, next_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL,
        message_id TEXT, error TEXT
      );
      CREATE INDEX IF NOT EXISTS events_due ON events(status, next_at);
      CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value INTEGER NOT NULL);`);
  }
  get(id) { return this.db.prepare('SELECT * FROM events WHERE id=?').get(id); }
  accept(event, channel, notify, now = Date.now()) {
    const payload = JSON.stringify(event);
    // Keep the first timestamp; calling the same award hook again must not make a new event.
    const fingerprint = digest(JSON.stringify({ ...event, timestamp: 0 }));
    const existing = this.get(event.eventId);
    if (existing) {
      if (existing.fingerprint !== fingerprint) throw new HttpError(409, 'eventId already belongs to a different event');
      return { duplicate: true, eventId: existing.id, status: existing.status };
    }
    if (notify && this.db.prepare("SELECT count(*) AS n FROM events WHERE status='queued'").get().n >= this.maxQueue) {
      throw new HttpError(503, 'Notification queue is full; retry this eventId later');
    }
    const status = notify ? 'queued' : 'ignored';
    this.db.prepare('INSERT INTO events(id,fingerprint,payload,channel,status,next_at,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)')
      .run(event.eventId, fingerprint, payload, channel, status, now, now, now);
    return { duplicate: false, eventId: event.eventId, status };
  }
  due(now = Date.now()) {
    return this.db.prepare("SELECT * FROM events WHERE status='queued' AND next_at<=? ORDER BY next_at,created_at LIMIT 1").get(now);
  }
  sent(id, messageId, now = Date.now()) {
    this.db.prepare("UPDATE events SET status='sent',message_id=?,updated_at=?,error=NULL WHERE id=?").run(messageId, now, id);
  }
  retry(id, nextAt, error, increment = true, now = Date.now()) {
    this.db.prepare('UPDATE events SET next_at=?,error=?,attempts=attempts+?,updated_at=? WHERE id=?')
      .run(nextAt, error, increment ? 1 : 0, now, id);
  }
  failed(id, error, now = Date.now()) {
    this.db.prepare("UPDATE events SET status='failed',error=?,attempts=attempts+1,updated_at=? WHERE id=?").run(error, now, id);
  }
  pauseUntil() { return this.db.prepare("SELECT value FROM settings WHERE key='pause_until'").get()?.value ?? 0; }
  pause(until) {
    this.db.prepare("INSERT INTO settings(key,value) VALUES('pause_until',?) ON CONFLICT(key) DO UPDATE SET value=max(value,excluded.value)").run(until);
  }
  stats() {
    const counts = { queued: 0, sent: 0, failed: 0, ignored: 0 };
    for (const row of this.db.prepare('SELECT status,count(*) AS n FROM events GROUP BY status').all()) counts[row.status] = row.n;
    return { ...counts, deliveryPausedUntil: this.pauseUntil() };
  }
  prune(now = Date.now()) {
    // Pending events are never expired. Terminal records have a 7-day retention window.
    this.db.prepare("DELETE FROM events WHERE status!='queued' AND updated_at<?").run(now - 7 * 86400000);
  }
  close() { this.db.close(); }
}

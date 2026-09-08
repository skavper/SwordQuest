import { Store } from '../src/store.mjs';
import { isEventId } from '../src/core.mjs';

const id = process.argv[2]?.toLowerCase();
if (!isEventId(id)) {
  console.error('Usage: node --env-file-if-exists=.env scripts/retry-event.mjs EVENT_UUID');
  process.exitCode = 1;
} else {
  const store = new Store(process.env.DATABASE_PATH || './data/notifications.sqlite');
  try {
    const row = store.get(id);
    if (!row || row.status !== 'failed') throw new Error('Only existing failed events may be requeued');
    // Deliberately retain the event ID, payload and any active Discord rate-limit pause.
    store.db.prepare("UPDATE events SET status='queued',attempts=0,error=NULL,next_at=?,updated_at=? WHERE id=? AND status='failed'")
      .run(Date.now(), Date.now(), id);
    console.log(`Requeued ${id}. Any active delivery pause will still be honoured.`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
  finally { store.close(); }
}

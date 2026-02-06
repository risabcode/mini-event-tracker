import React from 'react';
import { Link } from 'react-router-dom';

export default function EventCard({ event }) {
  const dt = new Date(event.dateTime || Date.now());
  const date = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dt);
  const time = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
  }).format(dt);

  return (
    <div className="card shadow-sm flex-fill d-flex flex-column">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title" id={`ev-${event.id}-title`}>{event.title}</h5>
        {event.location && <p className="card-subtitle mb-2 text-muted">{event.location}</p>}

        {/* Limit description height so cards are uniform */}
        {event.description && (
          <p className="card-text text-truncate" style={{ maxHeight: '3.6em', overflow: 'hidden' }}>
            {event.description}
          </p>
        )}

        <div className="mt-auto text-muted text-end">
          <div className="fw-medium">{date}</div>
          <div className="small">{time}</div>
        </div>
      </div>

      <div className="card-footer d-flex justify-content-between align-items-center">
        <Link to={`/events/${event.id}`} className="text-primary text-decoration-none">
          View details
        </Link>
        {event.publicId ? (
          <Link to={`/public/${event.publicId}`} className="text-success fw-semibold">
            Public link →
          </Link>
        ) : (
          <span className="text-secondary small">Private</span>
        )}
      </div>
    </div>
  );
}

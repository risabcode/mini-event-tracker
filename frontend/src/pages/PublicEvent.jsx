import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function PublicEvent() {
  const { publicId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/events/public/${encodeURIComponent(publicId)}`
        );
        if (!mounted) return;
        setEvent(res.data);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setError(
          err.response?.status === 404
            ? 'Event not found'
            : err.response?.data?.message || err.message || 'Failed to load'
        );
        setEvent(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [publicId]);

  if (loading)
    return (
      <div className="container pt-5 mt-5 text-center text-secondary">
        Loading event…
      </div>
    );

  if (error)
    return (
      <div className="container pt-5 mt-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/public" className="btn btn-outline-secondary">
          ← Back to public events
        </Link>
      </div>
    );

  if (!event) return null;

  const dtText = event.dateTime ? new Date(event.dateTime).toLocaleString() : 'Date TBA';

  return (
    <div className="container pt-5 mt-5">
      <Link to="/public" className="btn btn-outline-secondary mb-4">
        ← Back to public events
      </Link>

      <div className="card shadow-sm rounded-4">
        <div className="card-body">
          <h1 className="card-title mb-3">{event.title}</h1>
          <p className="text-muted mb-4">
            {dtText}
            {event.location ? ` — ${event.location}` : ''}
          </p>

          {event.description && (
            <section className="mb-4">
              <h6 className="text-uppercase text-muted mb-2">Description</h6>
              <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                {event.description}
              </p>
            </section>
          )}

          {event.organizer && (
            <p className="mb-3">
              <strong>Organizer:</strong> {event.organizer}
            </p>
          )}

          {event.url && (
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Event link
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

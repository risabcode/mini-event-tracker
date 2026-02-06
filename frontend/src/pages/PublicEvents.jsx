import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

/**
 * Lists all public events
 */
export default function PublicEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await axios.get('http://localhost:4000/api/events/public');
        if (!mounted) return;
        setEvents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        if (mounted)
          setError(
            err.response?.data?.message || err.message || 'Failed to fetch public events'
          );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="pt-5 pt-lg-6 mt-4 container" >
      <header className="mb-5 text-center text-lg-start">
        <h1 className="display-5 fw-bold">Public Events</h1>
        <p className="text-muted fs-5">
          These events are public — no login required to view them.
        </p>
      </header>

      {loading && <div className="text-center text-secondary py-5">Loading public events…</div>}
      {error && <div className="alert alert-danger">Error loading events: {error}</div>}
      {!loading && events.length === 0 && !error && (
        <div className="text-center text-secondary py-5">No public events found.</div>
      )}

      <div className="row g-4">
        {events.map((ev) => {
          const publicId = ev.publicId || ev.public_id || null;
          const key = publicId || ev.id || ev._id;
          const dtText = ev.dateTime
            ? new Date(ev.dateTime).toLocaleString()
            : 'Date TBA';

          if (!publicId) {
            return (
              <div key={key} className="col-12 col-sm-6 col-lg-4 d-flex">
                <div className="card flex-fill border-warning bg-warning bg-opacity-25 rounded-4 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{ev.title}</h5>
                    <p className="text-muted mb-2">
                      {dtText}
                      {ev.location ? ` — ${ev.location}` : ''}
                    </p>
                    {ev.description && (
                      <p
                        className="card-text text-truncate"
                        style={{ maxHeight: '3.6em', overflow: 'hidden' }}
                      >
                        {ev.description}
                      </p>
                    )}
                    <div className="mt-auto text-end text-muted small">Not shared</div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={key} className="col-12 col-sm-6 col-lg-4 d-flex">
              <Link
                to={`/public/${publicId}`}
                className="card flex-fill text-decoration-none text-dark h-100 rounded-4 shadow-sm"
              >
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{ev.title}</h5>
                  <p className="text-muted mb-2">
                    {dtText}
                    {ev.location ? ` — ${ev.location}` : ''}
                  </p>
                  {ev.description && (
                    <p
                      className="card-text text-truncate"
                      style={{ maxHeight: '3.6em', overflow: 'hidden' }}
                    >
                      {ev.description}
                    </p>
                  )}
                  <div className="mt-auto text-end text-primary fw-medium">View →</div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Smooth card hover effect */}
      <style jsx>{`
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        @media (max-width: 576px) {
          .card {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

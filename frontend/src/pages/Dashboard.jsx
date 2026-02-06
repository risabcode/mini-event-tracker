import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  async function fetchEvents(f) {
    try {
      setLoading(true);
      const res = await api.get(`/events?filter=${f}`);
      setEvents(res.data || []);
    } catch (err) {
      console.error(err);
      alert('Error fetching events');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents(filter);
  }, [filter]);

  return (
    <main className="container py-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mt-4 mb-5 gap-4">
        <div>
          <h1 className="display-5 fw-bold">My Events</h1>
          <p className="text-muted fs-5">Organize and track your upcoming and past events</p>
        </div>

        {/* Right controls */}
        <div className="d-flex flex-column flex-sm-row gap-3 align-items-stretch">
          <Link
            to="/create"
            className="btn btn-success fw-semibold shadow-sm"
            style={{ borderRadius: '10px', padding: '0.5rem 1.25rem' }}
          >
            + Create Event
          </Link>

          {/* Filter buttons */}
          <div className="btn-group shadow-sm" role="group">
            <button
              type="button"
              className={`btn ${filter === 'upcoming' ? 'btn-primary' : 'btn-outline-primary'} fw-semibold`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              type="button"
              className={`btn ${filter === 'past' ? 'btn-primary' : 'btn-outline-primary'} fw-semibold`}
              onClick={() => setFilter('past')}
            >
              Past
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="row g-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="col-12 col-md-6 col-lg-4 d-flex" key={i}>
              <div className="card p-4 flex-fill shadow-sm border-0 rounded-4 placeholder-glow">
                <div className="placeholder col-6 mb-3 rounded"></div>
                <div className="placeholder col-4 mb-2 rounded"></div>
                <div className="placeholder col-12 mb-3 rounded"></div>
                <div className="placeholder col-12" style={{ height: '50px', borderRadius: '10px' }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-5">
          <h3 className="fw-bold mb-3">No events found</h3>
          <p className="text-muted fs-5 mb-4">Create your first event to get started.</p>
          <Link
            to="/create"
            className="btn btn-primary fw-semibold shadow"
            style={{ padding: '0.5rem 1.25rem', borderRadius: '10px' }}
          >
            + Create Event
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {events.map(ev => (
            <div className="col-12 col-md-6 col-lg-4 d-flex" key={ev.id}>
              <div className="card flex-fill shadow-sm rounded-4 p-3 hover-scale transition">
                <h5 className="fw-bold">{ev.title}</h5>
                <p className="text-muted mb-2">{new Date(ev.dateTime).toLocaleString()}</p>
                <p className="text-muted mb-3">{ev.location || 'No location provided'}</p>

                {/* Single button to view full details */}
                <button
                  className="btn btn-primary w-100 fw-semibold"
                  onClick={() => setSelectedEvent(ev)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal / Detail view */}
      {selectedEvent && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white p-4 rounded shadow position-relative"
            style={{ maxWidth: '500px', width: '90%' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Top-right close button */}
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-3"
              aria-label="Close"
              onClick={() => setSelectedEvent(null)}
            ></button>

            <h3 className="fw-bold mb-3">{selectedEvent.title}</h3>
            <p><strong>Date & Time:</strong> {new Date(selectedEvent.dateTime).toLocaleString()}</p>
            <p><strong>Location:</strong> {selectedEvent.location || 'No location provided'}</p>
            <p><strong>Description:</strong> {selectedEvent.description || 'No description provided'}</p>
            {selectedEvent.sharePublic && (
              <p>
                <strong>Public Link:</strong>{' '}
                <a href={selectedEvent.publicLink || '#'} target="_blank" rel="noreferrer">
                  View Event
                </a>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Smooth hover effect */}
      <style jsx>{`
        .hover-scale {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-scale:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 15px 25px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </main>
  );
}

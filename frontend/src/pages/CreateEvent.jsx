import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function CreateEvent() {
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [sharePublic, setSharePublic] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post('/events', { title, dateTime, location, description, sharePublic });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create event');
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
    >
      <div className="bg-white p-4 p-md-5 rounded shadow" style={{ width: '100%', maxWidth: '500px' }}>
        {/* Back Button */}
        <div className="mb-3">
          <Link to="/" className="btn btn-outline-secondary btn-sm">
            &larr; Back to Dashboard
          </Link>
        </div>

        <h2 className="mb-4 text-center">Create Event</h2>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            className="form-control"
            value={dateTime}
            onChange={e => setDateTime(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control"
            placeholder="Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <textarea
            className="form-control"
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
          />
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="sharePublic"
              checked={sharePublic}
              onChange={e => setSharePublic(e.target.checked)}
            />
            <label htmlFor="sharePublic" className="form-check-label">
              Generate a public share link
            </label>
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-semibold">
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

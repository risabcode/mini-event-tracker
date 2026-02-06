import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setCreating(true);
      await api.post('/auth/signup', { email, password });
      await api.post('/auth/login', { email, password });
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
      console.error(err);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 px-3">
      <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="card-title mb-2 text-center">Create your account</h2>
        <p className="text-center text-muted mb-4">
          A few seconds to set up — and you'll be ready to create events.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Choose a strong password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 mb-3"
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Create account'}
          </button>
        </form>

        <div className="text-center text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-decoration-none fw-semibold">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

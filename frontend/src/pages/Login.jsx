import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useUser } from '../context/UserContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return alert('Email and password are required');

    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data);
      navigate('/');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Login failed';
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 px-2 px-md-3">
      <div
        className="card shadow-lg p-4 rounded-4 w-100"
        style={{
          maxWidth: '400px',
          width: '100%',
          minWidth: '280px',
        }}
      >
        {/* Heading */}
        <h2 className="card-title mb-2 text-center fs-4 fs-md-3">Welcome back</h2>
        <p className="text-center text-muted mb-4 fs-6 fs-md-5">
          Login to manage your events
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label small">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label small">
              Password
            </label>
            <div className="position-relative">
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '4rem' }} // space for Show/Hide button
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="btn btn-outline-secondary position-absolute"
                style={{
                  top: '50%',
                  right: '0.5rem',
                  transform: 'translateY(-50%)',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.85rem',
                  zIndex: 2,
                }}
                aria-label="Toggle password visibility"
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 mb-3 py-2"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        {/* Signup Link */}
        <div className="text-center text-muted small">
          Don't have an account?{' '}
          <Link to="/signup" className="text-decoration-none fw-semibold">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

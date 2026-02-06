import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLogout } from '../hooks/useLogout';

export default function Nav() {
  const { user } = useUser();
  const logout = useLogout();

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  }

  if (user === undefined) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top py-3">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand text-primary fw-bold fs-4" to="/">
          Mini Event Tracker
        </Link>

        {/* Hamburger */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {/* Public Events */}
            {!user && (
              <li className="nav-item">
                <Link
                  className="nav-link text-primary position-relative px-3"
                  to="/public"
                >
                  Public Events
                  <span className="nav-underline"></span>
                </Link>
              </li>
            )}

            {user ? (
              <>
                {/* User greeting */}
                <li className="nav-item my-1 my-lg-0">
                  <span className="nav-link text-secondary px-3">
                    Hi, {user.email}
                  </span>
                </li>

                {/* Logout button */}
                <li className="nav-item my-1 my-lg-0 mx-lg-1">
                  <button
                    className="btn btn-outline-danger btn-sm px-3 py-1 fw-semibold"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Login */}
                <li className="nav-item my-1 my-lg-0 mx-lg-1">
                  <Link
                    className="nav-link px-3 position-relative"
                    to="/login"
                  >
                    Login
                    <span className="nav-underline"></span>
                  </Link>
                </li>

                {/* Signup */}
                <li className="nav-item my-1 my-lg-0 mx-lg-1">
                  <Link
                    className="nav-link px-3 position-relative"
                    to="/signup"
                  >
                    Signup
                    <span className="nav-underline"></span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Animated underline effect */}
      <style jsx>{`
        .nav-link {
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          color: #0d6efd !important;
        }

        .nav-underline {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #0d6efd;
          transition: width 0.3s ease;
        }

        .nav-link:hover .nav-underline {
          width: 100%;
        }

        .navbar-toggler {
          transition: transform 0.3s ease;
        }

        .navbar-toggler:focus {
          outline: none;
          box-shadow: none;
        }
      `}</style>
    </nav>
  );
}

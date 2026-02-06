import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function PublicOnlyRoute({ children, redirectTo = '/' }) {
  const { user } = useUser();

  // still loading user — show spinner to avoid flicker
  if (user === undefined) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '40vh' }}>
        <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
      </div>
    );
  }

  // if user exists, redirect to dashboard (or provided redirect)
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  // not logged in -> render the public (auth) page
  return children;
}

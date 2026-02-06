import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function ProtectedRoute({ children }) {
  const { user } = useUser();
  const location = useLocation();

  // still loading user
  if (user === undefined) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '40vh' }}>
        <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
      </div>
    );
  }

  // not logged in -> redirect to login and keep where they wanted to go
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // logged in -> render children
  return children;
}

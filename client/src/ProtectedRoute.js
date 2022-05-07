import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  if (!localStorage.getItem('token')) {
    return <Navigate to='/signup' replace />;
  }

  return children;
}

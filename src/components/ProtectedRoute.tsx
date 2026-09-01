import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CabaiLoadingScreen } from './CabaiLoadingScreen';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, isAuthLoading } = useApp();
  const location = useLocation();

  if (isAuthLoading) {
    return <CabaiLoadingScreen />;
  }

  if (!currentUser) {
    const redirectParam = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectParam}`} replace />;
  }

  return <>{children}</>;
};

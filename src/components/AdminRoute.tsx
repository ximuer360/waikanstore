import React from 'react';
import { Navigate } from 'react-router-dom';

const isAdmin = () => {
  const adminKey = localStorage.getItem('adminKey');
  const envKey = process.env.REACT_APP_ADMIN_KEY;
  console.log('Checking admin access:', { adminKey, envKey });
  return adminKey === envKey;
};

interface AdminRouteProps {
  element: React.ReactElement;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ element }) => {
  if (!isAdmin()) {
    return <Navigate to="/admin/login" replace />;
  }
  return element;
};

export default AdminRoute; 
import React from 'react';
import { Navigate } from 'react-router-dom';

// 简单的管理员验证
const isAdmin = () => {
  const adminKey = localStorage.getItem('adminKey');
  return adminKey === process.env.REACT_APP_ADMIN_KEY;
};

interface AdminRouteProps {
  element: React.ReactElement;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ element }) => {
  return isAdmin() ? element : <Navigate to="/" replace />;
};

export default AdminRoute; 
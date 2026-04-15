import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AppShellLayout from './AppShellLayout';
 
export default function ProtectedRoute() {
  const { token } = useContext(AuthContext);
 
  // if no token, redirect to login
  if (!token) return <Navigate to='/login' replace />;
 
  // otherwise render the app shell with the page inside
  return <AppShellLayout />;
}
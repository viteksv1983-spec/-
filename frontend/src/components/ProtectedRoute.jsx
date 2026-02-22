import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-antreme-red"></div>
            </div>
        );
    }

    if (!user) {
        console.log("Not authenticated, redirecting to login from", window.location.pathname);
        return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

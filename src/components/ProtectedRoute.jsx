import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserFromLocalStorage } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
    const user = getUserFromLocalStorage();
    if (!user || !user.token) {
        return <Navigate to="/" />;
    }
    return children;
};

export default ProtectedRoute;
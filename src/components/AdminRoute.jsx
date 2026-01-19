import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../services/authService';

function AdminRoute({ children }){
    if(!isAuthenticated()){
        return <Navigate to="/auth" />;
    }
    const role=getUserRole();
    return role ==='ADMIN' ? children : <Navigate to="/quotes" />;
}

export default AdminRoute;
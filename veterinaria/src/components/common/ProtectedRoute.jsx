import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ element, allowedRoles, userRole }) {
    if (!userRole) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/inicio" replace />;
    }

    return element;
}
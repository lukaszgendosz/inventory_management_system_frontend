import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Role } from "../models/user";
import { Spin } from "antd";

interface RequireAuthProps {
    allowedRoles: Role[];
}

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
    const { auth } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    if (!auth?.is_loaded) {
        return <Spin />;
    }

    if (!auth?.current_user?.role) {
        sessionStorage.setItem('lastAttemptedPath', location.pathname);
        navigate('/login');
        return null;
    }

    if (!allowedRoles?.includes(auth?.current_user?.role as Role)) {
        navigate(-1);
        return null;
    }

    return <Outlet />;
};

export default RequireAuth;

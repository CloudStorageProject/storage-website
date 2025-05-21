
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

const PrivateRoute = () => {
    const auth = useAuth();
    if (localStorage.getItem("token") === null || auth.user === null || auth.user.username === null) {
        return <Navigate to="/login" />;
    }
    return <Outlet />;
};

export default PrivateRoute;
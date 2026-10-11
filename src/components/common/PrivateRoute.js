import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const PrivateRoute = ({ children }) => {
    const { currentUser } = useAuth();
    const location = useLocation();

    if (!currentUser) {
        return (
            <Navigate
                to="/auth/sign-in"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return children ? children : <Outlet />;
};

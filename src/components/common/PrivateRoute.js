import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";


export const PrivateRoute = ({ children }) => {
    const { userLoggedIn } = useAuth()

    if (!userLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
};

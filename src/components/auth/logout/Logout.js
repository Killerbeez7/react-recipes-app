import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { PageLoader } from "../../ui/Loader";

export const Logout = () => {
    const navigate = useNavigate();
    const { handleSignOut } = useAuth();

    useEffect(() => {
        handleSignOut().finally(() => navigate("/", { replace: true }));
        // Sign out once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <PageLoader label="Signing out..." />;
};

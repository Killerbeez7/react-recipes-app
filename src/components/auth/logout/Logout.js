import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export const Logout = () => {
    const navigate = useNavigate();
    const { currentUser, handleSignOut } = useAuth();

    useEffect(() => {
        if (currentUser) {
            handleSignOut();
        }
        navigate("/");
    }, [currentUser, navigate, handleSignOut]);

    return null;
};
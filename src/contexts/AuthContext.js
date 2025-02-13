import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    logout,
} from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user ? { ...user } : null);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleEmailSignUp = async (email, password) => {
        try {
            const user = await signUpWithEmail(email, password);

            setCurrentUser(user);
        } catch (error) {
            throw error;
        }
    };

    const handleEmailSignIn = async (email, password) => {
        try {
            const user = await signInWithEmail(email, password);

            setCurrentUser(user);
        } catch (error) {
            throw error;
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithGoogle();

            setCurrentUser(result.user);
        } catch (error) {
            throw error;
        }
    };

    const handleSignOut = async () => {
        await logout();
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        handleEmailSignUp,
        handleEmailSignIn,
        handleGoogleSignIn,
        handleSignOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

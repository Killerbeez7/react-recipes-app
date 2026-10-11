import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, database } from "../firebase/firebaseConfig";
import { PageLoader } from "../components/ui/Loader";
import {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    logout,
} from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    // Profile record stored in the realtime DB (username, bio, savedRecipes...)
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user ? { ...user } : null);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const uid = currentUser?.uid;

    useEffect(() => {
        if (!uid) {
            setUserProfile(null);
            return;
        }

        return onValue(ref(database, `users/${uid}`), (snapshot) => {
            setUserProfile(snapshot.val());
        });
    }, [uid]);

    // Firebase doesn't emit an auth change after updateProfile(), so callers
    // use this to pick up a new displayName / photoURL.
    const refreshUser = () => {
        setCurrentUser(auth.currentUser ? { ...auth.currentUser } : null);
    };

    const handleEmailSignUp = async (email, password, username) => {
        const user = await signUpWithEmail(email, password, username);
        setCurrentUser({ ...user });
    };

    const handleEmailSignIn = async (email, password) => {
        const user = await signInWithEmail(email, password);
        setCurrentUser({ ...user });
    };

    const handleGoogleSignIn = async () => {
        const user = await signInWithGoogle();
        setCurrentUser({ ...user });
    };

    const handleSignOut = async () => {
        await logout();
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        userProfile,
        refreshUser,
        handleEmailSignUp,
        handleEmailSignIn,
        handleGoogleSignIn,
        handleSignOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <PageLoader /> : children}
        </AuthContext.Provider>
    );
};

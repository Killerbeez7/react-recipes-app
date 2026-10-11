import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { fromDoc } from "../firebase/firestore";
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
    // Public profile document in Firestore (username, bio, savedRecipes...)
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

        return onSnapshot(
            doc(db, "users", uid),
            (snapshot) => {
                if (!snapshot.exists()) {
                    setUserProfile(null);
                    return;
                }
                const profile = fromDoc(snapshot);
                setUserProfile({
                    ...profile,
                    username: profile.username || profile.displayName || "",
                    savedRecipes: Array.isArray(profile.savedRecipes)
                        ? profile.savedRecipes
                        : [],
                });
            },
            (error) => console.error("Error loading profile:", error)
        );
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

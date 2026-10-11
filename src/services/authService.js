import { auth, googleProvider, database } from "../firebase/firebaseConfig";
import { ref, set, get, remove } from "firebase/database";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail,
    updatePassword,
    updateProfile,
    deleteUser,
    signOut,
} from "firebase/auth";

// Upscale Google profile pictures (they default to 96x96)
const getHighResPhotoURL = (photoURL) => {
    if (photoURL && photoURL.includes("googleusercontent.com")) {
        return photoURL.replace(/=s\d+-c/, "=s512-c");
    }
    return photoURL || "";
};

// Create the user's profile record in the DB
export const addUserToDatabase = async (
    userId,
    email,
    username = "Anonymous",
    profilePicture = ""
) => {
    await set(ref(database, `users/${userId}`), {
        username,
        email,
        profilePicture,
        createdAt: new Date().toISOString(),
    });
};

// Email: Sign Up
export const signUpWithEmail = async (email, password, username) => {
    const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );
    const displayName = username?.trim() || email.split("@")[0];

    await updateProfile(user, { displayName });
    await addUserToDatabase(user.uid, email, displayName);

    return user;
};

// Email: Sign In
export const signInWithEmail = async (email, password) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
};

// Google: Sign In
export const signInWithGoogle = async () => {
    const { user } = await signInWithPopup(auth, googleProvider);

    // Only create the profile on first sign in so later edits aren't overwritten
    const snapshot = await get(ref(database, `users/${user.uid}`));
    if (!snapshot.exists()) {
        await addUserToDatabase(
            user.uid,
            user.email,
            user.displayName || "Google User",
            getHighResPhotoURL(user.photoURL)
        );
    }

    return user;
};

export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

export const changePassword = (newPassword) =>
    updatePassword(auth.currentUser, newPassword);

export const deleteAccount = async () => {
    const user = auth.currentUser;
    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);

    await remove(userRef);
    try {
        await deleteUser(user);
    } catch (error) {
        // e.g. auth/requires-recent-login – put the profile back
        if (snapshot.exists()) await set(userRef, snapshot.val());
        throw error;
    }
};

// Sign out
export const logout = () => signOut(auth);

import { auth, googleProvider, db } from "../firebase/firebaseConfig";
import {
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    serverTimestamp,
} from "firebase/firestore";
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

// Create the user's public profile. The email stays in Firebase Auth only,
// because profiles are readable by everyone (author names, avatars...).
export const addUserToDatabase = (
    userId,
    username = "Anonymous",
    profilePicture = ""
) =>
    setDoc(doc(db, "users", userId), {
        username,
        profilePicture,
        savedRecipes: [],
        createdAt: serverTimestamp(),
    });

// Email: Sign Up
export const signUpWithEmail = async (email, password, username) => {
    const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );
    const displayName = username?.trim() || email.split("@")[0];

    await updateProfile(user, { displayName });
    await addUserToDatabase(user.uid, displayName);

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
    const snapshot = await getDoc(doc(db, "users", user.uid));
    if (!snapshot.exists()) {
        await addUserToDatabase(
            user.uid,
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
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    await deleteDoc(userRef);
    try {
        await deleteUser(user);
    } catch (error) {
        // e.g. auth/requires-recent-login – put the profile back
        if (snapshot.exists()) await setDoc(userRef, snapshot.data());
        throw error;
    }
};

// Sign out
export const logout = () => signOut(auth);

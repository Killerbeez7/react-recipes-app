import { auth, googleProvider, database } from "../firebase/firebaseConfig";
import { ref, set, onValue } from "firebase/database";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
    signOut,
} from "firebase/auth";

// Upscale profile picture
const getHighResPhotoURL = (photoURL) => {
    if (photoURL && photoURL.includes("googleusercontent.com")) {
        return photoURL.replace(/=s\d+-c/, "=s512-c"); // Requests a 512x512 image
    }
    return photoURL || "https://example.com/default-profile.png";
};

// Get user data from DB
export const getUserFromDatabase = (userId, callback) => {
    const userRef = ref(database, "users/" + userId);
    onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
};

// Update DB
export const addUserToDatabase = async (
    userId,
    email,
    username = "Anonymous",
    profilePicture = "https://example.com/default-profile.png",
    firstName = "",
    lastName = ""
) => {
    try {
        await set(ref(database, `users/${userId}`), {
            username,
            email,
            profilePicture,
            firstName,
            lastName,
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error adding user to database:", error);
    }
};

// Email: Sign Up
export const signUpWithEmail = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        await addUserToDatabase(user.uid, email);

        return user;
    } catch (error) {
        console.error("Error signing up:", error);
        throw error;
    }
};

// Email: Sign In
export const signInWithEmail = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

// Google: Sign In
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const upscalePhotoURL = getHighResPhotoURL(user.photoURL);

        await addUserToDatabase(
            user.uid,
            user.email,
            user.displayName || "Google User",
            upscalePhotoURL || ""
        );

        return result;
    } catch (error) {
        console.error("Error with Google Sign-In:", error);
        throw error;
    }
};

// Sign out
export const logout = async () => {
    return signOut(auth);
};

// ADD PASSWORD CHANGE
// export const doPasswordChange = (password) => {
//     return updatePassword(auth.currentUser, password);
// }

// ADD EMAIL VERIFICATION
// export const doSendEmailVerification = () => {
//     return sendEmailVerification(auth.currentUser, {
//         url: `${window.location.origin}/home`,
//     })
// }

// NEXT FIX AUTH CONTEXT DELETE AUTH AND FINISH SIGN UP/IN AND THE REST RELATED FILES ...

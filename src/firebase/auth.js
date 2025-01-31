import { auth, googleProvider, database } from "./firebaseConfig";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import { ref, set, onValue } from "firebase/database";

export const addUserToDatabase = async (userId, name, email, photoURL) => {
    try {
        await set(ref(database, "users/" + userId), {
            username: name || "Anonymous",
            email: email,
            profilePicture: photoURL,
            savedRecipes: [],
        });
    } catch (error) {
        console.error("Error adding user to database:", error);
    }
};

export const getUserFromDatabase = (userId, callback) => {
    const userRef = ref(database, "users/" + userId);
    onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
};

export const doCreateUserWithEmailAndPassword = async (
    email,
    password,
    name
) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        await addUserToDatabase(user.uid, name, email);
        return user;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const doSignInWithEmailAndPassword = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const upscalePhotoURL =  getHighResPhotoURL(user.photoURL)
        
        await addUserToDatabase(
            user.uid,
            user.displayName,
            user.email,
            upscalePhotoURL
        );
        return result;
    } catch (error) {
        console.error("Error with Google Sign-In:", error);
        throw error;
    }
};

export const doSignOut = () => {
    return auth.signOut();
};

export const updateProfileDetails = () => {};


const getHighResPhotoURL = (photoURL) => {
    if (photoURL.includes("googleusercontent.com")) {
        return photoURL.replace(/=s\d+-c/, "=s512-c"); // Requests a 512x512 image
    }
    return photoURL;
};

// ADD PASSWORD RESET
// export const doPasswordReset = (email) => {
//     return sendPasswordResetEmail(auth, email);
// }

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

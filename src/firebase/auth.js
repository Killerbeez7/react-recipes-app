import { auth, googleProvider, database } from './firebaseConfig';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
} from 'firebase/auth';
import { ref, set, onValue } from 'firebase/database';

// Create user profiles in the database
export const addUserToDatabase = async (userId, name, email) => {
    try {
        await set(ref(database, 'users/' + userId), {
            username: name || 'Anonymous',
            email: email,
        });
    } catch (error) {
        console.error("Error adding user to database:", error);
    }
};

// Get user data from the database
export const getUserFromDatabase = (userId, callback) => {
    const userRef = ref(database, 'users/' + userId);
    onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
};

// Create user with email and password and add to database
export const doCreateUserWithEmailAndPassword = async (email, password, name) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; // Get user details
        await addUserToDatabase(user.uid, name, email); // Add user to database
        return user;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

// Sign in with email and password
export const doSignInWithEmailAndPassword = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
}

// Sign in with Google
export const doSignInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user; // Get user details
        await addUserToDatabase(user.uid, user.displayName, user.email); // Add user to database
        return result;
    } catch (error) {
        console.error("Error with Google Sign-In:", error);
        throw error;
    }
}

export const doSignOut = () => {
    return auth.signOut();
}

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

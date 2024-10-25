import { GoogleAuthProvider } from 'firebase/auth/cordova';
import { auth } from './firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    // sendEmailVerification,
    // sendPasswordResetEmail,
} from 'firebase/auth';


export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
}

export const doSignInWithEmailAndPassword = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
}

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    //result.user //may be save to firestore
    return result
}

export const doSignOut = () => {
    return auth.signOut();
}

//ADD PASSWORD RESET
// export const doPasswordReset = (email) => {
//     return sendPasswordResetEmail(auth, email);
// }


//ADD PASSWORD CHANGE
// export const doPasswordChange = (password) => {
//     return updatePassword(auth.currentUser, password);
// }


//ADD EMAIL VERIFICATION
// export const doSendEmailVerification = () => {
//     return sendEmailVerification(auth.currentUser, {
//         url: `${window.location.origin}/home`,
//     })
// }
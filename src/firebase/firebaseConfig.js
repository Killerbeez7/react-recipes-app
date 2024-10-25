import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth'; // Keep only auth-related imports
import { getDatabase } from 'firebase/database'; // Correctly import getDatabase from firebase/database

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAjSah7bXPwYzF9W2_c_vkhjTo3uzMy7Jk",
    authDomain: "eat-and-amare-f0f08.firebaseapp.com",
    databaseURL: 'https://eat-and-amare-f0f08-default-rtdb.europe-west1.firebasedatabase.app/',
    projectId: "eat-and-amare-f0f08",
    storageBucket: "eat-and-amare-f0f08.appspot.com",
    messagingSenderId: "152325611922",
    appId: "1:152325611922:web:4b3be847d5b531ea3be14b"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase auth and provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const database = getDatabase(app); // Correctly initialize the database

export { app };

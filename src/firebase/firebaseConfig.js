import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyAjSah7bXPwYzF9W2_c_vkhjTo3uzMy7Jk",
    authDomain: "eat-and-amare-f0f08.firebaseapp.com",
    databaseURL: 'https://eat-and-amare-f0f08-default-rtdb.europe-west1.firebasedatabase.app/',
    projectId: "eat-and-amare-f0f08",
    storageBucket: "gs://eat-and-amare-f0f08.firebasestorage.app",
    messagingSenderId: "152325611922",
    appId: "1:152325611922:web:4b3be847d5b531ea3be14b"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const database = getDatabase(app);
export const storage = getStorage(app);

export { app };

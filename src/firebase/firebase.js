import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAjSah7bXPwYzF9W2_c_vkhjTo3uzMy7Jk",
    authDomain: "eat-and-amare-f0f08.firebaseapp.com",
    databaseURL:'https://eat-and-amare-f0f08-default-rtdb.europe-west1.firebasedatabase.app/',
    projectId: "eat-and-amare-f0f08",
    storageBucket: "eat-and-amare-f0f08.appspot.com",
    messagingSenderId: "152325611922",
    appId: "1:152325611922:web:4b3be847d5b531ea3be14b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/auth.user
//     const uid = user.uid;
//     // ...
//   } else {
//     // User is signed out
//     // ...
//   }
// });

export { app, auth };
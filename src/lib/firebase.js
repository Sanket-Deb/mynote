// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaYlysgpbzmjiTmURuqElKXPfBN7V4MIo",
  authDomain: "mynote-pwa.firebaseapp.com",
  projectId: "mynote-pwa",
  storageBucket: "mynote-pwa.firebasestorage.app",
  messagingSenderId: "847169321909",
  appId: "1:847169321909:web:856b2bff48d70b4dfff7fc",
  measurementId: "G-XTF1ZVL47P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
// const analytics = getAnalytics(app);

let analytics;
isSupported().then((yes) => {
  if (yes) {
    analytics = getAnalytics(app);
  }
});

export { app, auth, provider, db, analytics };

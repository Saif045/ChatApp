// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore'



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEM0yM0xMULQ-WIWtRqjZRRNCog1zQRPs",
  authDomain: "chatapp-bd32d.firebaseapp.com",
  projectId: "chatapp-bd32d",
  storageBucket: "chatapp-bd32d.appspot.com",
  messagingSenderId: "464882339672",
  appId: "1:464882339672:web:1c06c7dfe2bd285bbbdf2d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export const db = getFirestore()

export const googleProvider = new GoogleAuthProvider();

export const facebookProvider = new FacebookAuthProvider();
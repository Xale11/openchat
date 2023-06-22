// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkbah8T2DzhN67pDRvHijEmp4v4UsGlfk",
  authDomain: "openchat-fe06f.firebaseapp.com",
  projectId: "openchat-fe06f",
  storageBucket: "openchat-fe06f.appspot.com",
  messagingSenderId: "251991957060",
  appId: "1:251991957060:web:68ef44c5a115a4fe60e611",
  measurementId: "G-102ZE68CDY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const GoogleAuth = new GoogleAuthProvider()
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app)


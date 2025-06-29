// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjf1UnpVNi9Gqi4iuy_qcfF_Bb1WEw6c4",
  authDomain: "reservation-system-20ae6.firebaseapp.com",
  projectId: "reservation-system-20ae6",
  storageBucket: "reservation-system-20ae6.firebasestorage.app",
  messagingSenderId: "745747028040",
  appId: "1:745747028040:web:30d9e7483ed848a2fe607d",
  measurementId: "G-4L2S5G33C9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
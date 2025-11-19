// src/firebase.jsx
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASlSn9_GQOlbME1FOIkOb-RpODGOkWxvE", 
  authDomain: "vik-store-951a0.firebaseapp.com",
  projectId: "vik-store-951a0",
  storageBucket: "vik-store-951a0.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Google provider
export const googleProvider = new GoogleAuthProvider();

// Firestore
export const db = getFirestore(app);

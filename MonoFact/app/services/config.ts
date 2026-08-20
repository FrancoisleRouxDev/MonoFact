// Firebase SDK imports — we only import what we use.
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase project configuration — values come from .env so they are
// never hard-coded in source code. Expo exposes EXPO_PUBLIC_* vars at build time.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialise Firebase — this runs once when the app starts.
export const app = initializeApp(firebaseConfig);

// Firestore database instance — used for all reads/writes to user data and facts.
export const db = getFirestore(app);

// Firebase Auth instance — used for login, register, logout, and auth state.
export const auth = getAuth(app);

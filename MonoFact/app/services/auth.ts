import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "./config";

// ---------------------------------------------------------------------------
// registerUser
// ---------------------------------------------------------------------------
// Creates a Firebase Auth account, then writes a complete Firestore user
// document that includes every field the app reads across all screens.
// If any field is missing on a fresh account, screens show "undefined".
// ---------------------------------------------------------------------------
export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  // 1. Create the Firebase Auth account — throws on bad email / weak password.
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // 2. Write the full user document to Firestore.
  //    Every field listed here is read by at least one screen.
  //    Missing fields = crashes / undefined values for new users.
  await setDoc(doc(db, "users", credential.user.uid), {
    // --- Identity ---
    username,
    email,

    // --- XP & Levelling (read by HomeHeader, Profile, Results) ---
    xp: 0,
    level: 1,

    // --- Game history (read by Stats, Profile, Play) ---
    gamesPlayed: 0,
    totalCorrect: 0,
    totalIncorrect: 0,

    // --- Streak tracking (read by HomeHeader, Stats) ---
    currentStreak: 0,
    bestStreak: 0,

    // --- Per-category progress (read by Play screen) ---
    // Each category stores { correct, incorrect } under categoryStats,
    // and a raw answered-count under progress.
    categoryStats: {},
    progress: {},

    // --- Favourite category (read by Profile, Stats) ---
    favoriteCategory: null,

    // --- Resume-game position (read by Home screen ContinueCard) ---
    lastCategory: null,
    lastQuestionIndex: null,

    // --- Meta ---
    createdAt: serverTimestamp(),
  });

  return credential.user;
}

// ---------------------------------------------------------------------------
// loginUser
// ---------------------------------------------------------------------------
// Signs in an existing user with email + password.
// Throws a Firebase Auth error on bad credentials.
// ---------------------------------------------------------------------------
export async function loginUser(
  email: string,
  password: string
) {
  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return credential.user;
}
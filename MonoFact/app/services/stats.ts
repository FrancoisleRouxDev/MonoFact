import {
    doc,
    getDoc,
    increment,
    updateDoc,
} from "firebase/firestore";

import { auth, db } from "./config";


// --------------------------------------------------
// Get the current user's document
// --------------------------------------------------

export const getUserStats = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error("No authenticated user.");
    }

    const userRef = doc(
        db,
        "users",
        currentUser.uid
    );

    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        throw new Error("User document does not exist.");
    }

    return snapshot.data();
};


// --------------------------------------------------
// Record an answer
// --------------------------------------------------

export const recordAnswer = async (
    isCorrect: boolean,
    category: string
) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error("No authenticated user.");
    }

    const userRef = doc(
        db,
        "users",
        currentUser.uid
    );

    const categoryKey = category.trim();

    const categoryCorrectPath =
        `categoryStats.${categoryKey}.correct`;

    const categoryIncorrectPath =
        `categoryStats.${categoryKey}.incorrect`;

    await updateDoc(userRef, {

        // Overall statistics
        totalCorrect: increment(
            isCorrect ? 1 : 0
        ),

        totalIncorrect: increment(
            isCorrect ? 0 : 1
        ),

        // XP
        xp: increment(
            isCorrect ? 10 : 0
        ),

        // Category statistics
        [categoryCorrectPath]: increment(
            isCorrect ? 1 : 0
        ),

        [categoryIncorrectPath]: increment(
            isCorrect ? 0 : 1
        ),
    });
};


// --------------------------------------------------
// Record a completed game
// --------------------------------------------------

export const recordGameCompleted = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error("No authenticated user.");
    }

    const userRef = doc(
        db,
        "users",
        currentUser.uid
    );

    await updateDoc(userRef, {
        gamesPlayed: increment(1),
    });
};


// --------------------------------------------------
// Record the user's streak
// --------------------------------------------------

export const recordStreak = async (
    isCorrect: boolean
) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error("No authenticated user.");
    }

    const userRef = doc(
        db,
        "users",
        currentUser.uid
    );

    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        throw new Error("User document does not exist.");
    }

    const userData = snapshot.data();

    const currentStreak =
        userData.currentStreak ?? 0;

    const bestStreak =
        userData.bestStreak ?? 0;

    let newCurrentStreak: number;

    if (isCorrect) {
        newCurrentStreak =
            currentStreak + 1;
    } else {
        newCurrentStreak = 0;
    }

    const newBestStreak =
        Math.max(
            bestStreak,
            newCurrentStreak
        );

    await updateDoc(userRef, {
        currentStreak: newCurrentStreak,
        bestStreak: newBestStreak,
    });
};
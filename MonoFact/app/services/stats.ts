import {
    doc,
    getDoc,
    increment,
    updateDoc,
} from "firebase/firestore";

import { auth, db } from "./config";

// --------------------------------------------------
// Level thresholds
// --------------------------------------------------

const getXPForLevel = (level: number): number => {
    return Math.round(200 * Math.pow(1.8, level - 1));
};

// --------------------------------------------------
// Get the correct level from XP
// --------------------------------------------------

const getLevelFromXP = (xp: number): number => {
    let level = 1;
    while (xp >= getXPForLevel(level + 1)) {
        level++;
    }
    return level;
}

export const getRequiredXPForLevel = (level: number): number => {
    return getXPForLevel(level + 1);
};

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
): Promise<number> => {
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

    // Step 1 — update XP and stats
    await updateDoc(userRef, {
        totalCorrect: increment(isCorrect ? 1 : 0),
        totalIncorrect: increment(isCorrect ? 0 : 1),
        xp: increment(isCorrect ? 15 : 0),
        [categoryCorrectPath]: increment(isCorrect ? 1 : 0),
        [categoryIncorrectPath]: increment(isCorrect ? 0 : 1),
        [`progress.${categoryKey}`]: increment(1),
    });

    // Step 2 — calculate and apply streak bonus
    const newStreak = await recordStreak(isCorrect);

    const cappedStreak = Math.min(newStreak, 9);
    const streakBonus = newStreak >= 3 ? cappedStreak * 10 : 0;

    if (streakBonus > 0) {
        await updateDoc(userRef, {
            xp: increment(streakBonus),
        });
    }

    // Step 3 — fetch updated XP
    const updated = await getDoc(userRef);
    const updatedData = updated.data();
    const currentXP = updatedData?.xp ?? 0;
    const currentLevel = updatedData?.level ?? 1;

    // Step 4 — calculate what level they should be
    const correctLevel = getLevelFromXP(currentXP);

    // Step 5 — only update if level changed
    if (correctLevel !== currentLevel) {
        await updateDoc(userRef, {
            level: correctLevel,
        });
    }

    return streakBonus;
};

// --------------------------------------------------
// Record a completed game
// --------------------------------------------------

export const recordGameCompleted = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No authenticated user.");

    const userRef = doc(db, "users", currentUser.uid);

    await updateDoc(userRef, {
        gamesPlayed: increment(1),
        lastCategory: null,
        lastQuestionIndex: null,
    });
};

// --------------------------------------------------
// Save mid-game position
// --------------------------------------------------

export const saveLastPosition = async (
    category: string,
    index: number
) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No authenticated user.");

    const userRef = doc(db, "users", currentUser.uid);

    await updateDoc(userRef, {
        lastCategory: category,
        lastQuestionIndex: index,
    });
};

// --------------------------------------------------
// Clear mid-game position
// --------------------------------------------------

export const clearLastPosition = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No authenticated user.");

    const userRef = doc(db, "users", currentUser.uid);

    await updateDoc(userRef, {
        lastCategory: null,
        lastQuestionIndex: null,
    });
};

// --------------------------------------------------
// Record the user's streak
// --------------------------------------------------

export const recordStreak = async (
    isCorrect: boolean
): Promise<number> => {
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

    const currentStreak = userData.currentStreak ?? 0;
    const bestStreak = userData.bestStreak ?? 0;

    let newCurrentStreak: number;

    if (isCorrect) {
        newCurrentStreak = currentStreak + 1;
    } else {
        newCurrentStreak = 0;
    }

    const newBestStreak = Math.max(bestStreak, newCurrentStreak);

    await updateDoc(userRef, {
        currentStreak: newCurrentStreak,
        bestStreak: newBestStreak,
    });

    return newCurrentStreak;
};

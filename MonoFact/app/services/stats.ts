import {
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    updateDoc,
} from "firebase/firestore";

import { auth, db } from "./config";
import { localDateKey } from "@/lib/date";
import { shuffle } from "@/lib/shuffle";
import { getLocalProgress, updateLocalProgress, applyLocalAnswer } from "./localProgress";
import { getLocalFacts } from "./localFacts";

// --------------------------------------------------
// Level thresholds
// --------------------------------------------------

const getXPForLevel = (level: number): number => {
    return Math.round(200 * Math.pow(1.8, level - 1));
};

// --------------------------------------------------
// Get the correct level from XP
// --------------------------------------------------

export const getLevelFromXP = (xp: number): number => {
    let level = 1;
    while (xp >= getXPForLevel(level + 1)) {
        level++;
    }
    return level;
}

// Bonus XP for answering correctly in a streak: 10 per streak step, capped at 9.
export const calcStreakBonus = (streak: number): number =>
    streak >= 3 ? Math.min(streak, 9) * 10 : 0;

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
    category: string,
    source: "swipe" | "button" = "button",
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

    try {
        // Step 1 — update XP and stats
        await updateDoc(userRef, {
        totalCorrect: increment(isCorrect ? 1 : 0),
        totalIncorrect: increment(isCorrect ? 0 : 1),
        xp: increment(isCorrect ? 15 : 0),
        [categoryCorrectPath]: increment(isCorrect ? 1 : 0),
        [categoryIncorrectPath]: increment(isCorrect ? 0 : 1),
        [`progress.${categoryKey}`]: increment(1),
        swipeAnswers: increment(source === "swipe" ? 1 : 0),
    });

    // Step 2 — calculate and apply streak bonus
    const newStreak = await recordStreak(isCorrect);

    const streakBonus = calcStreakBonus(newStreak);

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

    // Step 6 - check achievements after every answer
    await checkAchievements();

        return streakBonus;
    } catch (error) {
        console.warn("Saving answer online failed; keeping progress locally:", error);
        const local = await updateLocalProgress(currentUser.uid, (current) =>
            applyLocalAnswer(current, isCorrect, categoryKey, source)
        );
        return Math.max(0, (local.currentStreak ?? 0) >= 3
            ? Math.min(local.currentStreak ?? 0, 9) * 10
            : 0);
    }
};

// --------------------------------------------------
// Record a completed game
// --------------------------------------------------

export const recordGameCompleted = async (
    correctAnswersInRound: number
) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No authenticated user.");

    const userRef = doc(db, "users", currentUser.uid);

    try {
        await updateDoc(userRef, {
            gamesPlayed: increment(1),
            lastCategory: null,
            lastQuestionIndex: null,
        });

        // Check achievements after every completed game
        await checkAchievements(correctAnswersInRound);
    } catch (error) {
        console.warn("Saving completed game online failed; keeping progress locally:", error);
        await updateLocalProgress(currentUser.uid, (current) => ({
            ...current,
            gamesPlayed: (current.gamesPlayed ?? 0) + 1,
            lastCategory: undefined,
            lastQuestionIndex: undefined,
        }));
    }
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

    try {
        await updateDoc(userRef, {
            lastCategory: category,
            lastQuestionIndex: index,
        });
    } catch (error) {
        console.warn("Saving game position online failed; keeping it locally:", error);
        await updateLocalProgress(currentUser.uid, (current) => ({
            ...current,
            lastCategory: category,
            lastQuestionIndex: index,
        }));
    }
};

// --------------------------------------------------
// Clear mid-game position
// --------------------------------------------------

export const clearLastPosition = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No authenticated user.");

    const userRef = doc(db, "users", currentUser.uid);

    try {
        await updateDoc(userRef, {
            lastCategory: null,
            lastQuestionIndex: null,
        });
    } catch (error) {
        console.warn("Clearing game position online failed; clearing it locally:", error);
        await updateLocalProgress(currentUser.uid, (current) => ({
            ...current,
            lastCategory: undefined,
            lastQuestionIndex: undefined,
        }));
    }
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

// --------------------------------------------------
// Achievement definitions
// --------------------------------------------------

/**
 * Secret achievement identifiers that remain hidden until unlocked.
 */
export const HIDDEN_ACHIEVEMENTS = [
    "night_owl",
    "early_bird",
    "fact_addict",
    "quick_draw",
    "swipe_master",
] as const;

// --------------------------------------------------
// Check and unlock achievements
// --------------------------------------------------

export const checkAchievements = async (
    correctAnswersInRound?: number
) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No authenticated user.");

    const userRef = doc(db, "users", currentUser.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) throw new Error("User document does not exist.");

    const data = snapshot.data();

    // Already earned achievements — we never overwrite these
    const earned: Record<string, boolean> =
        data.achievements ?? {};

    // Collect newly unlocked achievements this check
    const newlyUnlocked: Record<string, boolean> = {};

    // Helper — only unlock if not already earned
    const unlock = (id: string) => {
        if (!earned[id]) {
            newlyUnlocked[id] = true;
        }
    };

    // ---- Current time for hidden achievements ----
    const hour = new Date().getHours();

    // ---- Category completion helpers ----
    const progress = data.progress ?? {};
    const categoryKeys = [
        "Nature",
        "Science",
        "Animals",
        "Space",
        "Photography",
        "Technology",
    ];

    const completedCategories = categoryKeys.filter(
        (key) => (progress[key] ?? 0) >= 25
    ).length;

    const hasStartedAnyCategory = categoryKeys.some(
        (key) => (progress[key] ?? 0) >= 1
    );

    // ---- Overall accuracy ----
    const totalCorrect = data.totalCorrect ?? 0;
    const totalIncorrect = data.totalIncorrect ?? 0;
    const totalAnswers = totalCorrect + totalIncorrect;
    const accuracy = totalAnswers === 0
        ? 0
        : Math.round((totalCorrect / totalAnswers) * 100);

    // ---- Games played today ----
    const today = localDateKey();
    const lastPlayedDate = data.lastPlayedDate ?? "";
    let gamesPlayedToday = data.gamesPlayedToday ?? 0;

    if (lastPlayedDate !== today) {
        // New day — reset counter
        gamesPlayedToday = 1;
        await updateDoc(userRef, {
            gamesPlayedToday: 1,
            lastPlayedDate: today,
        });
    } else {
        gamesPlayedToday = data.gamesPlayedToday ?? 1;
    }

    // --------------------------------------------------
    // Streak based
    // --------------------------------------------------
    const currentStreak = data.currentStreak ?? 0;
    if (currentStreak >= 3) unlock("first_spark");
    if (currentStreak >= 7) unlock("on_fire");
    if (currentStreak >= 15) unlock("unstoppable");
    if (currentStreak >= 30) unlock("legendary");

    // --------------------------------------------------
    // Daily challenge based
    // --------------------------------------------------
    const dailyChallengesCompleted = data.dailyChallengesCompleted ?? 0;
    if (dailyChallengesCompleted >= 1) unlock("daily_devotee");
    if (dailyChallengesCompleted >= 7) unlock("consistent");
    if (dailyChallengesCompleted >= 30) unlock("dedicated_scholar");

    // --------------------------------------------------
    // Score based
    // --------------------------------------------------

    // Perfect Round — 25/25 correct in a category this round
    if (correctAnswersInRound === 25) unlock("perfect_round");

    // Sharp Mind — 80%+ overall accuracy
    if (accuracy >= 80) unlock("sharp_mind");

    // --------------------------------------------------
    // Exploration based
    // --------------------------------------------------
    if (hasStartedAnyCategory) unlock("curious_mind");
    if (completedCategories >= 1) unlock("explorer");
    if (completedCategories >= 3) unlock("globetrotter");
    if (completedCategories >= 6) unlock("completionist");

    // --------------------------------------------------
    // XP / Level based
    // --------------------------------------------------
    const level = data.level ?? 1;
    if (level >= 2) unlock("first_steps");
    if (level >= 5) unlock("rising_star");
    if (level >= 10) unlock("fact_machine");
    if (level >= 20) unlock("enlightened");

    // --------------------------------------------------
    // Games based
    // --------------------------------------------------
    const gamesPlayed = data.gamesPlayed ?? 0;
    if (gamesPlayed >= 1) unlock("rookie");
    if (gamesPlayed >= 10) unlock("dedicated");
    if (gamesPlayed >= 50) unlock("veteran");
    if (gamesPlayed >= 100) unlock("elite");

    // --------------------------------------------------
    // Swipe based
    // --------------------------------------------------
    const swipeAnswers = data.swipeAnswers ?? 0;
    if (swipeAnswers >= 10) unlock("quick_draw");
    if (swipeAnswers >= 100) unlock("swipe_master");

    // --------------------------------------------------
    // Hidden achievements
    // --------------------------------------------------

    // Night Owl — playing between midnight and 3am
    if (hour >= 0 && hour < 3) unlock("night_owl");

    // Early Bird — playing between 3am and 7am
    if (hour >= 3 && hour < 7) unlock("early_bird");

    // Fact Addict — 3 or more games in one day
    if (gamesPlayedToday >= 3) unlock("fact_addict");

    // --------------------------------------------------
    // Write newly unlocked achievements to Firestore
    // --------------------------------------------------

    if (Object.keys(newlyUnlocked).length > 0) {
        const achievementUpdates: Record<string, boolean> = {};

        for (const id of Object.keys(newlyUnlocked)) {
            achievementUpdates[`achievements.${id}`] = true;
        }

        await updateDoc(userRef, achievementUpdates);
    }

    return newlyUnlocked;
};

// --------------------------------------------------
// Get today's daily challenge facts
// --------------------------------------------------

export const getDailyFacts = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No authenticated user.");

    const userRef = doc(db, "users", currentUser.uid);
    let snapshot;
    try {
        snapshot = await getDoc(userRef);
    } catch (error) {
        console.warn("Loading daily progress online failed; using local progress:", error);
        const local = await getLocalProgress(currentUser.uid);
        const today = localDateKey();
        if (local?.dailyFactDate === today && local.dailyFactIds?.length === 5) {
            return local.dailyFactIds;
        }

        const selectedIds = getLocalFacts("daily")
            .slice(0, 5)
            .map((fact) => fact.id);
        await updateLocalProgress(currentUser.uid, (current) => ({
            ...current,
            dailyFactIds: selectedIds,
            dailyFactDate: today,
        }));
        return selectedIds;
    }

    if (!snapshot.exists()) throw new Error("User document does not exist.");

    const data = snapshot.data();
    const today = localDateKey();

    // Return cached facts if already selected today
    if (data.dailyFactDate === today && data.dailyFactIds?.length === 5) {
        return data.dailyFactIds as string[];
    }

    // Fetch all daily facts from Firestore
    const factsRef = collection(db, "categories", "daily", "facts");
    const factsSnapshot = await getDocs(factsRef);
    const allIds = factsSnapshot.docs.map((d) => d.id);

    // Pick 5 random fact IDs
    const shuffled = shuffle(allIds);
    const selectedIds = shuffled.slice(0, 5);

    // Cache them against today's date
    await updateDoc(userRef, {
        dailyFactIds: selectedIds,
        dailyFactDate: today,
    });

    return selectedIds;
};

// --------------------------------------------------
// Record a completed daily challenge
// --------------------------------------------------

export const recordDailyChallengeCompleted = async (
    correctAnswers: number
) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No authenticated user.");

    const today = localDateKey();
    const userRef = doc(db, "users", currentUser.uid);

    // Mark challenge as completed today
    try {
        await updateDoc(userRef, {
            dailyChallengesCompleted: increment(1),
            dailyCompletedDate: today,
        });

        // Check achievements including flawless (5/5)
        await checkAchievements(correctAnswers);
    } catch (error) {
        console.warn("Saving daily completion online failed; keeping it locally:", error);
        await updateLocalProgress(currentUser.uid, (current) => ({
            ...current,
            dailyChallengesCompleted: (current.dailyChallengesCompleted ?? 0) + 1,
            dailyCompletedDate: today,
        }));
    }
};

// ---------------------------------------
// Award daily challenge bonus XP
// ---------------------------------------

export const recordDailyBonus = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No authenticated user.");

    const userRef = doc(db, "users", currentUser.uid);

    try {
        await updateDoc(userRef, {
            xp: increment(100),
        });
        const updated = await getDoc(userRef);
        const updatedData = updated.data();
        const currentXP = updatedData?.xp ?? 0;
        const currentLevel = updatedData?.level ?? 1;
        const correctLevel = getLevelFromXP(currentXP);

        if (correctLevel !== currentLevel) {
            await updateDoc(userRef, {
                level: correctLevel,
            });
        }
    } catch (error) {
        console.warn("Saving daily bonus online failed; keeping it locally:", error);
        await updateLocalProgress(currentUser.uid, (current) => {
            const xp = (current.xp ?? 0) + 100;
            return {
                ...current,
                xp,
                level: getLevelFromXP(xp),
            };
        });
    }
}

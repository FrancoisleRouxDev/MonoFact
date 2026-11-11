import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserData } from "@/app/context/UserContext";

const STORAGE_PREFIX = "monofact:user-progress:";

function storageKey(userId: string): string {
    return `${STORAGE_PREFIX}${userId}`;
}

export async function getLocalProgress(userId: string): Promise<UserData | null> {
    try {
        const raw = await AsyncStorage.getItem(storageKey(userId));
        return raw ? JSON.parse(raw) as UserData : null;
    } catch (error) {
        console.warn("Failed to load local progress:", error);
        return null;
    }
}

export async function saveLocalProgress(
    userId: string,
    data: UserData,
): Promise<void> {
    try {
        await AsyncStorage.setItem(storageKey(userId), JSON.stringify(data));
    } catch (error) {
        console.warn("Failed to save local progress:", error);
    }
}

export async function updateLocalProgress(
    userId: string,
    update: (current: UserData) => UserData,
): Promise<UserData> {
    const current = (await getLocalProgress(userId)) ?? {};
    const next = update(current);
    await saveLocalProgress(userId, next);
    return next;
}

export function applyLocalAnswer(
    current: UserData,
    isCorrect: boolean,
    category: string,
    source: "swipe" | "button",
): UserData {
    const categoryStats = current.categoryStats ?? {};
    const previousCategoryStats = categoryStats[category] ?? { correct: 0, incorrect: 0 };
    const currentStreak = isCorrect ? (current.currentStreak ?? 0) + 1 : 0;
    const streakBonus = currentStreak >= 3 ? Math.min(currentStreak, 9) * 10 : 0;
    const xp = (current.xp ?? 0) + (isCorrect ? 15 : 0) + streakBonus;

    return {
        ...current,
        totalCorrect: (current.totalCorrect ?? 0) + (isCorrect ? 1 : 0),
        totalIncorrect: (current.totalIncorrect ?? 0) + (isCorrect ? 0 : 1),
        xp,
        level: getLevelFromXP(xp),
        currentStreak,
        bestStreak: Math.max(current.bestStreak ?? 0, currentStreak),
        swipeAnswers: (current.swipeAnswers ?? 0) + (source === "swipe" ? 1 : 0),
        categoryStats: {
            ...categoryStats,
            [category]: {
                correct: previousCategoryStats.correct + (isCorrect ? 1 : 0),
                incorrect: previousCategoryStats.incorrect + (isCorrect ? 0 : 1),
            },
        },
        progress: {
            ...(current.progress ?? {}),
            [category]: (current.progress?.[category] ?? 0) + 1,
        },
    };
}

function getLevelFromXP(xp: number): number {
    let level = 1;
    while (xp >= Math.round(200 * Math.pow(1.8, level))) level++;
    return level;
}

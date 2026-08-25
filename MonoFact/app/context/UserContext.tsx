import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/app/services/config";
import { onAuthStateChanged } from "firebase/auth";

/**
 * Shape of the user document stored in Firestore ('users' collection).
 * Mirrors all progression, statistics, and daily challenge states.
 */
export type UserData = {
    username?: string;
    email?: string;
    xp?: number;
    level?: number;
    currentStreak?: number;
    bestStreak?: number;
    totalCorrect?: number;
    totalIncorrect?: number;
    gamesPlayed?: number;
    favoriteCategory?: string;
    photoURL?: string;
    lastCategory?: string;
    lastQuestionIndex?: number;
    swipeAnswers?: number;
    dailyChallengesCompleted?: number;
    dailyFactIds?: string[];
    dailyFactDate?: string;
    achievements?: Record<string, boolean>;
    categoryStats?: Record<string, { correct: number; incorrect: number }>;
    progress?: Record<string, number>;
    dailyCompletedDate?: string;
};

type UserContextType = {
    userData: UserData | null;
    loading: boolean;
    refresh: () => void;
};

const UserContext = createContext<UserContextType>({
    userData: null,
    loading: true,
    refresh: () => { },
});

/**
 * UserProvider wraps the application root and provides real-time Firestore synchronization
 * with Firebase Authentication. Automatically subscribes/unsubscribes to user changes.
 */
export function UserProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeSnapshot: (() => void) | null = null;

        // Listen to Firebase Auth state changes
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            // Clean up any existing Firestore listener on auth transition
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
                unsubscribeSnapshot = null;
            }

            if (!user) {
                setUserData(null);
                setLoading(false);
                return;
            }

            // Real-time listener for the authenticated user document
            const userRef = doc(db, "users", user.uid);
            unsubscribeSnapshot = onSnapshot(
                userRef,
                (snapshot) => {
                    if (snapshot.exists()) {
                        setUserData(snapshot.data() as UserData);
                    }
                    setLoading(false);
                },
                (error) => {
                    console.error("Firestore user snapshot error:", error);
                    setLoading(false);
                }
            );
        });

        // Cleanup both auth and Firestore subscriptions on unmount
        return () => {
            if (unsubscribeSnapshot) unsubscribeSnapshot();
            unsubscribeAuth();
        };
    }, []);

    /**
     * Manual refresh helper to force a fresh fetch of user stats if needed.
     */
    const refresh = () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const userRef = doc(db, "users", currentUser.uid);
        getDoc(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                setUserData(snapshot.data() as UserData);
            }
        }).catch((err) => {
            console.error("Failed to refresh user data:", err);
        });
    };

    return (
        <UserContext.Provider value={{ userData, loading, refresh }}>
            {children}
        </UserContext.Provider>
    );
}

/**
 * Hook to access current authenticated user profile and live stats.
 */
export const useUser = () => useContext(UserContext);
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

type UserData = {
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
    dailyChallengeCompleted?: number;
    dailyFactIds?: string[];
    dailyFactDate?: string;
    achievements?: Record<string, boolean>;
    categoryStats?: Record<string, { correct: number; incorrect: number }>;
    progress?: Record<string, number>;
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

export function UserProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Wait for auth to be ready first
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setUserData(null);
                setLoading(false);
                return;
            }

            // Listen to Firestore in real time
            const userRef = doc(db, "users", user.uid);

            const unsubscribeSnapshot = onSnapshot(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    setUserData(snapshot.data() as UserData);
                }
                setLoading(false);
            });

            return () => unsubscribeSnapshot();
        });

        return () => unsubscribeAuth();
    }, []);

    const refresh = () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const userRef = doc(db, "users", currentUser.uid);
        getDoc(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                setUserData(snapshot.data() as UserData);
            }
        });
    };

    return (
        <UserContext.Provider value={{ userData, loading, refresh }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
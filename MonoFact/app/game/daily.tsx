import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Pressable,
    ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/app/services/config";
import { useState, useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { Check, X, Star } from "lucide-react-native";

// Components
import QuestionProgress from "@/components/gameplay/QuestionProgress";
import SwipeableQuestionCard from "@/components/gameplay/SwipeableQuestionCard";
import QuestionCard from "@/components/cards/QuestionCard";
import SwipeHint from "@/components/gameplay/SwipeHint";
import AnswerButton from "@/components/gameplay/AnswerButton";
import AnswerCard from "@/components/cards/AnswerCard";
import FactExplanation from "@/components/gameplay/FactExplanation";
import {
    recordAnswer,
    getDailyFacts,
    recordDailyChallengeCompleted,
    recordDailyBonus,
} from "@/app/services/stats";

// ---------------------------------------------------------------------------
// Fact type — matches the Firestore document structure
// ---------------------------------------------------------------------------
type Fact = {
    id: string;
    category: string;
    statement: string;
    isFact: boolean;
    explanation: string;
    order: number;
};

// ---------------------------------------------------------------------------
// Screen state — which view is currently shown
// ---------------------------------------------------------------------------
type ScreenState = "loading" | "already_done" | "question" | "feedback" | "results";

// ---------------------------------------------------------------------------
// DailyGameplayScreen (file: app/game/daily.tsx)
// ---------------------------------------------------------------------------
// Fully self-contained daily challenge screen.
// Handles questions, feedback, and results all in one screen using local state
// so the user never accidentally loops back to a previous question.
//
// Restrictions:
//   - Users can only complete the daily challenge once per day
//   - No back navigation between questions
//   - Results shown inline after all 5 facts are answered
// ---------------------------------------------------------------------------
export default function DailyGameplayScreen() {
    const [screenState, setScreenState] = useState<ScreenState>("loading");
    const [facts, setFacts] = useState<Fact[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
    const [lastStreakBonus, setLastStreakBonus] = useState(0);

    const router = useRouter();

    // -------------------------------------------------------------------------
    // Load today's daily facts and check completion status on mount
    // -------------------------------------------------------------------------
    useEffect(() => {
        const loadDailyFacts = async () => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) return;

                // Check if user already completed today's challenge
                const userRef = doc(db, "users", currentUser.uid);
                const userSnap = await getDoc(userRef);
                const userData = userSnap.data();
                const today = new Date().toISOString().split("T")[0];

                if (userData?.dailyCompletedDate === today) {
                    setScreenState("already_done");
                    return;
                }

                // Get today's 5 cached fact IDs (or generate new ones)
                const selectedIds = await getDailyFacts();

                // Fetch all daily facts from Firestore
                const factsRef = collection(db, "categories", "daily", "facts");
                const snapshot = await getDocs(factsRef);

                // Filter to only today's selected facts
                const allFacts: Fact[] = snapshot.docs.map((d) => ({
                    id: d.id,
                    ...(d.data() as Omit<Fact, "id">),
                }));

                const todaysFacts = allFacts.filter((f) =>
                    selectedIds.includes(f.id)
                );

                setFacts(todaysFacts);
                setScreenState("question");
            } catch (error) {
                console.error("Failed to load daily facts:", error);
            }
        };

        loadDailyFacts();
    }, []);

    // -------------------------------------------------------------------------
    // submitAnswer — records answer and advances state
    // -------------------------------------------------------------------------
    const submitAnswer = async (
        userAnswer: boolean,
        source: "swipe" | "button" = "button"
    ) => {
        const currentQuestion = facts[currentIndex];
        const isCorrect = userAnswer === currentQuestion.isFact;
        const newCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0);

        try {
            const streakBonus = await recordAnswer(
                isCorrect,
                "Daily",
                source
            );

            setLastAnswerCorrect(isCorrect);
            setLastStreakBonus(streakBonus);
            setCorrectAnswers(newCorrectAnswers);
            setScreenState("feedback");

        } catch (error) {
            console.error("Failed to record answer:", error);
        }
    };

    // -------------------------------------------------------------------------
    // advanceToNext — moves from feedback to next question or results
    // -------------------------------------------------------------------------
    const advanceToNext = async () => {
        const isLastQuestion = currentIndex === facts.length - 1;

        if (isLastQuestion) {
            // Award completion and bonus XP
            await recordDailyChallengeCompleted(correctAnswers);
            await recordDailyBonus();
            setScreenState("results");
        } else {
            setCurrentIndex(currentIndex + 1);
            setScreenState("question");
        }
    };

    // -------------------------------------------------------------------------
    // Loading state
    // -------------------------------------------------------------------------
    if (screenState === "loading") {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>
                    {"Loading today's challenge…"}
                </Text>
            </SafeAreaView>
        );
    }

    // -------------------------------------------------------------------------
    // Already completed today
    // -------------------------------------------------------------------------
    if (screenState === "already_done") {
        return (
            <SafeAreaView style={styles.center}>
                <Star size={54} color={Colors.primary} />
                <Text style={styles.noFactsTitle}>
                    Challenge Complete!
                </Text>
                <Text style={styles.noFactsText}>
                    {"You've already completed today's challenge.\nCome back tomorrow for a new one!"}
                </Text>
                <Pressable
                    style={styles.homeButton}
                    onPress={() => router.replace("/(tabs)")}
                >
                    <Text style={styles.homeButtonText}>Return Home</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    // -------------------------------------------------------------------------
    // Results state — shown after all 5 facts answered
    // -------------------------------------------------------------------------
    if (screenState === "results") {
        const accuracy = Math.round((correctAnswers / facts.length) * 100);

        return (
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.resultsContent}>

                    <View style={styles.resultsHeader}>
                        <Star size={72} color={Colors.primary} />
                        <Text style={styles.resultsTitle}>
                            Challenge Complete!
                        </Text>
                        <Text style={styles.resultsSubtitle}>
                            Daily Challenge • {facts.length} Questions
                        </Text>
                    </View>

                    {/* Bonus XP banner */}
                    <View style={styles.bonusBanner}>
                        <Star size={18} color={Colors.surface} />
                        <Text style={styles.bonusText}>
                            +500 Daily Challenge Bonus XP!
                        </Text>
                    </View>

                    {/* Score summary */}
                    <View style={styles.scoreSummary}>
                        <Text style={styles.scoreText}>
                            {correctAnswers} / {facts.length} Correct
                        </Text>
                        <Text style={styles.accuracyText}>
                            {accuracy}% Accuracy
                        </Text>
                    </View>

                    <Pressable
                        style={styles.homeButton}
                        onPress={() => router.replace("/(tabs)")}
                    >
                        <Text style={styles.homeButtonText}>Return Home</Text>
                    </Pressable>

                </ScrollView>
            </SafeAreaView>
        );
    }

    // -------------------------------------------------------------------------
    // Feedback state — shown after each answer
    // -------------------------------------------------------------------------
    if (screenState === "feedback") {
        const currentQuestion = facts[currentIndex];
        const baseXP = lastAnswerCorrect ? 15 : 0;
        const totalXP = baseXP + lastStreakBonus;

        return (
            <SafeAreaView style={[
                styles.feedbackContainer,
                {
                    backgroundColor: lastAnswerCorrect
                        ? "#EDF9F4"
                        : "#FDF2F2"
                }
            ]}>
                <ScrollView contentContainerStyle={styles.feedbackContent}>

                    <View style={styles.feedbackInner}>

                        {/* Correct/incorrect icon */}
                        <View style={[
                            styles.feedbackIcon,
                            {
                                backgroundColor: lastAnswerCorrect
                                    ? Colors.success
                                    : Colors.error,
                                shadowColor: lastAnswerCorrect
                                    ? Colors.success
                                    : Colors.error,
                            }
                        ]}>
                            {lastAnswerCorrect ? (
                                <Check
                                    size={54}
                                    color={Colors.surface}
                                    strokeWidth={3.5}
                                />
                            ) : (
                                <X
                                    size={54}
                                    color={Colors.surface}
                                    strokeWidth={3.5}
                                />
                            )}
                        </View>

                        {/* Result label */}
                        <Text style={[
                            styles.feedbackLabel,
                            {
                                color: lastAnswerCorrect
                                    ? Colors.success
                                    : Colors.error
                            }
                        ]}>
                            {lastAnswerCorrect ? "Correct!" : "Incorrect!"}
                        </Text>

                        {/* XP earned */}
                        <Text style={styles.feedbackXP}>
                            {lastAnswerCorrect
                                ? lastStreakBonus > 0
                                    ? `+${totalXP} XP earned (${lastStreakBonus} streak bonus!)`
                                    : "+15 XP earned"
                                : "No XP earned"}
                        </Text>

                        {/* Answer card */}
                        <AnswerCard
                            isCorrect={lastAnswerCorrect}
                            answer={currentQuestion.isFact ? "FACT" : "MYTH"}
                            statement={currentQuestion.statement}
                        />

                        {/* Explanation */}
                        <FactExplanation
                            title={lastAnswerCorrect
                                ? "Did you know?"
                                : "The correct answer"}
                            description={currentQuestion.explanation}
                        />

                    </View>

                    {/* Next button */}
                    <Pressable
                        style={styles.nextButton}
                        onPress={advanceToNext}
                    >
                        <Text style={styles.nextButtonText}>
                            {currentIndex === facts.length - 1
                                ? "View Results →"
                                : "Next Question →"}
                        </Text>
                    </Pressable>

                </ScrollView>
            </SafeAreaView>
        );
    }

    // -------------------------------------------------------------------------
    // Question state — the main gameplay view
    // -------------------------------------------------------------------------
    const currentQuestion = facts[currentIndex];

    return (
        <SafeAreaView style={styles.container}>

            {/* Top bar — no back button during questions to prevent skipping */}
            <QuestionProgress
                category="Daily Challenge"
                current={currentIndex + 1}
                total={facts.length}
                onBack={() => router.replace("/(tabs)")}
            />

            {/* Swipeable card — right = Fact, left = Myth */}
            <View style={styles.content}>
                <SwipeableQuestionCard
                    onSwipeRight={() => submitAnswer(true, "swipe")}
                    onSwipeLeft={() => submitAnswer(false, "swipe")}
                >
                    <QuestionCard
                        category="Daily Challenge"
                        question={currentQuestion.statement}
                    />
                </SwipeableQuestionCard>
            </View>

            {/* Swipe direction hint */}
            <SwipeHint />

            {/* Tap buttons as alternative to swiping */}
            <View style={styles.buttonRow}>
                <AnswerButton
                    answer="myth"
                    onPress={() => submitAnswer(false, "button")}
                />
                <AnswerButton
                    answer="fact"
                    onPress={() => submitAnswer(true, "button")}
                />
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surface,
        padding: Spacing.lg,
    },

    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    // Used by loading, already_done states
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.surface,
        padding: Spacing.lg,
        gap: Spacing.md,
    },

    loadingText: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },

    noFactsTitle: {
        ...Typography.h3,
        color: Colors.primaryDark,
        textAlign: "center",
    },

    noFactsText: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: "center",
        lineHeight: 24,
    },

    // Swipeable card container
    content: {
        flex: 1,
        justifyContent: "center",
    },

    // Myth / Fact button row
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: Spacing.lg,
        marginBottom: Spacing.lg,
    },

    // ---- Feedback screen styles ----
    feedbackContainer: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
    },

    feedbackContent: {
        paddingBottom: Spacing.xl,
    },

    feedbackInner: {
        alignItems: "center",
        paddingTop: Spacing.xl,
    },

    feedbackIcon: {
        alignItems: "center",
        justifyContent: "center",
        width: 92,
        height: 92,
        borderRadius: 28,
        shadowOpacity: 0.16,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 12 },
        elevation: 6,
    },

    feedbackLabel: {
        ...Typography.h1,
        textAlign: "center",
        marginTop: Spacing.md,
    },

    feedbackXP: {
        textAlign: "center",
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
        marginBottom: Spacing.md,
    },

    nextButton: {
        height: 60,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        shadowColor: Colors.shadow,
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 5,
        marginTop: Spacing.lg,
    },

    nextButtonText: {
        ...Typography.title,
        color: Colors.surface,
    },

    // ---- Results screen styles ----
    resultsContent: {
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },

    resultsHeader: {
        alignItems: "center",
        paddingVertical: Spacing.xxl,
    },

    resultsTitle: {
        ...Typography.h1,
        color: Colors.primaryDark,
        marginTop: Spacing.lg,
    },

    resultsSubtitle: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
    },

    bonusBanner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: Spacing.xs,
        backgroundColor: Colors.cardDaily,
        borderRadius: 16,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
    },

    bonusText: {
        ...Typography.caption,
        color: Colors.surface,
        fontWeight: "700",
    },

    scoreSummary: {
        alignItems: "center",
        backgroundColor: Colors.surface,
        borderRadius: 24,
        padding: Spacing.xl,
        marginBottom: Spacing.lg,
        shadowColor: Colors.shadow,
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 5,
    },

    scoreText: {
        ...Typography.h2,
        color: Colors.primaryDark,
    },

    accuracyText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
    },

    homeButton: {
        height: 60,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        shadowColor: Colors.shadow,
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 5,
    },

    homeButtonText: {
        ...Typography.title,
        color: Colors.surface,
    },
});
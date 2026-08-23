import { SafeAreaView, StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import {
    collection,
    doc,
    getDocs,
} from "firebase/firestore";
import { db } from "@/app/services/config";
import { useState, useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

// Components
import QuestionProgress from "@/components/gameplay/QuestionProgress";
import SwipeableQuestionCard from "@/components/gameplay/SwipeableQuestionCard";
import QuestionCard from "@/components/cards/QuestionCard";
import SwipeHint from "@/components/gameplay/SwipeHint";
import AnswerButton from "@/components/gameplay/AnswerButton";
import { recordAnswer, getDailyFacts, recordDailyChallengeCompleted } from "@/app/services/stats";

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
// DailyGameplayScreen (file: app/game/daily.tsx)
// ---------------------------------------------------------------------------
// The daily challenge gameplay loop.
// Fetches today's 5 randomly selected facts from the daily pool,
// then runs the same swipe-based gameplay as the regular category screen.
// Rewards +500 XP on completion and tracks daily challenge achievements.
// ---------------------------------------------------------------------------
export default function DailyGameplayScreen() {
    const [facts, setFacts] = useState<Fact[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    const router = useRouter();

    // -------------------------------------------------------------------------
    // Load today's daily facts on mount
    // -------------------------------------------------------------------------
    useEffect(() => {
        const loadDailyFacts = async () => {
            try {
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
            } catch (error) {
                console.error("Failed to load daily facts:", error);
            } finally {
                setLoading(false);
            }
        };

        loadDailyFacts();
    }, []);

    // -------------------------------------------------------------------------
    // Loading state
    // -------------------------------------------------------------------------
    if (loading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading today's challenge…</Text>
            </SafeAreaView>
        );
    }

    // -------------------------------------------------------------------------
    // Empty state
    // -------------------------------------------------------------------------
    if (facts.length === 0) {
        return (
            <SafeAreaView style={styles.center}>
                <Text style={styles.noFactsTitle}>No challenge today</Text>
                <Text style={styles.noFactsText}>
                    Check back tomorrow for a new challenge.
                </Text>
            </SafeAreaView>
        );
    }

    // -------------------------------------------------------------------------
    // Bounds check
    // -------------------------------------------------------------------------
    if (currentIndex >= facts.length) {
        return (
            <SafeAreaView style={styles.center}>
                <Text style={styles.noFactsText}>No more questions.</Text>
            </SafeAreaView>
        );
    }

    const currentQuestion = facts[currentIndex];
    const isLastQuestion = currentIndex === facts.length - 1;

    // -------------------------------------------------------------------------
    // submitAnswer
    // -------------------------------------------------------------------------
    // Same logic as [category].tsx but navigates to daily feedback
    // and awards bonus XP on completion.
    // -------------------------------------------------------------------------
    const submitAnswer = async (
        userAnswer: boolean,
        source: "swipe" | "button" = "button"
    ) => {
        const isCorrect = userAnswer === currentQuestion.isFact;
        const newCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0);

        try {
            // Record the answer — XP, streak, level check
            const streakBonus = await recordAnswer(
                isCorrect,
                "Daily",
                source
            );

            if (isLastQuestion) {
                // Record daily challenge completion and check achievements
                await recordDailyChallengeCompleted(newCorrectAnswers);

                // Navigate to results with daily flag and bonus XP
                router.replace({
                    pathname: "/game/results",
                    params: {
                        category: "Daily Challenge",
                        totalQuestions: String(facts.length),
                        correctAnswers: String(newCorrectAnswers),
                        isDailyChallenge: "true",
                    },
                });
            } else {
                // Navigate to feedback then next question
                router.push({
                    pathname: "/game/feedback",
                    params: {
                        correct: String(isCorrect),
                        statement: currentQuestion.statement,
                        explanation: currentQuestion.explanation,
                        category: "Daily Challenge",
                        currentIndex: String(currentIndex),
                        totalQuestions: String(facts.length),
                        correctAnswers: String(newCorrectAnswers),
                        isLastQuestion: String(isLastQuestion),
                        isFact: String(currentQuestion.isFact),
                        streakBonus: String(streakBonus),
                        isDailyChallenge: "true",
                    },
                });
            }

            // Update local state for next question
            setCurrentIndex(currentIndex + 1);
            setCorrectAnswers(newCorrectAnswers);

        } catch (error) {
            console.error("Failed to record answer:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>

            {/* Top bar: back button + challenge name + progress */}
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

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.surface,
        padding: Spacing.lg,
        gap: Spacing.sm,
    },

    loadingText: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },

    noFactsTitle: {
        ...Typography.h3,
        color: Colors.primaryDark,
        marginBottom: Spacing.xs,
    },

    noFactsText: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: "center",
    },

    content: {
        flex: 1,
        justifyContent: "center",
    },

    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: Spacing.lg,
        marginBottom: Spacing.lg,
    },
});
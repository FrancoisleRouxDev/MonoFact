import { SafeAreaView, StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    collection,
    getDocs,
    query,
    orderBy,
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
import { recordAnswer, saveLastPosition } from "@/app/services/stats";

// ---------------------------------------------------------------------------
// Fact type — matches the Firestore document structure under
// categories/{categoryId}/facts/{factId}
// ---------------------------------------------------------------------------
type Fact = {
    id: string;
    category: string;
    statement: string;  // the question text shown on the card
    isFact: boolean;    // true = fact, false = myth — this is the correct answer
    explanation: string; // shown on the feedback screen after answering
    order: number;      // determines the question sequence
};

// ---------------------------------------------------------------------------
// GameplayScreen (file: app/game/[category].tsx)
// ---------------------------------------------------------------------------
// The core gameplay loop for a single category round.
//
// Route params:
//   category       — the category name (e.g. "Nature", "Space")
//   index          — which question to start at (0-based); used for "continue"
//   correctAnswers — running score passed through from previous questions
//
// Flow:
//   1. Load all facts for this category from Firestore (ordered by `order`)
//   2. Show one question at a time via SwipeableQuestionCard
//   3. User swipes right (Fact) or left (Myth) — or taps the buttons
//   4. Record the answer in Firestore, then navigate to /game/feedback
//   5. feedback.tsx navigates back here with index+1 until the last question
//   6. After the last question, feedback.tsx navigates to /game/results
// ---------------------------------------------------------------------------
export default function GameplayScreen() {
    const [facts, setFacts] = useState<Fact[]>([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const {
        category,
        index,
        correctAnswers,
    } = useLocalSearchParams();

    const categoryName = String(category);

    // Which question we're currently on (0-based index into facts array).
    const currentIndex = Number(index ?? 0);

    // Running count of correct answers carried forward from previous questions.
    const currentCorrectAnswers = Number(correctAnswers ?? 0);

    // -------------------------------------------------------------------------
    // Load facts from Firestore on mount (re-runs if category changes).
    // Facts are ordered by the `order` field so questions are always consistent.
    // -------------------------------------------------------------------------
    useEffect(() => {
        const loadFacts = async () => {
            try {
                // Firestore path: categories/{lowercase-category}/facts
                const categoryId = categoryName.toLowerCase();

                const factsRef = collection(
                    db,
                    "categories",
                    categoryId,
                    "facts"
                );

                const q = query(factsRef, orderBy("order"));
                const snapshot = await getDocs(q);

                const loadedFacts: Fact[] = snapshot.docs.map((document) => ({
                    id: document.id,
                    ...(document.data() as Omit<Fact, "id">),
                }));

                setFacts(loadedFacts);
            } catch (error) {
                console.error("Failed to load facts:", error);
            } finally {
                setLoading(false);
            }
        };

        loadFacts();
    }, [category]);

    // -------------------------------------------------------------------------
    // Loading state — shown while Firestore fetch is in progress.
    // -------------------------------------------------------------------------
    if (loading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading facts…</Text>
            </SafeAreaView>
        );
    }

    // -------------------------------------------------------------------------
    // Empty state — shown if no facts exist for this category in Firestore.
    // -------------------------------------------------------------------------
    if (facts.length === 0) {
        return (
            <SafeAreaView style={styles.center}>
                <Text style={styles.noFactsTitle}>No facts found</Text>
                <Text style={styles.noFactsText}>
                    No facts were found for {categoryName}.
                </Text>
            </SafeAreaView>
        );
    }

    // -------------------------------------------------------------------------
    // Bounds check — prevents a crash if currentIndex somehow exceeds the array.
    // -------------------------------------------------------------------------
    if (currentIndex >= facts.length) {
        return (
            <SafeAreaView style={styles.center}>
                <Text style={styles.noFactsText}>No more questions.</Text>
            </SafeAreaView>
        );
    }

    const currentQuestion = facts[currentIndex];

    // True when we're on the very last question in the array.
    const isLastQuestion = currentIndex === facts.length - 1;

    // -------------------------------------------------------------------------
    // submitAnswer
    // -------------------------------------------------------------------------
    // Called when the user swipes or taps a button.
    //   userAnswer: true = "Fact", false = "Myth"
    //
    // 1. Checks if the answer is correct
    // 2. Writes the result to Firestore (XP, streaks, category stats)
    // 3. Navigates to the feedback screen with all the data it needs
    // -------------------------------------------------------------------------
    const submitAnswer = async (userAnswer: boolean) => {
        const isCorrect = userAnswer === currentQuestion.isFact;

        const newCorrectAnswers =
            currentCorrectAnswers + (isCorrect ? 1 : 0);

        try {
            // recordAnswer handles XP, streak, level-up, and category stats.
            // It returns the streak bonus earned this answer (0 if no bonus).
            const streakBonus = await recordAnswer(
                isCorrect,
                currentQuestion.category
            );

            router.push({
                pathname: "/game/feedback",
                params: {
                    correct: String(isCorrect),
                    statement: currentQuestion.statement,
                    explanation: currentQuestion.explanation,
                    category: categoryName,
                    currentIndex: String(currentIndex),
                    totalQuestions: String(facts.length),
                    correctAnswers: String(newCorrectAnswers),
                    isLastQuestion: String(isLastQuestion),
                    isFact: String(currentQuestion.isFact),
                    streakBonus: String(streakBonus),
                },
            });
        } catch (error) {
            console.error("Failed to record answer:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>

            {/* Top bar: back button + category name + progress indicator */}
            <QuestionProgress
                category={categoryName}
                current={currentIndex + 1}
                total={facts.length}
                onBack={async () => {
                    // Save position so the user can continue from here later.
                    await saveLastPosition(categoryName, currentIndex);
                    router.replace("/(tabs)/play");
                }}
            />

            {/* Swipeable card — right = Fact, left = Myth */}
            <View style={styles.content}>
                <SwipeableQuestionCard
                    onSwipeRight={() => submitAnswer(true)}
                    onSwipeLeft={() => submitAnswer(false)}
                >
                    <QuestionCard
                        category={currentQuestion.category}
                        question={currentQuestion.statement}
                    />
                </SwipeableQuestionCard>
            </View>

            {/* Swipe direction hint shown below the card */}
            <SwipeHint />

            {/* Tap buttons as an alternative to swiping */}
            <View style={styles.buttonRow}>
                <AnswerButton
                    answer="myth"
                    onPress={() => submitAnswer(false)}
                />
                <AnswerButton
                    answer="fact"
                    onPress={() => submitAnswer(true)}
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

    // Used by loading, empty, and bounds-exceeded states
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

    // Container for the swipeable card — centres it vertically
    content: {
        flex: 1,
        justifyContent: "center",
    },

    // Row holding the Myth and Fact tap buttons at the bottom
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: Spacing.lg,
        marginBottom: Spacing.lg,
    },
});
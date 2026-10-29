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
import {
    CARD_COUNT_OPTIONS,
    Fact,
    buildDeck,
    getDeckSession,
    restoreDeckSession,
    saveDeckSession,
} from "@/app/services/deck";

// Components
import QuestionProgress from "@/components/gameplay/QuestionProgress";
import SwipeableQuestionCard from "@/components/gameplay/SwipeableQuestionCard";
import QuestionCard from "@/components/cards/QuestionCard";
import SwipeHint from "@/components/gameplay/SwipeHint";
import AnswerButton from "@/components/gameplay/AnswerButton";
import CardCountSelector from "@/components/gameplay/CardCountSelector";
import { recordAnswer, saveLastPosition } from "@/app/services/stats";

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
//   1. Load the full fact pool for this category from Firestore
//   2. Player picks a card count (10 / 25 / 50 / 100); the pool is shuffled
//      (Fisher-Yates) and sliced to that count to form this round's deck.
//      The deck is kept in services/deck.ts because this screen is re-mounted
//      for every question; resuming reuses the saved deck instead.
//   3. Show one question at a time via SwipeableQuestionCard
//   4. User swipes right (Fact) or left (Myth) — or taps the buttons
//   5. Record the answer in Firestore, then navigate to /game/feedback
//   6. feedback.tsx navigates back here with index+1 until the last question
//   7. After the last question, feedback.tsx navigates to /game/results
// ---------------------------------------------------------------------------
export default function GameplayScreen() {
    // Full fact pool for the category (only loaded when a new deck is needed).
    const [pool, setPool] = useState<Fact[]>([]);
    // The shuffled cards for this round; null until the player has picked a count.
    const [facts, setFacts] = useState<Fact[] | null>(null);
    const [selectedCount, setSelectedCount] = useState<number>(25);
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
    // On mount (re-runs if category changes):
    //   - Mid-round (index param present): reuse the deck drawn at round start —
    //     from memory, or rebuilt from storage after an app restart.
    //   - Otherwise load the fact pool so the card count selector can draw a deck.
    // -------------------------------------------------------------------------
    useEffect(() => {
        const loadFacts = async () => {
            const isResuming = index !== undefined;

            try {
                if (isResuming) {
                    const existing = getDeckSession(categoryName);
                    if (existing) {
                        setFacts(existing);
                        return;
                    }
                }

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

                setPool(loadedFacts);
                // Default to the largest offered count up to 25 that the pool can supply.
                setSelectedCount(
                    CARD_COUNT_OPTIONS.filter(
                        (count) => count <= Math.min(25, loadedFacts.length)
                    ).pop() ?? loadedFacts.length
                );

                if (isResuming) {
                    const restored = await restoreDeckSession(categoryName, loadedFacts);
                    if (restored) {
                        setFacts(restored);
                    } else {
                        // The saved deck is gone, so the saved position is
                        // meaningless — start over from the card count selector.
                        router.setParams({ index: "0", correctAnswers: "0" });
                    }
                }
            } catch (error) {
                console.error("Failed to load facts:", error);
            } finally {
                setLoading(false);
            }
        };

        loadFacts();
    }, [categoryName]);

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
    if (!facts && pool.length === 0) {
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
    // Pre-game screen — pick how many cards to play, then draw the deck.
    // -------------------------------------------------------------------------
    if (!facts) {
        const options = CARD_COUNT_OPTIONS.filter((count) => count <= pool.length);
        const availableOptions = options.length > 0 ? options : [pool.length];

        return (
            <SafeAreaView style={styles.container}>
                <CardCountSelector
                    category={categoryName}
                    poolSize={pool.length}
                    options={availableOptions}
                    selected={selectedCount}
                    onSelect={setSelectedCount}
                    onStart={async () => {
                        const deck = buildDeck(pool, selectedCount);
                        await saveDeckSession(categoryName, deck);
                        setFacts(deck);
                    }}
                    onBack={() => router.replace("/(tabs)/play")}
                />
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
    const submitAnswer = async (
        userAnswer: boolean,
        source: "swipe" | "button" = "button",
    ) => {
        const isCorrect = userAnswer === currentQuestion.isFact;

        const newCorrectAnswers =
            currentCorrectAnswers + (isCorrect ? 1 : 0);

        try {
            // recordAnswer handles XP, streak, level-up, and category stats.
            // It returns the streak bonus earned this answer (0 if no bonus).
            const streakBonus = await recordAnswer(
                isCorrect,
                currentQuestion.category,
                source,
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
                    onSwipeRight={() => submitAnswer(true, "swipe")}
                    onSwipeLeft={() => submitAnswer(false, "swipe")}
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
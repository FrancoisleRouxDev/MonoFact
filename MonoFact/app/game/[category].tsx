import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    collection,
    getDocs,
    query,
    orderBy,
} from "firebase/firestore";
import { db } from "@/app/services/config";
import { useState, useEffect } from "react";

// Components
import QuestionProgress from "@/components/gameplay/QuestionProgress";
import SwipeableQuestionCard from "@/components/gameplay/SwipeableQuestionCard";
import QuestionCard from "@/components/cards/QuestionCard";
import SwipeHint from "@/components/gameplay/SwipeHint";
import AnswerButton from "@/components/gameplay/AnswerButton";
import { recordAnswer, recordStreak, } from "@/app/services/stats";

type Fact = {
    id: string;
    category: string;
    statement: string;
    isFact: boolean;
    explanation: string;
    order: number;
};

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

    // Which question are we currently on?
    const currentIndex = Number(index ?? 0);

    // Current score
    const currentCorrectAnswers = Number(correctAnswers ?? 0);

    useEffect(() => {
        const loadFacts = async () => {
            try {
                const categoryId = String(category).toLowerCase();

                console.log("Loading facts from category:", categoryId);

                const factsRef = collection(
                    db,
                    "categories",
                    categoryId,
                    "facts"
                );

                const q = query(
                    factsRef,
                    orderBy("order")
                );

                const snapshot = await getDocs(q);

                console.log("Number of facts found:", snapshot.size);

                const loadedFacts: Fact[] = snapshot.docs.map((document) => ({
                    id: document.id,
                    ...(document.data() as Omit<Fact, "id">),
                }));

                console.log("Loaded facts:", loadedFacts);

                setFacts(loadedFacts);
            } catch (error) {
                console.error("Failed to load facts:", error);
            } finally {
                setLoading(false);
            }
        };

        loadFacts();
    }, [category]);

    if (loading) {
        return (
            <SafeAreaView style={styles.center}>
                <Text>Loading facts...</Text>
            </SafeAreaView>
        );
    }

    if (facts.length === 0) {
        return (
            <SafeAreaView style={styles.center}>
                <Text style={styles.noFactsTitle}>
                    No facts found
                </Text>

                <Text style={styles.noFactsText}>
                    No facts were found for {categoryName}.
                </Text>
            </SafeAreaView>
        );
    }

    // Make sure the index is valid
    if (currentIndex >= facts.length) {
        return (
            <SafeAreaView style={styles.center}>
                <Text>No more questions.</Text>
            </SafeAreaView>
        );
    }

    const currentQuestion = facts[currentIndex];

    // Is this the final question?
    const isLastQuestion =
        currentIndex === facts.length - 1;

    const submitAnswer = async (userAnswer: boolean) => {

        const isCorrect =
            userAnswer === currentQuestion.isFact;

        const newCorrectAnswers =
            currentCorrectAnswers +
            (isCorrect ? 1 : 0);

        try {

            await recordAnswer(
                isCorrect,
                currentQuestion.category
            );

            await recordStreak(
                isCorrect
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
                },
            });

        } catch (error) {

            console.error(
                "Failed to record answer:",
                error
            );

        }
    };

    return (
        <SafeAreaView style={styles.container}>

            <QuestionProgress
                category={categoryName}
                current={currentIndex + 1}
                total={facts.length}
                onBack={() => router.back()}
            />

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

            <SwipeHint />

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
        backgroundColor: "#fff",
        padding: 20,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 20,
    },

    noFactsTitle: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 8,
    },

    noFactsText: {
        fontSize: 16,
    },

    content: {
        flex: 1,
        justifyContent: "center",
    },

    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        marginBottom: 20,
    },
});
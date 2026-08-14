import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";

import { collection, getDocs, query, where, orderBy, } from "firebase/firestore";
import { db } from "@/app/services/config";
import { useState, useEffect } from "react";

//components
import QuestionProgress from "@/components/gameplay/QuestionProgress";
import SwipeableQuestionCard from "@/components/gameplay/SwipeableQuestionCard";
import QuestionCard from "@/components/cards/QuestionCard";
import SwipeHint from "@/components/gameplay/SwipeHint";
import AnswerButton from "@/components/gameplay/AnswerButton";


export default function GameplayScreen() {

    type Fact = {
        id: string;
        category: string;
        statement: string;
        isFact: boolean;
        explanation: string;
        order: number;
    };

    const [facts, setFacts] = useState<Fact[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const { category } = useLocalSearchParams();
    console.log("Category:", category);

    //     const currentQuestion = facts[currentIndex];
    // const currentQuestion = questions[currentIndex];

    const loadFacts = async () => {
        try {
            console.log("Loading category:", String(category));

            const snapshot = await getDocs(collection(db, "facts"));

            console.log("Documents found:", snapshot.size);

            const loadedFacts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<Fact, "id">),
            }));

            console.log("All facts:");
            console.log(loadedFacts);

            const filtered = loadedFacts.filter(
                fact => fact.category === String(category)
            );

            console.log("Filtered facts:");
            console.log(filtered);

            setFacts(filtered);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return null;

    if (facts.length === 0) {
        return (
            <SafeAreaView>
                <Text>No facts found.</Text>
            </SafeAreaView>
        );
    }
    const currentQuestion = facts[currentIndex];

    const submitAnswer = (userAnswer: boolean) => {

        const isCorrect = userAnswer === currentQuestion.isFact;

        router.push({
            pathname: "/game/feedback",
            params: {
                correct: String(isCorrect),
                statement: currentQuestion.statement,
                explanation: currentQuestion.explanation,
            },
        });
    };

    return (
        <SafeAreaView style={styles.container}>

            <QuestionProgress
                category={String(category)}
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
                    answer="fact"
                    onPress={() => submitAnswer(true)}
                />

                <AnswerButton
                    answer="myth"
                    onPress={() => submitAnswer(false)}
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
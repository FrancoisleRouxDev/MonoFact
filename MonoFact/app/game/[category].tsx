import { SafeAreaView, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";


//components
import QuestionProgress from "@/components/gameplay/QuestionProgress";
import SwipeableQuestionCard from "@/components/gameplay/SwipeableQuestionCard";
import QuestionCard from "@/components/cards/QuestionCard";
import SwipeHint from "@/components/gameplay/SwipeHint";
import AnswerButton from "@/components/gameplay/AnswerButton";

export default function GameplayScreen() {

    const router = useRouter();

    const { category } = useLocalSearchParams();

    const currentQuestion = {
        category: String(category),
        question: "Bees can recognize human faces and remember them for several days.",
    };

    //     const currentQuestion = facts[currentIndex];
    // const currentQuestion = questions[currentIndex];

    return (
        <SafeAreaView style={styles.container}>

            <QuestionProgress 
                category={String(category)}
                current={1}
                total={5}
                onBack={() => router.back()}    
            />

            <View style={styles.content}>

                <SwipeableQuestionCard

                                onSwipeLeft={() =>
                                router.push({
                                    pathname: "/game/feedback",
                                    params: {
                                    correct: "false",
                                    statement: currentQuestion.question,
                                    explanation:
                                        "Bees use configural processing to recognise faces.",
                                    },
                                })
                                }

                                onSwipeRight={() =>
                                router.push({
                                    pathname: "/game/feedback",
                                    params: {
                                    correct: "true",
                                    statement: currentQuestion.question,
                                    explanation:
                                        "Bees use configural processing to recognise faces.",
                                    },
                                })
                                }

                >

                    <QuestionCard
                        category={currentQuestion.category}
                        question={currentQuestion.question}
                    />

                </SwipeableQuestionCard>

            </View>

            <SwipeHint />

            <View style={styles.buttonRow}>

                <AnswerButton
                    answer="myth"
                    onPress={() => {
                        router.push({
                            pathname: "/game/feedback",
                            params: {
                                correct: "false",
                                statement: currentQuestion.question,
                                explanation:
                                    "Bees use configural processing to recognise faces.",
                            },
                        });
                    }}
                />

                <AnswerButton
                    answer="fact"
                    onPress={() => {
                        router.push({
                            pathname: "/game/feedback",
                            params: {
                                correct: "true",
                                statement: currentQuestion.question,
                                explanation:
                                    "Bees use configural processing to recognise faces.",
                            },
                        });
                    }}
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
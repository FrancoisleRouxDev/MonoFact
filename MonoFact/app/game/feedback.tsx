import { SafeAreaView, View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Check } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

import AnswerCard from "@/components/cards/AnswerCard";
import FactExplanation from "@/components/gameplay/FactExplanation";


export default function ResultsScreen() {

    const router = useRouter();

    const {
        correct,
        statement,
        explanation,
        category,
        currentIndex,
        totalQuestions,
        correctAnswers,
        isLastQuestion,
    } = useLocalSearchParams();

    const wasCorrect = correct === "true";

    const currentQuestion = Number(currentIndex ?? 0);
    const total = Number(totalQuestions ?? 0);
    const score = Number(correctAnswers ?? 0);

    const lastQuestion = isLastQuestion === "true";

    const xpEarned = wasCorrect ? 10 : 0;

    return (

        <SafeAreaView style={styles.container}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                <View style={styles.content}>

                    <View style={styles.icon}>

                        <Check size={54} color={Colors.surface} strokeWidth={3.5} />

                    </View>

                    <Text style={styles.correct}>

                        {wasCorrect ? "Correct!" : "Incorrect!"}

                    </Text>

                    <Text style={styles.xp}>

                        {wasCorrect ? "+10 XP earned" : "No XP earned"}

                    </Text>

                    <AnswerCard
                        isCorrect={wasCorrect}
                        answer={wasCorrect ? "FACT" : "MYTH"}
                        statement={String(statement)}
                    />

                    <FactExplanation
                        title={wasCorrect ? "Did you know?" : "The correct answer"}
                        description={String(explanation)}
                    />

                </View>

                <Pressable
                    style={styles.button}
                    onPress={() => {

                        if (lastQuestion) {

                            router.replace({
                                pathname: "/game/results",
                                params: {
                                    category: String(category),
                                    totalQuestions: String(total),
                                    correctAnswers: String(score),
                                },
                            });

                        } else {

                            router.replace({
                                pathname: "/game/[category]",
                                params: {
                                    category: String(category),
                                    index: String(currentQuestion + 1),
                                    correctAnswers: String(score),
                                    totalQuestions: String(total),
                                },
                            });

                        }
                    }}
                >
                    <Text style={styles.buttonText}>
                        {lastQuestion
                            ? "View Results →"
                            : "Next Question →"}
                    </Text>
                </Pressable>

            </ScrollView>

        </SafeAreaView>

    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        backgroundColor: "#EDF9F4",
    },

    content: {
        flex: 1,
        alignItems: "center",
        paddingTop: Spacing.xl,
    },

    scrollContent: {
        paddingBottom: Spacing.xl,
    },

    icon: {
        alignItems: "center",
        justifyContent: "center",
        width: 92,
        height: 92,
        borderRadius: 28,
        backgroundColor: Colors.cardDaily,
        shadowColor: Colors.success,
        shadowOpacity: 0.16,
        shadowRadius: 20,
        shadowOffset: {
            width: 0,
            height: 12,
        },
        elevation: 6,
    },

    correct: {
        ...Typography.h1,
        color: Colors.cardDaily,
        textAlign: "center",
        marginTop: Spacing.md,
    },

    xp: {
        textAlign: "center",
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
        marginBottom: Spacing.md,
    },

    button: {
        height: 60,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        shadowColor: Colors.shadow,
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        elevation: 5,
        marginTop: Spacing.lg,
    },

    buttonText: {
        ...Typography.title,
        color: Colors.surface,
    }

});
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
        question: "Bess can recognize human faces and remember them for several days.",
    };

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

                    onSwipeLeft={() => {

                        router.push("/game/result");

                    }}

                    onSwipeRight={() => {

                        router.push("/game/result");

                    }}

                >

                    <QuestionCard

                        category="Science"

                        question="Bees recognize faces."

                    />

                </SwipeableQuestionCard>

            </View>

            <SwipeHint />

            <View style={styles.buttonRow}>

                    <AnswerButton
                        answer="myth"
                        onPress={() => router.push("/game/result")}
                    />

                    <AnswerButton
                        answer="fact"
                        onPress={() => router.push("/game/result")}
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
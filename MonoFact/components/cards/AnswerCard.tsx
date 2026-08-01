import { View, Text, StyleSheet } from "react-native";
import { Check, X } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";


type Props = {
    isCorrect: boolean;
    statement: string;
    answer: "MYTH" | "FACT";
};

export default function AnswerCard({
    isCorrect,
    statement,
    answer,
}: Props) {

    return (
        <View style={styles.card}>

            <View style={styles.header}>

                {isCorrect ? (
                    <View style={styles.iconBubble}>
                        <Check size={14} color={Colors.cardDaily} />
                    </View>
                ) : (
                    <View style={[styles.iconBubble, styles.iconBubbleWrong]}>
                        <X size={14} color={Colors.error} />
                    </View>
                )}

                <Text style={styles.answer}>
                    THIS IS A {answer}
                </Text>

            </View>

            <Text style={styles.statement}>
                {statement}
            </Text>

        </View>
    );
}

const styles = StyleSheet.create({

    card:{
        backgroundColor: Colors.surface,
        borderRadius: 26,
        padding: Spacing.lg,
        marginTop: Spacing.sm,
        shadowColor: Colors.shadow,
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        elevation: 5,
    },

    header:{
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },

    answer:{
        ...Typography.small,
        fontWeight: "700",
        color: Colors.cardDaily,
        letterSpacing: 0.8,
    },

    statement:{
        ...Typography.title,
        fontSize: 18,
        lineHeight: 27,
        color: Colors.text,
        fontWeight: "700",
    },

    iconBubble:{
        width: 24,
        height: 24,
        borderRadius: 999,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#EAFBF8",
    },

    iconBubbleWrong:{
        backgroundColor: "#FDEEEF",
    }

});
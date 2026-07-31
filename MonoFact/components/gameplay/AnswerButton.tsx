import { Pressable, Text, StyleSheet } from "react-native";
import { X, Check } from "lucide-react-native";
import { Colors } from "@/constants/Colors";


type AnswerButtonProps = {
    answer: "myth" | "fact";
    onPress: () => void;
};

export default function AnswerButton({
    answer,
    onPress,
}: AnswerButtonProps) {

    const isFact = answer === "fact";

    return (
        <Pressable
            style={[
                styles.button,
                isFact ? styles.fact : styles.myth,
            ]}
            onPress={onPress}
        >
            {isFact ? (
                <Check size={28} color="#34C759" />
            ) : (
                <X size={28} color="#FF5A5F" />
            )}

            <Text style={styles.text}>
                {isFact ? "FACT" : "MYTH"}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 150,
        height: 70,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
    },

    myth: {
        backgroundColor: "#FFF0F0",
    },

    fact: {
        backgroundColor: "#F2FFF5",
    },

    text: {
        fontWeight: "700",
        fontSize: 18,
    },
});
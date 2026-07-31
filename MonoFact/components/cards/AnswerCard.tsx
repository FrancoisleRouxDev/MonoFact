import { View, Text, StyleSheet } from "react-native";
import { Check, X } from "lucide-react-native";
import { Colors } from "@/constants/Colors";


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
                    <Check size={18} color="#62C370" />
                ) : (
                    <X size={18} color="#FF6B6B" />
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
        backgroundColor:"#FFF",
        borderRadius:28,
        padding:24,
        marginVertical:15,

        shadowColor:"#000",
        shadowOpacity:0.08,
        shadowRadius:12,
        elevation:5,
    },

    header:{
        flexDirection:"row",
        alignItems:"center",
        gap:8,
        marginBottom:18,
    },

    answer:{
        fontWeight:"700",
        color:"#A4B2C0",
        fontSize:13,
    },

    statement:{
        fontSize:28,
        fontWeight:"700",
        color:"#222",
        lineHeight:38,
    }

});
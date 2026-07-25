import { Pressable, Text, StyleSheet } from "react-native";

type PrimaryButtonProps = {
    title: string;
    onPress: () => void;
};

export default function PrimaryButton({ 
    title, 
    onPress, 
   }: PrimaryButtonProps) {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
   }

const styles = StyleSheet.create({
    button: {
        marginHorizontal: 20,
        marginBottom: 30,
        backgroundColor: "#FFFFFF",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
    },

    text: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1E1E1E",
    },
});
import { Pressable, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";

type PrimaryButtonVariant = "light" | "dark" | "outline";

type PrimaryButtonProps = {
    title: string;
    onPress: () => void;
    variant?: PrimaryButtonVariant;
};

export default function PrimaryButton({ 
    title, 
    onPress, 
    variant = "light",
   }: PrimaryButtonProps) {
    return (
        <Pressable style={[styles.button, styles[variant]]} onPress={onPress}>
            <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
        </Pressable>
    );
   }

const styles = StyleSheet.create({
    button: {
        width: "100%",
        minHeight: 56,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },

    text: {
        ...Typography.body,
        fontWeight: "600",
    },

    light: {
        backgroundColor: Colors.surface,
        shadowColor: Colors.shadow,
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        elevation: 4,
    },

    lightText: {
        color: Colors.primaryDark,
    },

    dark: {
        backgroundColor: Colors.primaryDark,
    },

    darkText: {
        color: Colors.surface,
    },

    outline: {
        backgroundColor: Colors.surfaceLight,
        borderWidth: 1,
        borderColor: Colors.primaryDark,
    },

    outlineText: {
        color: Colors.primaryDark,
    },
});
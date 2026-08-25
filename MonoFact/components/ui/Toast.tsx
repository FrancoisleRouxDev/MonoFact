import { useEffect, useRef } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Check, X, Info } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

// ---------------------------------------------------------------------------
// Toast types
// ---------------------------------------------------------------------------
type ToastType = "success" | "error" | "info";

type ToastProps = {
    message: string;
    type?: ToastType;
    visible: boolean;
    onHide: () => void;
    duration?: number;
};

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
// Animated notification that slides in from the top and auto-dismisses.
// Replaces all Alert.alert calls throughout the app for a consistent look.
// ---------------------------------------------------------------------------
export function Toast({
    message,
    type = "info",
    visible,
    onHide,
    duration = 3000,
}: ToastProps) {
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Slide in
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 80,
                    friction: 10,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto-dismiss after duration
            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -100,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => onHide());
    };

    if (!visible) return null;

    const Icon = type === "success" ? Check : type === "error" ? X : Info;
    const backgroundColor =
        type === "success"
            ? Colors.success
            : type === "error"
                ? Colors.error
                : Colors.primary;

    return (
        <Animated.View
            style={[
                styles.container,
                { backgroundColor, transform: [{ translateY }], opacity },
            ]}
        >
            <View style={styles.iconContainer}>
                <Icon size={18} color="#fff" strokeWidth={2.5} />
            </View>
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
}

// ---------------------------------------------------------------------------
// useToast — hook for managing toast state
// ---------------------------------------------------------------------------
import { useState } from "react";

type ToastState = {
    message: string;
    type: ToastType;
    visible: boolean;
};

export function useToast() {
    const [toast, setToast] = useState<ToastState>({
        message: "",
        type: "info",
        visible: false,
    });

    const showToast = (message: string, type: ToastType = "info") => {
        setToast({ message, type, visible: true });
    };

    const hideToast = () => {
        setToast((prev) => ({ ...prev, visible: false }));
    };

    return { toast, showToast, hideToast };
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 56,
        left: Spacing.lg,
        right: Spacing.lg,
        borderRadius: 16,
        padding: Spacing.md,
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.sm,
        zIndex: 9999,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
    },

    iconContainer: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },

    message: {
        ...Typography.caption,
        color: "#fff",
        fontWeight: "600",
        flex: 1,
    },
});
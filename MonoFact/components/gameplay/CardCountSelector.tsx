import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { Radius } from "@/constants/Radius";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { estimateMinutes } from "@/app/services/deck";

/**
 * Props for CardCountSelector, the pre-game "how many cards?" screen.
 */
type Props = {
    category: string;
    // Number of facts available in the category.
    poolSize: number;
    // Card counts to offer (already limited to what the pool can supply).
    options: readonly number[];
    selected: number;
    onSelect: (count: number) => void;
    onStart: () => void;
    onBack: () => void;
};

/**
 * CardCountSelector lets the player pick the deck size (10 / 25 / 50 / 100)
 * before a round starts, using a row of pill buttons.
 */
export default function CardCountSelector({
    category,
    poolSize,
    options,
    selected,
    onSelect,
    onStart,
    onBack,
}: Props) {
    return (
        <View style={styles.container}>

            <Text style={styles.title}>{category}</Text>
            <Text style={styles.subtitle}>How many cards do you want to play?</Text>

            <View style={styles.pillRow}>
                {options.map((count) => {
                    const active = count === selected;
                    const isAll = count >= poolSize;

                    return (
                        <Pressable
                            key={count}
                            style={[styles.pill, active && styles.pillActive]}
                            onPress={() => onSelect(count)}
                        >
                            <Text style={[styles.pillText, active && styles.pillTextActive]}>
                                {count}
                            </Text>
                            {isAll && (
                                <Text style={[styles.pillHint, active && styles.pillTextActive]}>
                                    all
                                </Text>
                            )}
                        </Pressable>
                    );
                })}
            </View>

            <Text style={styles.note}>
                About {estimateMinutes(selected)} min · cards are drawn at random, so every round is different.
            </Text>

            <Pressable style={styles.startButton} onPress={onStart}>
                <Text style={styles.startText}>Start →</Text>
            </Pressable>

            <Pressable onPress={onBack}>
                <Text style={styles.backText}>Back</Text>
            </Pressable>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: Spacing.md,
    },

    title: {
        ...Typography.h2,
        color: Colors.primaryDark,
    },

    subtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: "center",
    },

    pillRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: Spacing.sm,
        marginVertical: Spacing.md,
    },

    pill: {
        minWidth: 64,
        paddingVertical: Spacing.sm + 4,
        paddingHorizontal: Spacing.md,
        borderRadius: Radius.round,
        backgroundColor: Colors.surfaceLight,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: "center",
    },

    pillActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },

    pillText: {
        ...Typography.title,
        color: Colors.primaryDark,
    },

    pillTextActive: {
        color: Colors.surface,
    },

    pillHint: {
        ...Typography.small,
        color: Colors.textSecondary,
    },

    note: {
        ...Typography.caption,
        color: Colors.textSecondary,
        textAlign: "center",
    },

    startButton: {
        alignSelf: "stretch",
        height: 60,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        marginTop: Spacing.md,
    },

    startText: {
        ...Typography.title,
        color: Colors.surface,
    },

    backText: {
        ...Typography.body,
        color: Colors.textSecondary,
        padding: Spacing.sm,
    },
});

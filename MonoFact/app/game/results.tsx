import { SafeAreaView, View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { useUser } from "@/app/context/UserContext";
import { getRequiredXPForLevel } from "@/app/services/stats";

import {
    Trophy,
    Target,
    BarChart3,
    Zap,
} from "lucide-react-native";

import ResultStatCard from "@/components/cards/ResultStatCard";
import RoundStats from "@/components/gameplay/RoundStats";

// ---------------------------------------------------------------------------
// ResultsScreen (file: app/game/results.tsx)
// ---------------------------------------------------------------------------
// Shown after the player completes all questions in a category.
// Receives category name, total question count, and correct-answer count
// as route params (passed from feedback.tsx via router.replace).
//
// Reads XP and level from shared UserContext — no extra Firestore fetch needed
// since onSnapshot in the context keeps data up to date automatically.
// ---------------------------------------------------------------------------
export default function FeedbackScreen() {
    const router = useRouter();

    // Pull user data from shared context instead of fetching Firebase directly
    const { userData } = useUser();

    // Route params injected by feedback.tsx when the last question is answered.
    const {
        category,
        totalQuestions,
        correctAnswers,
    } = useLocalSearchParams();

    // Parse params from strings to numbers.
    const total = Number(totalQuestions ?? 0);
    const correct = Number(correctAnswers ?? 0);

    // Derive accuracy percentage for display (0 if no questions).
    const accuracy =
        total === 0
            ? 0
            : Math.round((correct / total) * 100);

    // Read XP and level directly from context — already up to date via onSnapshot
    const userLevel = userData?.level ?? 1;
    const userXP = userData?.xp ?? 0;

    // getRequiredXPForLevel returns the XP threshold for the NEXT level.
    const requiredXP = getRequiredXPForLevel(userLevel);

    return (
        <SafeAreaView style={styles.safeArea}>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Trophy header */}
                <View style={styles.header}>
                    <Trophy size={90} color={Colors.primaryDark} />
                    <Text style={styles.title}>Round Complete!</Text>
                    <Text style={styles.subtitle}>
                        {String(category)} • {total} Questions
                    </Text>
                </View>

                {/* Three quick-stat cards: score, accuracy, total XP */}
                <View style={styles.grid}>
                    <ResultStatCard
                        icon={Target}
                        value={`${correct} / ${total}`}
                        label="Final Score"
                    />

                    <ResultStatCard
                        icon={BarChart3}
                        value={`${accuracy}%`}
                        label="Accuracy"
                    />

                    <ResultStatCard
                        icon={Zap}
                        value={`${userXP} XP`}
                        label="Total XP"
                    />
                </View>

                {/* XP progress bar showing progress toward next level */}
                <RoundStats
                    currentXP={userXP}
                    requiredXP={requiredXP}
                    level={userLevel}
                />

                {/* Play Again — goes back to the category selection screen */}
                <Pressable
                    style={styles.primary}
                    onPress={() => router.push("/(tabs)/play")}
                >
                    <Text style={styles.primaryText}>Play Again</Text>
                </Pressable>

                {/* Return Home — goes to the main home tab */}
                <Pressable
                    style={styles.secondary}
                    onPress={() => router.push("/(tabs)")}
                >
                    <Text style={styles.secondaryText}>Return Home</Text>
                </Pressable>

            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    content: {
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },

    header: {
        alignItems: "center",
        paddingVertical: Spacing.xxl,
    },

    title: {
        ...Typography.h1,
        color: Colors.primaryDark,
        marginTop: Spacing.lg,
    },

    subtitle: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: Spacing.sm,
        marginVertical: Spacing.lg,
    },

    // Primary CTA — "Play Again"
    primary: {
        height: 60,
        borderRadius: 18,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        marginTop: Spacing.lg,
    },

    // Secondary CTA — "Return Home" (no background, just text)
    secondary: {
        height: 60,
        justifyContent: "center",
        alignItems: "center",
    },

    primaryText: {
        ...Typography.title,
        color: Colors.surface,
    },

    secondaryText: {
        ...Typography.title,
        color: Colors.primaryDark,
    },
});
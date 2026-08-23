import { SafeAreaView, View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { useUser } from "@/app/context/UserContext";
import { getRequiredXPForLevel, recordDailyBonus } from "@/app/services/stats";
import { useState, useEffect } from "react";

import {
    Trophy,
    Star,
    Target,
    BarChart3,
    Zap,
} from "lucide-react-native";

import ResultStatCard from "@/components/cards/ResultStatCard";
import RoundStats from "@/components/gameplay/RoundStats";

// ---------------------------------------------------------------------------
// ResultsScreen (file: app/game/results.tsx)
// ---------------------------------------------------------------------------
// Shown after the player completes all questions in a category or daily challenge.
// Receives category name, total question count, correct-answer count,
// and an optional isDailyChallenge flag as route params.
//
// Reads XP and level from shared UserContext — no extra Firestore fetch needed
// since onSnapshot in the context keeps data up to date automatically.
//
// If isDailyChallenge is true, awards +500 bonus XP and shows a special banner.
// ---------------------------------------------------------------------------
export default function FeedbackScreen() {
    const router = useRouter();

    // Pull user data from shared context instead of fetching Firebase directly
    const { userData } = useUser();

    // Track whether the daily bonus has been awarded to avoid double-awarding
    const [bonusAwarded, setBonusAwarded] = useState(false);

    // Route params injected by feedback.tsx or daily.tsx
    const {
        category,
        totalQuestions,
        correctAnswers,
        isDailyChallenge,
    } = useLocalSearchParams();

    // Parse params from strings to numbers
    const total = Number(totalQuestions ?? 0);
    const correct = Number(correctAnswers ?? 0);
    const isDaily = isDailyChallenge === "true";

    // Derive accuracy percentage for display (0 if no questions)
    const accuracy =
        total === 0
            ? 0
            : Math.round((correct / total) * 100);

    // Read XP and level directly from context — already up to date via onSnapshot
    const userLevel = userData?.level ?? 1;
    const userXP = userData?.xp ?? 0;

    // getRequiredXPForLevel returns the XP threshold for the NEXT level
    const requiredXP = getRequiredXPForLevel(userLevel);

    // -------------------------------------------------------------------------
    // Award daily bonus XP on mount if this is a daily challenge
    // -------------------------------------------------------------------------
    useEffect(() => {
        if (isDaily && !bonusAwarded) {
            recordDailyBonus();
            setBonusAwarded(true);
        }
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Trophy header */}
                <View style={styles.header}>
                    <Trophy size={90} color={Colors.primaryDark} />
                    <Text style={styles.title}>
                        {isDaily ? "Challenge Complete!" : "Round Complete!"}
                    </Text>
                    <Text style={styles.subtitle}>
                        {String(category)} • {total} Questions
                    </Text>
                </View>

                {/* Daily challenge bonus banner */}
                {isDaily && (
                    <View style={styles.bonusBanner}>
                        <Star size={20} color={Colors.surface} />
                        <Text style={styles.bonusText}>
                            +500 Daily Challenge Bonus XP!
                        </Text>
                    </View>
                )}

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

                {/* Play Again — goes back to home for daily, play screen for regular */}
                <Pressable
                    style={styles.primary}
                    onPress={() =>
                        router.push(isDaily ? "/(tabs)" : "/(tabs)/play")
                    }
                >
                    <Text style={styles.primaryText}>
                        {isDaily ? "Back to Home" : "Play Again"}
                    </Text>
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

    // Daily bonus banner shown below the header
    bonusBanner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: Spacing.xs,
        backgroundColor: Colors.cardDaily,
        borderRadius: 16,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
    },

    bonusText: {
        ...Typography.caption,
        color: Colors.surface,
        fontWeight: "700",
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: Spacing.sm,
        marginVertical: Spacing.lg,
    },

    // Primary CTA — "Play Again" or "Back to Home"
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
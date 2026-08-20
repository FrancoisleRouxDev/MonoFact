import { SafeAreaView, View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/app/services/config";
import { getRequiredXPForLevel } from "@/app/services/stats";

import {
        Trophy,
        Target,
        BarChart3,
        Zap,
} from "lucide-react-native";

import ResultStatCard from "@/components/cards/ResultStatCard";
import RoundStats from "@/components/gameplay/RoundStats";

export default function FeedbackScreen() {
        const router = useRouter();

        const {
                category,
                totalQuestions,
                correctAnswers,
        } = useLocalSearchParams();

        const total = Number(totalQuestions ?? 0);
        const correct = Number(correctAnswers ?? 0);

        const accuracy =
                total === 0
                        ? 0
                        : Math.round((correct / total) * 100);

        const [userLevel, setUserLevel] = useState(1);
        const [userXP, setUserXP] = useState(0);
        const [requiredXP, setRequiredXP] = useState(200);

        useEffect(() => {
                const loadUser = async () => {
                        const currentUser = auth.currentUser;

                        if (!currentUser) return;

                        try {
                                const snapshot = await getDoc(
                                        doc(db, "users", currentUser.uid)
                                );

                                if (snapshot.exists()) {
                                        const data = snapshot.data();
                                        const level = data.level ?? 1;
                                        const xp = data.xp ?? 0;

                                        setUserLevel(level);
                                        setUserXP(xp);
                                        setRequiredXP(getRequiredXPForLevel(level));
                                }
                        } catch (error) {
                                console.error("Failed to load user data:", error);
                        }
                };

                loadUser();
        }, []);

        return (
                <SafeAreaView style={styles.safeArea}>

                        <ScrollView
                                contentContainerStyle={styles.content}
                                showsVerticalScrollIndicator={false}
                        >
                                <View style={styles.header}>
                                        <Trophy size={90} color="#1F2337" />
                                        <Text style={styles.title}>Round Complete!</Text>
                                        <Text style={styles.subtitle}>
                                                {String(category)} • {total} Questions
                                        </Text>
                                </View>

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

                                <RoundStats
                                        currentXP={userXP}
                                        requiredXP={requiredXP}
                                        level={userLevel}
                                />

                                <Pressable
                                        style={styles.primary}
                                        onPress={() => router.push("/(tabs)/play")}
                                >
                                        <Text style={styles.primaryText}>Play Again</Text>
                                </Pressable>

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
                padding: 24,
                paddingBottom: 40,
        },

        header: {
                alignItems: "center",
                paddingVertical: 40,
        },

        title: {
                fontSize: 42,
                fontWeight: "700",
                marginTop: 20,
        },

        subtitle: {
                marginTop: 8,
                color: "#777",
        },

        grid: {
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: 15,
                marginVertical: 30,
        },

        primary: {
                height: 60,
                borderRadius: 18,
                backgroundColor: "#868D9A",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 30,
        },

        secondary: {
                height: 60,
                justifyContent: "center",
                alignItems: "center",
        },

        primaryText: {
                color: "#FFF",
                fontWeight: "700",
                fontSize: 20,
        },

        secondaryText: {
                fontWeight: "700",
                fontSize: 20,
                color: "#243A5A",
        },
});
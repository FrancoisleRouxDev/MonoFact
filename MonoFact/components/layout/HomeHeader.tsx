import { View, Text, StyleSheet } from "react-native";
import { Hand, Zap, Flame, Target, LucideIcon } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

import HeaderStatCard from "../cards/HeaderStatCard";

import { useEffect, useState, } from "react";
import { auth, db } from "@/app/services/config";
import { doc, getDoc } from "firebase/firestore";

export default function HomeHeader() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) return;

      const snapshot = await getDoc(doc(db, "users", currentUser.uid));

      if (snapshot.exists()) {
        setUserData(snapshot.data());
      }
    };

    loadUser();
  }, []);

  if (!userData) return null;

  const totalAnswers =
    userData.totalCorrect + userData.totalIncorrect;

  const accuracy =
    totalAnswers === 0
      ? "0%"
      : `${Math.round(
        (userData.totalCorrect / totalAnswers) * 100
      )}%`;


  const stats = [
    {
      icon: Zap,
      value: userData.xp.toString(),
      label: "XP",
    },
    {
      icon: Flame,
      value: `${userData.currentStreak}d`,
      label: "Streak",
    },
    {
      icon: Target,
      value: accuracy,
      label: "Accuracy",
    },
  ];

  return (
    <View style={styles.container}>

      <Text style={styles.greeting}>
        Good morning,
      </Text>

      <View style={styles.usernameRow}>
        <Text style={styles.username}>
          {userData.username.charAt(0).toUpperCase() + userData.username.slice(1)}
        </Text>

        <Hand size={22} color={Colors.surface} strokeWidth={2.2} />
      </View>

      <View style={styles.statsRow}>
        {stats.map((stat) => (
          <HeaderStatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
          />
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,

    paddingHorizontal: Spacing.lg,
    paddingTop: 36,
    paddingBottom: 24,

    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  greeting: {
    ...Typography.caption,
    color: "rgba(255, 255, 255, 0.72)",
  },

  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: 2,
  },

  username: {
    ...Typography.h1,
    color: Colors.surface,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
});
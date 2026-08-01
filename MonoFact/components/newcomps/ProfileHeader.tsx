import { View, Text, StyleSheet } from "react-native";
import { UserRound, Star } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

type ProfileHeaderProps = {
  username: string;
  email: string;
  level: string;
};

export default function ProfileHeader({
  username,
  email,
  level,
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>

      <View style={styles.avatar}>
        <UserRound
          size={50}
          color={Colors.primaryDark}
          strokeWidth={2}
        />
      </View>

      <Text style={styles.username}>
        {username}
      </Text>

      <Text style={styles.email}>
        {email}
      </Text>

      <View style={styles.levelBadge}>
        <Star
          size={16}
          color={Colors.surface}
        />

        <Text style={styles.levelText}>
          {level}
        </Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },

  username: {
    ...Typography.h3,
    color: Colors.surface,
  },

  email: {
    ...Typography.caption,
    color: "rgba(255, 255, 255, 0.65)",
    marginTop: 4,
  },

  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    marginTop: Spacing.md,
  },

  levelText: {
    ...Typography.small,
    color: Colors.surface,
    fontWeight: "600",
    marginLeft: Spacing.xs,
  },
});
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Trophy, ArrowRight } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";


type DailyChallengeCardProps = {
  title: string;
  description: string;
  reward: string;
  onPress: () => void;
};

export default function DailyChallengeCard({
  title,
  description,
  reward,
  onPress,
}: DailyChallengeCardProps) {
  return (
    <View style={styles.container}>

      <View style={styles.leftSection}>

        <Text style={styles.label}>
          DAILY CHALLENGE
        </Text>

        <Text style={styles.title}>
          {title}
        </Text>

        <Text style={styles.description}>
          {description}
        </Text>

        <Pressable
          style={styles.button}
          onPress={onPress}
        >
          <Text style={styles.buttonText}>
            Play Now
          </Text>

          <ArrowRight
            size={18}
            color="#FFFFFF"
          />
        </Pressable>

      </View>

      <View style={styles.iconContainer}>
        <Trophy
          size={54}
          color="#FFFFFF"
          strokeWidth={1.8}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: Colors.cardDaily,

    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,

    borderRadius: 24,

    padding: Spacing.lg,

    flexDirection: "row",
    justifyContent: "space-between",
  },

  leftSection: {
    flex: 1,
  },

  label: {
    ...Typography.small,
    color: "rgba(255, 255, 255, 0.78)",
    letterSpacing: 1,
  },

  title: {
    ...Typography.h3,
    color: Colors.surface,
    marginTop: 4,
  },

  description: {
    ...Typography.caption,
    color: "rgba(255, 255, 255, 0.90)",
    marginTop: 4,
  },

  button: {
    marginTop: 18,

    width: 138,
    height: 48,

    borderRadius: 16,

    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.28)",

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    gap: 8,
  },

  buttonText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: "700",
  },

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",

    paddingLeft: Spacing.lg,
  },

});
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Trophy, ArrowRight } from "lucide-react-native";
import { Colors } from "@/constants/Colors";


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

        <Text style={styles.reward}>
          {reward}
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
    backgroundColor: "#8A8A8A",

    marginHorizontal: 20,
    marginVertical: 25,

    borderRadius: 28,

    padding: 24,

    flexDirection: "row",
    justifyContent: "space-between",
  },

  leftSection: {
    flex: 1,
    justifyContent: "space-between",
  },

  label: {
    color: "#DADADA",
    fontSize: 12,
    letterSpacing: 1.2,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    marginTop: 8,
  },

  description: {
    color: "#F1F1F1",
    fontSize: 18,
    marginTop: 6,
  },

  reward: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 6,
  },

  button: {
    marginTop: 22,

    width: 145,
    height: 52,

    borderRadius: 16,

    borderWidth: 1,
    borderColor: "#FFFFFF55",

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    gap: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",

    paddingLeft: 20,
  },

});
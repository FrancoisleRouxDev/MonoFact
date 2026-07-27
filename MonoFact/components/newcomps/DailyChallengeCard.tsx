import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "./Primary-Button";

type DailyChallengeCardProps = {
  title: string;
  description: string;
  reward: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export default function DailyChallengeCard({
  icon,
  title,
  description,
  reward,
  onPress,
}: DailyChallengeCardProps) {
        return (
            <Pressable style={styles.card} onPress={onPress}>

                <View style={styles.header}>

                    <Ionicons
                        name={icon}
                        size={30}
                        color="#FFD700"
                    />

                    <Text style={styles.title}>
                        {title}
                    </Text>

                </View>

                <Text style={styles.description}>
                    {description}
                </Text>

                <Text style={styles.reward}>
                    Reward: {reward}
                </Text>

                <View style={styles.button}>

                <PrimaryButton
                  title="Start Challenge"
                  onPress={onPress}
                />

                </View>

            </Pressable>
        );
}

const styles = StyleSheet.create({
  card: {
    // flex: 1,
    height: 250,
    backgroundColor: "#707070",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,

  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    flexDirection: "row",
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  description: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },
  reward: {
    color: "#FFD700",
    fontWeight: "bold",
    marginTop: 15,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#FFD700",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 16,
  },

});
import { View, Text, StyleSheet } from "react-native";
import { Lightbulb } from "lucide-react-native";

type QuestionCardProps = {
  category: string;
  question: string;
};

export default function QuestionCard({
  category,
  question,
}: QuestionCardProps) {
  return (
    <View style={styles.container}>

      <View style={styles.categoryRow}>
        <Lightbulb size={16} color="#8B93A7" />

        <Text style={styles.category}>
          {category.toUpperCase()}
        </Text>
      </View>

      <Text style={styles.question}>
        {question}
      </Text>

      <View style={styles.swipeBox}>
        <Lightbulb size={24} color="#9AA3B2" />

        <Text style={styles.swipeText}>
          Swipe to judge this statement
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },

  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  category: {
    marginLeft: 8,
    fontSize: 14,
    color: "#8B93A7",
    fontWeight: "700",
    letterSpacing: 1,
  },

  question: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1D2033",
    lineHeight: 42,
    marginBottom: 40,
  },

  swipeBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F6FB",
    borderRadius: 18,
    paddingVertical: 18,
  },

  swipeText: {
    marginLeft: 12,
    color: "#8B93A7",
    fontSize: 16,
  },
});
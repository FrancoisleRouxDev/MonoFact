import { View, Text, StyleSheet } from "react-native";
import { BookOpen } from "lucide-react-native";
import { Colors } from "@/constants/Colors";


type Props = {
  title: string;
  description: string;
};

export default function FactExplanation({
  title,
  description,
}: Props) {
  return (
    <View style={styles.card}>

      <View style={styles.header}>
        <BookOpen
          size={20}
          color="#222"
        />

        <Text style={styles.heading}>
          {title}
        </Text>
      </View>

      <Text style={styles.body}>
        {description}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 28,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  heading: {
    marginLeft: 10,
    fontWeight: "700",
    fontSize: 18,
    color: "#222",
  },

  body: {
    fontSize: 17,
    lineHeight: 30,
    color: "#555",
  },
});
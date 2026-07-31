import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";


const categories = [
  {
    name: "Science",
    accuracy: 84,
  },
  {
    name: "Nature",
    accuracy: 78,
  },
  {
    name: "Animals",
    accuracy: 91,
  },
  {
    name: "Space",
    accuracy: 65,
  },
];

export default function AccuracyCategoryCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Accuracy by Category</Text>

      {categories.map((item) => (
        <View key={item.name} style={styles.row}>
          <View style={styles.rowHeader}>
            <Text style={styles.category}>{item.name}</Text>
            <Text style={styles.percent}>{item.accuracy}%</Text>
          </View>

          <View style={styles.barBackground}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${item.accuracy}%`,
                },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 20,
  },

  row: {
    marginBottom: 18,
  },

  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  category: {
    fontSize: 16,
    color: "#4B5563",
    fontWeight: "500",
  },

  percent: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },

  barBackground: {
    height: 8,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 999,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 999,
  },
});
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";


type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
};

export default function StatCard({
  icon,
  value,
  label,
}: StatCardProps) {
  return (
    <View style={styles.card}>
      <Ionicons
        name={icon}
        size={24}
        color="#FFFFFF"
      />

      <Text style={styles.value}>
        {value}
      </Text>

      <Text style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 100,
    height: 110,

    backgroundColor: "#707070",

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",

    padding: 10,
  },

  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },

  label: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
  },
});
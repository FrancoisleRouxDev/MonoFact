import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ContinueCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
};

export default function ContinueCard({
  icon,
  value,
  label,
}: ContinueCardProps) {
  return (
    <View style={styles.card}>

      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value}
      </Text>


      <Ionicons
        name={icon}
        size={24}
        color="#FFFFFF"
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 700,
    height: 125,

    backgroundColor: "#707070",

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",

    padding: 10,

    margin: 50,
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
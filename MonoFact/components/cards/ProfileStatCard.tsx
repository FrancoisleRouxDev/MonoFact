import { View, Text, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";

type Props = {
  icon: LucideIcon;
  value: string;
  label: string;
};

export default function ProfileStatCard({
  icon: Icon,
  value,
  label,
}: Props) {
  return (
    <View style={styles.card}>

      <Icon
        size={28}
        color="#000"
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
    width: "47%",
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },

  value: {
    fontSize: 32,
    fontWeight: "700",
    marginTop: 16,
    color: "#555",
  },

  label: {
    color: "#9A9A9A",
    marginTop: 6,
  },
});
import { Pressable, View, Text, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { Colors } from "@/constants/Colors";


type StatCardProps = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconBackgroundColor?: string;
};

export default function StatCard({
  title,
  subtitle,
  icon: Icon,
  iconBackgroundColor = "#EEF2FF",
}: StatCardProps) {
  return (
    <Pressable style={styles.card}>
      <View style={styles.iconContainer}>
        <Icon size={26} color="#1F2937" />
      </View>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.subtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: "#EEF2FF",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#9CA3AF",
  },
});
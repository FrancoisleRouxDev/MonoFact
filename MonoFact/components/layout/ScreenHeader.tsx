import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight, LucideIcon } from "lucide-react-native";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function ScreenHeader({
  title,
  subtitle,
}: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {subtitle && (
        <Text>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    height: 70,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 1,
    borderBottomColor: "#ECEEF4",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 44,
    height: 44,

    borderRadius: 12,

    backgroundColor: "#EEF3FB",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#20233D",
  },

  subtitle: {
    color: "#97A1C2",
    marginTop: 2,
  },
});
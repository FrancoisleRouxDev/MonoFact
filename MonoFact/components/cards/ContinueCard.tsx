import { Pressable, StyleSheet, Text, View } from "react-native";
import { LucideIcon, Zap } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";


type ContinueCardProps = {
  title: string;
  category: string;
  icon?: LucideIcon;
  onPress?: () => void;
};

export default function ContinueCard({
  title,
  category,
  icon: Icon = Zap,
  onPress,
}: ContinueCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>

      <View>
        <Text style={styles.label}>
          {title}
        </Text>

        <Text style={styles.category}>
          {category}
        </Text>
      </View>

      <View style={styles.iconContainer}>
        <Icon size={26} color={Colors.surface} />
      </View>

    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary,

    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,

    borderRadius: 24,

    padding: Spacing.lg,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    elevation: 4,
  },

  label: {
    ...Typography.caption,
    color: "rgba(255, 255, 255, 0.72)",
  },

  category: {
    ...Typography.h3,
    color: Colors.surface,
    marginTop: 4,
  },

  iconContainer: {
    width: 52,
    height: 52,

    borderRadius: 18,

    backgroundColor: Colors.primaryLight,

    justifyContent: "center",
    alignItems: "center",
  },
});
import { View, Text, StyleSheet } from "react-native";
import { BookOpen } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";


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

        <View style={styles.iconBubble}>
          <BookOpen
            size={14}
            color={Colors.primary}
          />
        </View>

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
    backgroundColor: Colors.surface,
    borderRadius: 26,
    padding: Spacing.lg,
    marginTop: Spacing.sm,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 5,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },

  heading: {
    marginLeft: Spacing.sm,
    ...Typography.title,
    color: Colors.primary,
  },

  body: {
    ...Typography.body,
    lineHeight: 28,
    color: Colors.textSecondary,
  },

  iconBubble: {
    width: 26,
    height: 26,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF8FF",
  },
});
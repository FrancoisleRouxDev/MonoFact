import { Pressable, StyleSheet, Text, View } from "react-native";
import { LucideIcon } from "lucide-react-native";

type CategoryCardProps = {
  title: string;
  facts: number;
  icon: LucideIcon;
  onPress: () => void;
};

export default function CategoryCard({
  title,
  facts,
  icon: Icon,
  onPress,
}: CategoryCardProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >

      <View style={styles.iconBox}>
        <Icon
          size={28}
          color="#1A1A1A"
        />
      </View>

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.subtitle}>
        {facts} facts
      </Text>

    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",

    width: "47%",

    borderRadius: 22,

    padding: 18,

    marginBottom: 18,

    elevation: 4,
  },

  iconBox: {
    width: 52,
    height: 52,

    borderRadius: 14,

    backgroundColor: "#EEF4FB",

    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",

    marginTop: 18,

    color: "#1D1D1D",
  },

  subtitle: {
    marginTop: 6,
    color: "#8C8C8C",
    fontSize: 16,
  },
});
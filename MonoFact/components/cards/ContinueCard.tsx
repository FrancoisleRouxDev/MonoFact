import { Pressable, StyleSheet, Text, View } from "react-native";
import { LucideIcon, Zap } from "lucide-react-native";
import { Colors } from "@/constants/Colors";


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
        <Icon size={28} color="#FFFFFF" />
      </View>

    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#8A8A8A",

    marginHorizontal: 20,
    marginTop: 25,

    borderRadius: 22,

    padding: 20,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    elevation: 4,
  },

  label: {
    color: "#ECECEC",
    fontSize: 15,
  },

  category: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 6,
  },

  iconContainer: {
    width: 56,
    height: 56,

    borderRadius: 16,

    backgroundColor: "#A0A0A0",

    justifyContent: "center",
    alignItems: "center",
  },
});
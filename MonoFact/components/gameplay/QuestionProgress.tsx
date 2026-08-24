import { Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowLeft } from "lucide-react-native";

/**
 * Props for QuestionProgress header showing current/total count and back action.
 */
type Props = {
  category: string;
  current: number;
  total: number;
  onBack: () => void;
};

/**
 * QuestionProgress renders the top navigation row during an active quiz round,
 * including category name, question count, and a divider line.
 */
export default function QuestionProgress({
  category,
  current,
  total,
  onBack,
}: Props) {

  return (

    <View>

      <View style={styles.row}>

        <Pressable onPress={onBack}>

          <ArrowLeft
            size={26}
            color="#6B7280"
          />

        </Pressable>

        <Text style={styles.category}>

          {category}

        </Text>

        <Text style={styles.progress}>

          {current} / {total}

        </Text>

      </View>

      <View style={styles.line} />

    </View>

  );
}

const styles = StyleSheet.create({

  row: {

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: 16,

  },

  category: {

    flex: 1,

    marginLeft: 12,

    color: "#6B7280",

    fontSize: 18,

  },

  progress: {

    fontWeight: "700",

    color: "#374151",

  },

  line: {

    height: 2,

    backgroundColor: "#E5E7EB",

  },

});
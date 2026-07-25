import { View, StyleSheet } from "react-native";

type PaginationDotsProps = {
  total: number;
  active: number;
};

export default function PaginationDots({
  total,
  active,
}: PaginationDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === active && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C8C8C8",
  },

  activeDot: {
    backgroundColor: "#FFFFFF",
  },
});
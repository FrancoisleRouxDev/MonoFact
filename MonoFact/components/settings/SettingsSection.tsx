import { View, Text, StyleSheet } from "react-native";

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

export default function SettingsSection({
  title,
  children,
}: SettingsSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title}</Text>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  heading: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#A5ADC7",
    marginBottom: 15,
  },
});
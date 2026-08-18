import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import ScreenHeader from "@/components/layout/ScreenHeader";
import { ChevronLeft, Globe, MessageCircle, Mail } from "lucide-react-native";
import SettingsSection from "@/components/settings/SettingsSection";
import SettingsItem from "@/components/settings/SettingsItem";

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={Colors.primaryDark} size={28} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="About MonoFact" subtitle="Version 1.0.0" />
        
        <View style={styles.card}>
          <Text style={styles.text}>
            MonoFact is a daily fact app designed to expand your knowledge one fact at a time. We believe learning should be engaging, beautiful, and accessible to everyone.
          </Text>
        </View>

        <SettingsSection title="CONNECT WITH US">
          <SettingsItem title="Website" icon={Globe} onPress={() => {}} />
          <SettingsItem title="Feedback" icon={MessageCircle} onPress={() => {}} />
          <SettingsItem title="Contact Support" icon={Mail} onPress={() => {}} />
        </SettingsSection>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerRow: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  backButton: {
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
    width: 44,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  text: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
});

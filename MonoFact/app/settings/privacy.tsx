import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import ScreenHeader from "@/components/layout/ScreenHeader";
import { ChevronLeft } from "lucide-react-native";

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={Colors.primaryDark} size={28} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Privacy Policy" subtitle="Last updated: August 2026" />
        
        <View style={styles.card}>
          <Text style={styles.heading}>1. Data Collection</Text>
          <Text style={styles.text}>
            Your privacy is important to us. MonoFact does not collect or sell your personal data. We only store the data necessary to provide you with your account and facts tracking.
          </Text>

          <Text style={styles.heading}>2. Account Data</Text>
          <Text style={styles.text}>
            We securely store your email and username via Firebase Authentication and Firestore to sync your progress across devices. We do not have access to your passwords.
          </Text>

          <Text style={styles.heading}>3. Third-party Services</Text>
          <Text style={styles.text}>
            We use Expo and Firebase as our underlying architecture. Please refer to their respective privacy policies for more information on how they handle data on our behalf.
          </Text>
        </View>
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
  heading: {
    ...Typography.h3,
    color: Colors.primaryDark,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  text: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
});

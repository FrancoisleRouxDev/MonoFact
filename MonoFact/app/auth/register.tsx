import { useState } from "react";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import PrimaryButton from "@/components/buttons/Primary-Button";
import InputField from "@/components/newcomps/InputField";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Alert } from "react-native";
import { registerUser } from "@/app/services/auth";

export default function RegisterScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords don't match");
      return;
    }

    try {
      await registerUser(username, email, password);

      Alert.alert("Success", "Account created successfully!");

      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={Colors.primaryDark}
          />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.title}>Create account</Text>

          <Text style={styles.subtitle}>
            Join thousands of fact-checkers
          </Text>
        </View>

        <View style={styles.form}>
          <InputField
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            leftIcon={
              <MaterialCommunityIcons
                name="at"
                size={22}
                color={Colors.textSecondary}
              />
            }
          />

          <InputField
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            leftIcon={
              <MaterialCommunityIcons
                name="email-outline"
                size={22}
                color={Colors.textSecondary}
              />
            }
          />

          <InputField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={
              <MaterialCommunityIcons
                name="lock-outline"
                size={22}
                color={Colors.textSecondary}
              />
            }
          />

          <InputField
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            leftIcon={
              <MaterialCommunityIcons
                name="lock-outline"
                size={22}
                color={Colors.textSecondary}
              />
            }
          />

          <View style={styles.strengthBlock}>
            <View style={styles.strengthTrack}>
              <View style={[styles.strengthBar, styles.strengthWeak]} />
              <View style={[styles.strengthBar, styles.strengthMid]} />
              <View style={[styles.strengthBar, styles.strengthFill]} />
              <View style={styles.strengthBar} />
            </View>

            <Text style={styles.strengthText}>
              Medium strength - add symbols to strengthen
            </Text>
          </View>

          <PrimaryButton
            title="Create Account"
            variant="dark"
            onPress={handleRegister}
          />

          <Pressable onPress={() => router.push("/auth/login")}>
            <Text style={styles.link}>
              Already have an account? <Text style={styles.linkBold}>Log in</Text>
            </Text>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 56,
    paddingBottom: Spacing.xl,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },

  backText: {
    ...Typography.body,
    color: Colors.primaryDark,
    fontWeight: "500",
  },

  header: {
    marginTop: Spacing.lg,
  },

  title: {
    ...Typography.h1,
    color: Colors.primaryDark,
    textTransform: "none",
  },

  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    maxWidth: 260,
    lineHeight: 20,
  },

  form: {
    marginTop: Spacing.xl,
  },

  strengthBlock: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },

  strengthTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: Colors.border,
    flexDirection: "row",
    overflow: "hidden",
  },

  strengthBar: {
    flex: 1,
    backgroundColor: "transparent",
    marginRight: 4,
  },

  strengthWeak: {
    backgroundColor: "#BEDFD7",
  },

  strengthMid: {
    backgroundColor: "#C9D7AE",
  },

  strengthFill: {
    backgroundColor: "#D3C7A3",
  },

  strengthText: {
    marginTop: Spacing.xs,
    ...Typography.small,
    color: Colors.textSecondary,
  },

  link: {
    textAlign: "center",
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
  },

  linkBold: {
    color: Colors.primaryDark,
    fontWeight: "700",
  },
});
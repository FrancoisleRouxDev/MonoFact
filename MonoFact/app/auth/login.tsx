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
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import InputField from "@/components/newcomps/InputField";
import PrimaryButton from "@/components/buttons/Primary-Button";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>

          <Text style={styles.subtitle}>
            Sign in to continue your learning streak
          </Text>
        </View>

        <View style={styles.form}>
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
            rightIcon={
              <MaterialCommunityIcons
                name="eye-outline"
                size={20}
                color={Colors.textSecondary}
              />
            }
          />

          <Pressable style={styles.forgotPassword}>
            <Text style={styles.link}>Forgot Password?</Text>
          </Pressable>

          <PrimaryButton
            title="Log In"
            variant="dark"
            onPress={() => {
              router.replace("/(tabs)");
            }}
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <PrimaryButton
            title="Create Account"
            variant="outline"
            onPress={() => router.push("/auth/register")}
          />
        </View>

      </View>

      <Text style={styles.footer}>
        By continuing, you agree to our Terms & Privacy Policy
      </Text>
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
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingTop: 56,
    paddingBottom: Spacing.xl,
  },

  header: {
    marginTop: Spacing.xl,
  },

  title: {
    ...Typography.h1,
    color: Colors.primaryDark,
  },

  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    lineHeight: 20,
    maxWidth: 260,
  },

  form: {
    marginTop: Spacing.xl,
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },

  link: {
    color: Colors.primary,
    ...Typography.caption,
    fontWeight: "600",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.lg,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },

  dividerText: {
    marginHorizontal: Spacing.sm,
    ...Typography.caption,
    color: Colors.textSecondary,
  },

  footer: {
    textAlign: "center",
    ...Typography.small,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
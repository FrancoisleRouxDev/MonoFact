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
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import InputField from "@/components/newcomps/InputField";
import PrimaryButton from "@/components/buttons/Primary-Button";
import { Toast, useToast } from "@/components/ui/Toast";

import { loginUser } from "@/app/services/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/app/services/config";

// ---------------------------------------------------------------------------
// LoginScreen (file: app/auth/login.tsx)
// ---------------------------------------------------------------------------
// Handles user sign-in and routes to the main app on success.
// Also provides navigation to the registration screen and a
// working "Forgot Password" flow via Firebase's reset email.
// ---------------------------------------------------------------------------
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Controls whether the password field shows plain text or ••••••
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { toast, showToast, hideToast } = useToast();

  // ---------------------------------------------------------------------------
  // handleLogin
  // ---------------------------------------------------------------------------
  // Validates inputs, calls Firebase Auth, then navigates to the main tabs.
  // On failure, shows a toast with the Firebase error message.
  // ---------------------------------------------------------------------------
  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Please enter your email and password.", "error");
      return;
    }

    try {
      await loginUser(email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  // ---------------------------------------------------------------------------
  // handleForgotPassword
  // ---------------------------------------------------------------------------
  // Sends a Firebase password-reset email to the address in the email field.
  // If the field is empty, prompts the user to enter their email first.
  // Firebase will not reveal whether the email exists (security best practice).
  // ---------------------------------------------------------------------------
  const handleForgotPassword = async () => {
    if (!email.trim()) {
      showToast(
        "Enter your email above then tap Forgot Password again.",
        "info"
      );
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      showToast(
        "Reset link sent — check your inbox.",
        "success"
      );
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>

        {/* Toast notification — sits above all content */}
        <Toast
          message={toast.message}
          type={toast.type}
          visible={toast.visible}
          onHide={hideToast}
        />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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

              {/* Password field — eye icon toggles visibility */}
              <InputField
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                leftIcon={
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={22}
                    color={Colors.textSecondary}
                  />
                }
                rightIcon={
                  <Pressable
                    onPress={() => setPasswordVisible((v) => !v)}
                  >
                    <MaterialCommunityIcons
                      name={
                        passwordVisible
                          ? "eye-off-outline"
                          : "eye-outline"
                      }
                      size={20}
                      color={Colors.textSecondary}
                    />
                  </Pressable>
                }
              />

              {/* Forgot Password — sends a Firebase reset email */}
              <Pressable
                style={styles.forgotPassword}
                onPress={handleForgotPassword}
              >
                <Text style={styles.link}>Forgot Password?</Text>
              </Pressable>

              <PrimaryButton
                title="Log In"
                variant="dark"
                onPress={handleLogin}
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
            By continuing, you agree to our Terms &amp; Privacy Policy
          </Text>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
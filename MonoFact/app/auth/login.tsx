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
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import InputField from "@/components/newcomps/InputField";
import PrimaryButton from "@/components/buttons/Primary-Button";

import { loginUser } from "@/app/services/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Information", "Please enter your email and password.");
      return;
    }

    try {
      await loginUser(email, password);

      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <SafeAreaView style={styles.container}>
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
            By continuing, you agree to our Terms & Privacy Policy
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
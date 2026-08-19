import { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, TouchableOpacity, Text, Alert, Modal, TextInput, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import ScreenHeader from "@/components/layout/ScreenHeader";
import { ChevronLeft, ImagePlus, KeyRound, Mail, Trash2, UserPen } from "lucide-react-native";
import SettingsSection from "@/components/settings/SettingsSection";
import SettingsItem from "@/components/settings/SettingsItem";
import { auth, db } from "@/app/services/config";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { verifyBeforeUpdateEmail, updatePassword, deleteUser } from "firebase/auth";

// ---- NEW IMPORT ----
import { useProfilePhoto } from "@/hooks/useProfilePhoto";
// --------------------

export default function AccountScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"username" | "email" | "password" | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [saving, setSaving] = useState(false);

  // ---- NEW: profile photo hook ----
  const { pickAndUpload, uploading } = useProfilePhoto();
  // ---------------------------------

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      const snapshot = await getDoc(doc(db, "users", currentUser.uid));
      if (snapshot.exists()) {
        setUserData(snapshot.data());
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: "username" | "email" | "password", currentValue: string = "") => {
    setModalType(type);
    setInputValue(currentValue);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!inputValue.trim()) return;
    setSaving(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      if (modalType === "username") {
        await updateDoc(doc(db, "users", currentUser.uid), { username: inputValue.trim() });
        setUserData({ ...userData, username: inputValue.trim() });
        Alert.alert("Success", "Username updated successfully.");
      } else if (modalType === "email") {
        const newEmail = inputValue.trim();
        if (newEmail.toLowerCase() === userData?.email?.toLowerCase()) {
          Alert.alert("Notice", "This is already your current email address.");
          setSaving(false);
          return;
        }
        await verifyBeforeUpdateEmail(currentUser, newEmail);
        Alert.alert("Verification Sent", "A verification link has been sent. Please click the link in your new email's inbox to complete the change.");
      } else if (modalType === "password") {
        await updatePassword(currentUser, inputValue);
        Alert.alert("Success", "Password updated successfully.");
      }
      setModalVisible(false);
    } catch (error: any) {
      console.error("Firebase Auth Error:", error.code, error.message, error);
      if (error.code === 'auth/requires-recent-login') {
        Alert.alert("Authentication Required", "For security reasons, please log out and log back in to perform this action.");
      } else if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Error", "This email is already in use by another account.");
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert("Error", "Please enter a valid email address.");
      } else {
        Alert.alert("Error", error.message || "An error occurred. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and will permanently erase all your data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const currentUser = auth.currentUser;
              if (!currentUser) return;
              await deleteDoc(doc(db, "users", currentUser.uid));
              await deleteUser(currentUser);
              router.replace("/auth/login");
            } catch (error: any) {
              if (error.code === 'auth/requires-recent-login') {
                Alert.alert("Authentication Required", "For security reasons, please log out and log back in before deleting your account.");
              } else {
                Alert.alert("Error", error.message || "Failed to delete account.");
              }
            }
          }
        }
      ]
    );
  };

  const getModalTitle = () => {
    if (modalType === "username") return "Edit Username";
    if (modalType === "email") return "Change Email";
    if (modalType === "password") return "Change Password";
    return "";
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={Colors.primaryDark} size={28} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Account Management" subtitle="Update your account details and security settings." />

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <>
            <SettingsSection title="PROFILE">
              {/* ---- NEW: Change Profile Picture item ---- */}
              <SettingsItem
                title="Change Profile Picture"
                subtitle={uploading ? "Uploading..." : "Tap to update your photo"}
                icon={ImagePlus}
                onPress={pickAndUpload}
              />
              {/* ----------------------------------------- */}
              <SettingsItem
                title="Edit Username"
                subtitle={userData?.username || "Not set"}
                icon={UserPen}
                onPress={() => openModal("username", userData?.username || "")}
              />
              <SettingsItem
                title="Change Email"
                subtitle={userData?.email || "Not set"}
                icon={Mail}
                onPress={() => openModal("email", userData?.email || "")}
              />
            </SettingsSection>

            <SettingsSection title="SECURITY">
              <SettingsItem
                title="Change Password"
                icon={KeyRound}
                onPress={() => openModal("password")}
              />
            </SettingsSection>

            <SettingsSection title="DANGER ZONE">
              <SettingsItem
                title="Delete Account"
                icon={Trash2}
                onPress={handleDeleteAccount}
              />
            </SettingsSection>
          </>
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{getModalTitle()}</Text>

            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={modalType === "password" ? "New password" : "Enter new value"}
              secureTextEntry={modalType === "password"}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType={modalType === "email" ? "email-address" : "default"}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
                disabled={saving}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={[styles.modalButtonText, { color: "#FFF" }]}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Spacing.xl,
    width: "100%",
    maxWidth: 400,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: Spacing.md,
    ...Typography.body,
    color: Colors.text,
    marginBottom: Spacing.xl,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.md,
  },
  modalButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonPrimary: {
    backgroundColor: Colors.primary,
  },
  modalButtonText: {
    ...Typography.body,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
});

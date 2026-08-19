import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { UserRound, Star, Camera } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

type ProfileHeaderProps = {
  username: string;
  email: string;
  level: string;
  // ---- NEW optional props ----
  photoURL?: string | null;
  onPhotoPress?: () => void;
  uploadingPhoto?: boolean;
  // ----------------------------
};

export default function ProfileHeader({
  username,
  email,
  level,
  photoURL,
  onPhotoPress,
  uploadingPhoto,
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>

      <TouchableOpacity
        onPress={onPhotoPress}
        disabled={!onPhotoPress || uploadingPhoto}
        activeOpacity={0.8}
        style={styles.avatarWrapper}
      >
        <View style={styles.avatar}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatarImage} />
          ) : (
            <UserRound size={50} color={Colors.primaryDark} strokeWidth={2} />
          )}
        </View>

        {/* Camera badge — only shown when onPhotoPress is wired up */}
        {onPhotoPress && (
          <View style={styles.cameraBadge}>
            {uploadingPhoto ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Camera size={13} color="#FFF" />
            )}
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.username}>
        {username}
      </Text>

      <Text style={styles.email}>
        {email}
      </Text>

      <View style={styles.levelBadge}>
        <Star size={16} color={Colors.surface} />
        <Text style={styles.levelText}>
          {level}
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  avatarWrapper: {
    position: "relative",
    marginBottom: Spacing.md,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 22,
  },

  cameraBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.background,
  },

  username: {
    ...Typography.h3,
    color: Colors.surface,
  },

  email: {
    ...Typography.caption,
    color: "rgba(255, 255, 255, 0.65)",
    marginTop: 4,
  },

  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    marginTop: Spacing.md,
  },

  levelText: {
    ...Typography.small,
    color: Colors.surface,
    fontWeight: "600",
    marginLeft: Spacing.xs,
  },
});

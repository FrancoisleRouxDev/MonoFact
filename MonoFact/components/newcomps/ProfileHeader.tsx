import { View, Text, StyleSheet } from "react-native";
import { UserRound, Star } from "lucide-react-native";

type ProfileHeaderProps = {
  username: string;
  email: string;
  level: string;
};

export default function ProfileHeader({
  username,
  email,
  level,
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>

      <View style={styles.avatar}>
        <UserRound
          size={48}
          color="#000"
          strokeWidth={2}
        />
      </View>

      <Text style={styles.username}>
        {username}
      </Text>

      <Text style={styles.email}>
        {email}
      </Text>

      <View style={styles.levelBadge}>
        <Star
          size={16}
          color="#FFF"
        />

        <Text style={styles.levelText}>
          {level}
        </Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#8A8A8A",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 40,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: "#BDBDBD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  username: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
  },

  email: {
    color: "#E5E5E5",
    marginTop: 6,
  },

  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#A4A4A4",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    marginTop: 18,
  },

  levelText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
  },
});
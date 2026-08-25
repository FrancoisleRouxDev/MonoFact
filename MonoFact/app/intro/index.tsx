import { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { useRouter } from "expo-router";
import { Sparkles, Flame, Compass } from "lucide-react-native";
import * as Haptics from "expo-haptics";

// Components
import PrimaryButton from "@/components/buttons/Primary-Button";
import AppLogo from "@/components/newcomps/AppLogo";
import PaginationDots from "@/components/ui/PaginationDots";

type SlideItem = {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  type: "logo" | "streak" | "categories";
};

const SLIDES: SlideItem[] = [
  {
    id: "1",
    badge: "TRUTH OR MYTH",
    title: "MonoFact",
    subtitle: "Learn the truth, one swipe at a time. Test your intuition against hundreds of verified facts.",
    type: "logo",
  },
  {
    id: "2",
    badge: "DAILY CHALLENGES",
    title: "Build Your Streak",
    subtitle: "Complete daily facts, earn bonus XP, level up your rank, and unlock exclusive achievements.",
    type: "streak",
  },
  {
    id: "3",
    badge: "EXPLORE CATEGORIES",
    title: "Master Every Topic",
    subtitle: "Dive into Science, Nature, Space, Tech, and History with beautiful, bite-sized fact cards.",
    type: "categories",
  },
];

export default function IntroductionScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<SlideItem>>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / width);
    if (index !== activeIndex && index >= 0 && index < SLIDES.length) {
      setActiveIndex(index);
    }
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (activeIndex < SLIDES.length - 1) {
      const nextIndex = activeIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    } else {
      router.push("/auth/login");
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/auth/login");
  };

  const renderIcon = (type: SlideItem["type"]) => {
    switch (type) {
      case "logo":
        return <AppLogo size={96} />;
      case "streak":
        return (
          <View style={styles.iconCircle}>
            <Flame size={48} color={Colors.surface} strokeWidth={2.2} />
          </View>
        );
      case "categories":
        return (
          <View style={styles.iconCircle}>
            <Compass size={48} color={Colors.surface} strokeWidth={2.2} />
          </View>
        );
    }
  };

  const renderSlide = ({ item }: { item: SlideItem }) => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.iconWrapper}>{renderIcon(item.type)}</View>

      <View style={styles.badge}>
        <Sparkles size={13} color={Colors.cardDaily} />
        <Text style={styles.badgeText}>{item.badge}</Text>
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View pointerEvents="none" style={styles.backgroundGlow} />

      {/* Top Header with Skip Button */}
      <View style={styles.header}>
        {activeIndex < SLIDES.length - 1 ? (
          <Pressable onPress={handleSkip} hitSlop={12}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        ) : (
          <View style={{ height: 20 }} />
        )}
      </View>

      {/* Swipeable Carousel */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        bounces={false}
        style={styles.carousel}
      />

      {/* Pagination and Action Buttons */}
      <View style={styles.footer}>
        <View style={styles.dotsWrapper}>
          <PaginationDots total={SLIDES.length} active={activeIndex} />
        </View>

        <PrimaryButton
          title={activeIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
        />

        {activeIndex === SLIDES.length - 1 && (
          <Pressable
            style={styles.loginLink}
            onPress={() => router.push("/auth/login")}
          >
            <Text style={styles.loginLinkText}>
              Already have an account?{" "}
              <Text style={styles.loginLinkBold}>Log in</Text>
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
  },
  backgroundGlow: {
    position: "absolute",
    top: -140,
    left: -120,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: "rgba(69, 123, 157, 0.22)",
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    alignItems: "flex-end",
    minHeight: 40,
  },
  skipText: {
    ...Typography.body,
    color: "rgba(255, 255, 255, 0.65)",
    fontWeight: "600",
  },
  carousel: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
  },
  iconWrapper: {
    marginBottom: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "rgba(46, 196, 182, 0.15)",
    marginBottom: Spacing.sm,
  },
  badgeText: {
    ...Typography.small,
    fontSize: 11,
    fontWeight: "700",
    color: Colors.cardDaily,
    letterSpacing: 0.8,
  },
  title: {
    ...Typography.h1,
    color: Colors.surface,
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: "rgba(255, 255, 255, 0.72)",
    textAlign: "center",
    marginTop: Spacing.sm,
    lineHeight: 22,
    maxWidth: 290,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  dotsWrapper: {
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  loginLink: {
    alignItems: "center",
    paddingVertical: Spacing.xs,
  },
  loginLinkText: {
    ...Typography.caption,
    color: "rgba(255, 255, 255, 0.72)",
  },
  loginLinkBold: {
    color: Colors.surface,
    fontWeight: "700",
  },
});
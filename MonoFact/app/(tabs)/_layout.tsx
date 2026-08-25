import { Stack, useRouter, useSegments } from 'expo-router';
import 'react-native-reanimated';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProvider } from "@/app/context/UserContext";
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/app/services/config';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';

// ---------------------------------------------------------------------------
// AuthGate
// ---------------------------------------------------------------------------
// Listens for Firebase auth state on app launch.
// Shows a loading spinner while Firebase restores the session so the user
// is never flashed to the login screen unnecessarily.
// Once auth state is known, redirects to the right screen.
// ---------------------------------------------------------------------------
function AuthGate({ children }: { children: React.ReactNode }) {
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthLoading(false);

      const inAuthGroup = segments[0] === 'auth';
      const inIntro = segments[0] === 'intro';

      if (user && (inAuthGroup || inIntro)) {
        // User is signed in but on auth/intro screens — send to app
        router.replace('/(tabs)');
      } else if (!user && !inAuthGroup && !inIntro) {
        // User is not signed in but trying to access app — send to login
        router.replace('/auth/login');
      }
    });

    return () => unsubscribe();
  }, [segments]);

  // Show spinner while Firebase restores session
  if (authLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
      }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

export const unstable_settings = {
  anchor: '/intro',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <AuthGate>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </AuthGate>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
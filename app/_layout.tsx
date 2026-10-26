import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold, PlayfairDisplay_900Black, PlayfairDisplay_400Regular_Italic } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { View, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../src/store/useAuthStore';
import { colors } from '../src/theme';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isLoggedIn, role } = useAuthStore();

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_900Black,
    PlayfairDisplay_400Regular_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Inject web styling to prevent white margins and ensure full-bleed quiet luxury warm ivory canvas
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.body.style.backgroundColor = colors.canvas;
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.documentElement.style.backgroundColor = colors.canvas;

      let styleEl = document.getElementById('veyuka-web-styles');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'veyuka-web-styles';
        styleEl.innerHTML = `
          html, body, #root {
            background-color: ${colors.canvas} !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            min-height: 100% !important;
            overflow-x: hidden !important;
            color: ${colors.ink} !important;
          }
        `;
        document.head.appendChild(styleEl);
      }
    }
  }, []);

  useEffect(() => {
    if (!fontsLoaded) return;

    const currentGroup = segments[0] as string | undefined;

    // Role-based protection:
    if (!isLoggedIn) {
      // Guest can only visit (public) and (auth)
      if (currentGroup === '(customer)' || currentGroup === '(owner)') {
        router.replace('/(auth)/login');
      }
    } else if (role === 'owner') {
      // Owner can never open customer routes
      if (currentGroup === '(customer)') {
        router.replace('/(owner)/dashboard');
      }
    } else if (role === 'customer') {
      // Customer can never open owner routes
      if (currentGroup === '(owner)') {
        router.replace('/(customer)/home');
      }
    }
  }, [fontsLoaded, isLoggedIn, role, segments]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <View style={styles.appShell}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.canvas },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(public)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(customer)" />
            <Stack.Screen name="(owner)" />
          </Stack>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
    width: '100%',
    minHeight: '100%',
  },
  appShell: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 540 : undefined,
    alignSelf: 'center',
    backgroundColor: colors.canvas,
    minHeight: '100%',
    // Soft editorial shadow on desktop browser frame
    shadowColor: '#121016',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
  },
});

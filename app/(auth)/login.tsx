import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { colors, fonts } from '../../src/theme';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useAuthStore();

  const handleLogin = async (role: 'customer' | 'owner') => {
    const identifier = role === 'owner' ? 'owner@veyuka.com' : 'hello@veyuka.com';
    await login({ identifier });
    if (role === 'owner') {
      router.replace('/(owner)/dashboard');
    } else {
      router.replace('/(customer)/home');
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.wordmark}>VEYUKA</Text>
          <Text style={styles.heading}>Sign in</Text>
          <Text style={styles.subtext}>Welcome back. Enter your number to continue.</Text>
        </View>

        {/* Mock login — two roles */}
        <View style={styles.form}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => handleLogin('customer')} activeOpacity={0.82}>
            <Text style={styles.primaryBtnText}>Continue as Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => handleLogin('owner')} activeOpacity={0.82}>
            <Text style={styles.secondaryBtnText}>Continue as Owner</Text>
          </TouchableOpacity>
          <Text style={styles.hint}>Mock login — no real auth yet</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  scroll: { flexGrow: 1, paddingBottom: 48 },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  back: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.inkSecondary,
  },
  titleBlock: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 48,
  },
  wordmark: {
    fontFamily: fonts.headingBold,
    fontSize: 14,
    letterSpacing: 5,
    color: colors.greyLight,
    marginBottom: 24,
  },
  heading: {
    fontFamily: fonts.headingRegular,
    fontSize: 42,
    lineHeight: 48,
    letterSpacing: -1.2,
    color: colors.ink,
    marginBottom: 12,
  },
  subtext: {
    fontFamily: fonts.bodyRegular,
    fontSize: 15,
    lineHeight: 23,
    color: colors.grey,
  },
  form: {
    paddingHorizontal: 24,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: colors.plum,
    paddingVertical: 17,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.white,
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    paddingVertical: 17,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  secondaryBtnText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.ink,
    letterSpacing: 0.2,
  },
  hint: {
    fontFamily: fonts.bodyRegular,
    fontSize: 12,
    color: colors.greyLight,
    textAlign: 'center',
    marginTop: 8,
  },
});

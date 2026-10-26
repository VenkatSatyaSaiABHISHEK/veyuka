import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/useAuthStore';
import { colors, fonts, radius } from '../../src/theme';

export default function OtpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ identifier?: string; role?: string }>();
  const identifier = params.identifier || '+91 98200 12345';
  const role = params.role || 'customer';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const handleVerify = async () => {
    setLoading(true);
    try {
      await login({ identifier });
      if (role === 'owner') {
        router.replace('/(owner)/dashboard');
      } else {
        router.replace('/(customer)/home');
      }
    } catch {
      // Mock fallback
      router.replace('/(customer)/home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 16) }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.brand}>VEYUKA</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.body}>
        <Text style={styles.heading}>Verification</Text>
        <Text style={styles.subtext}>
          We sent a 6-digit access code to{' '}
          <Text style={styles.highlight}>{identifier}</Text>
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
            placeholder="0 0 0 0 0 0"
            placeholderTextColor={colors.greyLight}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
          />
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, otp.length < 4 && styles.primaryBtnDisabled]}
          onPress={handleVerify}
          disabled={loading || otp.length < 4}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>Verify & Proceed</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.resendBtn} activeOpacity={0.7}>
          <Text style={styles.resendText}>Didn't receive code? Resend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  back: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.inkSecondary,
  },
  brand: {
    fontFamily: fonts.headingBold,
    fontSize: 16,
    letterSpacing: 4,
    color: colors.ink,
  },
  body: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 48,
  },
  heading: {
    fontFamily: fonts.headingRegular,
    fontSize: 32,
    color: colors.ink,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtext: {
    fontFamily: fonts.bodyRegular,
    fontSize: 14,
    color: colors.grey,
    lineHeight: 22,
    marginBottom: 36,
  },
  highlight: {
    color: colors.ink,
    fontFamily: fonts.bodyMedium,
  },
  inputContainer: {
    borderBottomWidth: 2,
    borderBottomColor: colors.plum,
    paddingBottom: 8,
    marginBottom: 32,
  },
  input: {
    fontFamily: fonts.headingRegular,
    fontSize: 28,
    letterSpacing: 8,
    color: colors.ink,
    textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: colors.plum,
    borderRadius: radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  primaryBtnDisabled: {
    opacity: 0.5,
  },
  primaryBtnText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: '#fff',
    letterSpacing: 0.5,
  },
  resendBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  resendText: {
    fontFamily: fonts.bodyRegular,
    fontSize: 13,
    color: colors.grey,
  },
});

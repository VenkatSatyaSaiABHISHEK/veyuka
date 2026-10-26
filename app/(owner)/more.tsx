import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/useAuthStore';
import { colors, fonts, radius, shadows } from '../../src/theme';

export default function OwnerMore() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logout, user } = useAuthStore();

  const handleSignOut = () => {
    logout();
    router.replace('/');
  };

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 16) }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Operations & Settings</Text>
          <Text style={styles.headerSub}>Directorate Control Center</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 90 + insets.bottom }]}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>VR</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Vikramaditya Roy'}</Text>
            <Text style={styles.profileRole}>Managing Director • Veyuka Group</Text>
            <Text style={styles.profileEmail}>{user?.email || 'director@veyuka.com'}</Text>
          </View>
        </View>

        {/* Operational Modules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DIRECTORATE CONTROLS</Text>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(owner)/dashboard')}
            activeOpacity={0.7}
          >
            <View>
              <Text style={styles.menuLabel}>Financial Ledger & Escrow</Text>
              <Text style={styles.menuSub}>₹86.70L total revenue tracked</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(owner)/vendors')}
            activeOpacity={0.7}
          >
            <View>
              <Text style={styles.menuLabel}>Internal Vendor Contracts</Text>
              <Text style={styles.menuSub}>10 vetted partners under NDA</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(owner)/bookings')}
            activeOpacity={0.7}
          >
            <View>
              <Text style={styles.menuLabel}>Quality & Hospitality Audits</Text>
              <Text style={styles.menuSub}>Pre-event checklist guidelines</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(owner)/calendar')}
            activeOpacity={0.7}
          >
            <View>
              <Text style={styles.menuLabel}>Production Scheduling</Text>
              <Text style={styles.menuSub}>Dispatch and logistics timeline</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SYSTEM</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Platform Version</Text>
            <Text style={styles.infoVal}>v2.4.0 (Executive)</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Security & Encryption</Text>
            <Text style={styles.infoVal}>AES-256 Bit Tokenized</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Backend Mode</Text>
            <Text style={styles.infoVal}>Simulated High-Fidelity Mock</Text>
          </View>
        </View>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.85}>
          <Text style={styles.signOutButtonText}>Sign Out of Executive Console</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Owner Bottom Nav */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(owner)/dashboard')}>
          <Text style={styles.navText}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(owner)/bookings')}>
          <Text style={styles.navText}>Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(owner)/calendar')}>
          <Text style={styles.navText}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(owner)/vendors')}>
          <Text style={styles.navText}>Vendors</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(owner)/more')}>
          <Text style={[styles.navText, styles.navTextActive]}>More</Text>
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
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  headerTitle: {
    fontFamily: fonts.headingBold,
    fontSize: 22,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontFamily: fonts.bodyRegular,
    fontSize: 12,
    color: colors.grey,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.canvasPure,
    borderRadius: radius.md,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.hairline,
    ...shadows.subtle,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.plum,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarInitials: {
    fontFamily: fonts.headingBold,
    fontSize: 18,
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: fonts.headingRegular,
    fontSize: 18,
    color: colors.ink,
  },
  profileRole: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.plum,
    marginTop: 2,
  },
  profileEmail: {
    fontFamily: fonts.bodyRegular,
    fontSize: 11,
    color: colors.grey,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.grey,
    marginBottom: 10,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.canvasPure,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  menuLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.ink,
  },
  menuSub: {
    fontFamily: fonts.bodyRegular,
    fontSize: 12,
    color: colors.grey,
    marginTop: 2,
  },
  menuArrow: {
    fontFamily: fonts.headingRegular,
    fontSize: 22,
    color: colors.greyLight,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.canvasPure,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  infoKey: {
    fontFamily: fonts.bodyRegular,
    fontSize: 13,
    color: colors.grey,
  },
  infoVal: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.ink,
  },
  signOutButton: {
    backgroundColor: colors.canvasPure,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.hairline,
    marginTop: 10,
    marginBottom: 30,
  },
  signOutButtonText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.error,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.canvasPure,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  navText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.grey,
  },
  navTextActive: {
    color: colors.plum,
    fontFamily: fonts.bodySemiBold,
  },
});

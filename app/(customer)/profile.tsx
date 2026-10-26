import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/useAuthStore';
import { colors, fonts, shadows } from '../../src/theme';
import { mockBookings } from '../../src/data/bookings';

function formatCurrency(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function CustomerProfile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();

  const myBookings = mockBookings.filter(b => b.customerId === 'cust-1');
  const totalSpend = myBookings.reduce((s, b) => s + b.totalAmount, 0);
  const upcoming = myBookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length;
  const completed = myBookings.filter(b => b.status === 'completed').length;

  const displayName = user?.name ?? 'Ananya Singhania';
  const initial = displayName[0];

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>

        {/* Avatar + name */}
        <Animated.View entering={FadeInDown.delay(60).duration(400)} style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.email}>{user?.email ?? 'ananya.s@gmail.com'}</Text>
          <Text style={styles.phone}>{user?.phone ?? '+91 98200 12345'}</Text>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{upcoming}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{formatCurrency(totalSpend).replace('₹', '₹\n')}</Text>
            <Text style={styles.statLabel}>Total spend</Text>
          </View>
        </Animated.View>

        {/* Menu */}
        <Animated.View entering={FadeInDown.delay(180).duration(400)} style={styles.menuSection}>
          <Text style={styles.sectionLabel}>ACCOUNT</Text>
          <View style={styles.menuCard}>
            <MenuItem label="My Bookings" onPress={() => router.push('/(customer)/bookings')} />
            <MenuItem label="Support" onPress={() => router.push('/(customer)/support')} />
            <MenuItem label="Plan a New Event" onPress={() => router.push('/(customer)/book')} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).duration(400)} style={[styles.menuSection]}>
          <Text style={styles.sectionLabel}>ABOUT</Text>
          <View style={styles.menuCard}>
            <MenuItem label="How Veyuka Works" onPress={() => {}} />
            <MenuItem label="Privacy Policy" onPress={() => {}} />
            <MenuItem label="Terms of Service" onPress={() => {}} last />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.signOutSection}>
          <TouchableOpacity
            style={styles.signOutBtn}
            onPress={() => { logout(); router.replace('/'); }}
            activeOpacity={0.7}
          >
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function MenuItem({ label, onPress, last = false }: { label: string; onPress: () => void; last?: boolean }) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, !last && styles.menuItemBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.menuItemText}>{label}</Text>
      <Text style={styles.menuChevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  back: { fontFamily: fonts.headingRegular, fontSize: 22, color: colors.ink },
  title: { fontFamily: fonts.headingRegular, fontSize: 18, color: colors.ink },

  scroll: { paddingHorizontal: 20 },

  avatarSection: { alignItems: 'center', paddingVertical: 28 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.plumSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarInitial: { fontFamily: fonts.headingBold, fontSize: 32, color: colors.plum },
  displayName: { fontFamily: fonts.headingRegular, fontSize: 26, color: colors.ink, letterSpacing: -0.5, marginBottom: 4 },
  email: { fontFamily: fonts.bodyRegular, fontSize: 14, color: colors.grey, marginBottom: 2 },
  phone: { fontFamily: fonts.bodyRegular, fontSize: 14, color: colors.grey },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.canvasPure,
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    ...shadows.subtle,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontFamily: fonts.headingRegular, fontSize: 22, color: colors.ink, letterSpacing: -0.5, marginBottom: 4, textAlign: 'center' },
  statLabel: { fontFamily: fonts.bodyRegular, fontSize: 12, color: colors.grey },
  statDivider: { width: 1, backgroundColor: colors.hairline, marginHorizontal: 8 },

  menuSection: { marginTop: 20 },
  sectionLabel: { fontFamily: fonts.bodyMedium, fontSize: 10, letterSpacing: 2, color: colors.grey, marginBottom: 10 },
  menuCard: {
    backgroundColor: colors.canvasPure,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.hairlineLight },
  menuItemText: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.ink },
  menuChevron: { fontFamily: fonts.headingRegular, fontSize: 20, color: colors.grey },

  signOutSection: { marginTop: 28, alignItems: 'center' },
  signOutBtn: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.error,
  },
  signOutText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.error },
});

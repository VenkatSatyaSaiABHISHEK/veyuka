import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  FadeInDown,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/useAuthStore';
import { colors, fonts, shadows } from '../../src/theme';
import { mockBookings } from '../../src/data/bookings';
import { mockCategories } from '../../src/data/categories';

const { width: W } = Dimensions.get('window');

const STATUS_CONFIG: Record<string, { label: string; dot: string }> = {
  confirmed: { label: 'Confirmed', dot: colors.success },
  planning: { label: 'Planning', dot: colors.info },
  preparation: { label: 'In Preparation', dot: colors.warning },
  ready: { label: 'Ready', dot: '#4A2275' },
  completed: { label: 'Completed', dot: colors.grey },
  cancelled: { label: 'Cancelled', dot: colors.error },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatCurrency(amount: number) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}

export default function CustomerHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();

  // Filter bookings for this customer (mock: cust-1 = Ananya)
  const myBookings = mockBookings.filter((b) => b.customerId === 'cust-1');
  const upcoming = myBookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled');
  const next = upcoming[0];

  const headerAnim = useSharedValue(0);
  const heroAnim = useSharedValue(0);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerAnim.value,
    transform: [{ translateY: (1 - headerAnim.value) * -8 }],
  }));

  useEffect(() => {
    const e = Easing.out(Easing.cubic);
    headerAnim.value = withTiming(1, { duration: 500, easing: e });
    heroAnim.value = withDelay(120, withTiming(1, { duration: 600, easing: e }));
  }, []);

  return (
    <View style={[styles.root]}>
      <StatusBar style="dark" />

      {/* ── HEADER ── */}
      <Animated.View style={[styles.header, { paddingTop: insets.top + 8 }, headerStyle]}>
        <View>
          <Text style={styles.greeting}>Good {getGreeting()}</Text>
          <Text style={styles.name}>{user?.name?.split(' ')[0] ?? 'Ananya'}</Text>
        </View>
        <TouchableOpacity style={styles.avatarBtn} onPress={() => router.push('/(customer)/profile')}>
          <Text style={styles.avatarInitial}>{(user?.name ?? 'A')[0]}</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── NEXT EVENT CARD ── */}
        {next && (
          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.section}>
            <Text style={styles.sectionLabel}>NEXT EVENT</Text>
            <TouchableOpacity
              style={styles.heroCard}
              activeOpacity={0.9}
              onPress={() => router.push({ pathname: '/(customer)/booking-detail', params: { id: next.id } })}
            >
              <Image
                source={{ uri: mockCategories.find(c => c.title === next.eventType)?.image ?? mockCategories[0].image }}
                style={styles.heroCardImage}
                contentFit="cover"
                transition={300}
              />
              <LinearGradient
                colors={['transparent', 'rgba(10,8,14,0.88)']}
                locations={[0.3, 1]}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <View style={styles.heroCardContent}>
                <View>
                  <Text style={styles.heroCardType}>{next.eventType.toUpperCase()}</Text>
                  <Text style={styles.heroCardName}>{next.packageName}</Text>
                  <Text style={styles.heroCardDate}>{formatDate(next.date)}</Text>
                </View>
                <View style={styles.statusRow}>
                  <View style={[styles.dot, { backgroundColor: STATUS_CONFIG[next.status]?.dot ?? colors.grey }]} />
                  <Text style={styles.statusText}>{STATUS_CONFIG[next.status]?.label ?? next.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* ── QUICK ACTIONS ── */}
        <Animated.View entering={FadeInDown.delay(180).duration(500)} style={styles.section}>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.qaCard} onPress={() => router.push('/(customer)/book')}>
              <Text style={styles.qaEmoji}>＋</Text>
              <Text style={styles.qaLabel}>Book Event</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.qaCard} onPress={() => router.push('/(customer)/bookings')}>
              <Text style={styles.qaEmoji}>≡</Text>
              <Text style={styles.qaLabel}>My Bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.qaCard} onPress={() => router.push('/(customer)/support')}>
              <Text style={styles.qaEmoji}>✉</Text>
              <Text style={styles.qaLabel}>Support</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ── ACTIVE BOOKINGS ── */}
        {upcoming.length > 0 && (
          <Animated.View entering={FadeInDown.delay(240).duration(500)} style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionLabel}>ACTIVE BOOKINGS</Text>
              <TouchableOpacity onPress={() => router.push('/(customer)/bookings')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            {upcoming.map((b, i) => (
              <TouchableOpacity
                key={b.id}
                style={[styles.bookingRow, i < upcoming.length - 1 && styles.bookingRowBorder]}
                onPress={() => router.push({ pathname: '/(customer)/booking-detail', params: { id: b.id } })}
                activeOpacity={0.7}
              >
                <View style={styles.bookingRowLeft}>
                  <View style={[styles.dot, styles.dotMd, { backgroundColor: STATUS_CONFIG[b.status]?.dot ?? colors.grey }]} />
                  <View>
                    <Text style={styles.bookingRowTitle}>{b.eventType} · {b.id}</Text>
                    <Text style={styles.bookingRowDate}>{formatDate(b.date)}</Text>
                  </View>
                </View>
                <Text style={styles.bookingRowAmount}>{formatCurrency(b.totalAmount)}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {/* ── EVENT TYPES ── */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.section}>
          <Text style={styles.sectionLabel}>PLAN SOMETHING NEW</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {mockCategories.slice(0, 6).map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.catCard}
                onPress={() => router.push('/(customer)/book')}
                activeOpacity={0.88}
              >
                <Image source={{ uri: cat.image }} style={styles.catImage} contentFit="cover" transition={300} />
                <LinearGradient
                  colors={['transparent', 'rgba(10,8,14,0.75)']}
                  locations={[0.3, 1]}
                  style={StyleSheet.absoluteFill}
                  pointerEvents="none"
                />
                <Text style={styles.catTitle}>{cat.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* ── SIGN OUT ── */}
        <View style={[styles.section, { paddingBottom: insets.bottom + 32 }]}>
          <View style={styles.hairline} />
          <TouchableOpacity
            onPress={() => { logout(); router.replace('/'); }}
            style={styles.signOutBtn}
          >
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning,';
  if (h < 17) return 'afternoon,';
  return 'evening,';
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  scroll: { paddingBottom: 24 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: colors.canvas,
  },
  greeting: {
    fontFamily: fonts.bodyRegular,
    fontSize: 13,
    color: colors.grey,
    marginBottom: 1,
  },
  name: {
    fontFamily: fonts.headingRegular,
    fontSize: 26,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.plumSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: fonts.headingBold,
    fontSize: 16,
    color: colors.plum,
  },

  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.grey,
    marginBottom: 12,
  },
  seeAll: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.plum,
  },

  /* Hero Card */
  heroCard: {
    height: 240,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.hairline,
    justifyContent: 'flex-end',
    ...shadows.card,
  },
  heroCardImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  heroCardContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  heroCardType: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 4,
  },
  heroCardName: {
    fontFamily: fonts.headingRegular,
    fontSize: 20,
    color: '#fff',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  heroCardDate: {
    fontFamily: fonts.bodyRegular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
  },

  /* Status */
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusText: { fontFamily: fonts.bodyMedium, fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  dot: { width: 7, height: 7, borderRadius: 4 },
  dotMd: { width: 9, height: 9, borderRadius: 5 },

  /* Quick Actions */
  quickActions: { flexDirection: 'row', gap: 12 },
  qaCard: {
    flex: 1,
    backgroundColor: colors.canvasPure,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.hairline,
    ...shadows.subtle,
  },
  qaEmoji: { fontFamily: fonts.headingRegular, fontSize: 22, color: colors.plum, marginBottom: 6 },
  qaLabel: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.ink },

  /* Booking Rows */
  bookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  bookingRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.hairlineLight },
  bookingRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bookingRowTitle: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.ink },
  bookingRowDate: { fontFamily: fonts.bodyRegular, fontSize: 12, color: colors.grey, marginTop: 2 },
  bookingRowAmount: { fontFamily: fonts.headingRegular, fontSize: 15, color: colors.ink },

  /* Category Scroll */
  catScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  catCard: {
    width: 120,
    height: 150,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 12,
    justifyContent: 'flex-end',
    backgroundColor: colors.hairline,
  },
  catImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  catTitle: {
    fontFamily: fonts.headingRegular,
    fontSize: 15,
    color: '#fff',
    padding: 12,
    letterSpacing: -0.2,
  },

  /* Footer */
  hairline: { height: 1, backgroundColor: colors.hairline, marginBottom: 20 },
  signOutBtn: { alignSelf: 'center' },
  signOutText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.grey },
});

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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/useAuthStore';
import { mockDashboardStats } from '../../src/data/dashboard';
import { mockBookings } from '../../src/data/bookings';
import { colors, fonts, radius, shadows } from '../../src/theme';

export default function OwnerDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logout } = useAuthStore();
  const stats = mockDashboardStats;

  const maxRevenue = Math.max(...stats.monthlyRevenue.map((m) => m.amount));

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 16) }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>VEYUKA</Text>
          <Text style={styles.brandSub}>Director Console</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            logout();
            router.replace('/');
          }}
          style={styles.signOutBtn}
        >
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 90 + insets.bottom }]}
      >
        {/* KPI Grid */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCardLarge}>
            <Text style={styles.kpiLabel}>TOTAL REVENUE</Text>
            <Text style={styles.kpiValueLarge}>₹{(stats.totalRevenue / 100000).toFixed(1)}L</Text>
            <Text style={styles.kpiGrowth}>+{stats.revenueGrowth}% vs last quarter</Text>
          </View>
          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>ACTIVE EVENTS</Text>
              <Text style={styles.kpiValue}>{stats.activeEvents}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>TOTAL BOOKINGS</Text>
              <Text style={styles.kpiValue}>{stats.totalBookings}</Text>
            </View>
          </View>
        </View>

        {/* Monthly Revenue Trend */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Revenue Trajectory</Text>
            <Text style={styles.sectionSubtitle}>Last 6 Months</Text>
          </View>
          <View style={styles.chartCard}>
            <View style={styles.barChartContainer}>
              {stats.monthlyRevenue.map((item) => {
                const heightPercent = (item.amount / maxRevenue) * 100;
                return (
                  <View key={item.month} style={styles.barColumn}>
                    <Text style={styles.barValue}>₹{(item.amount / 100000).toFixed(1)}L</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { height: `${heightPercent}%` }]} />
                    </View>
                    <Text style={styles.barLabel}>{item.month}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Needs Attention */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Requires Attention</Text>
            <View style={styles.badgeCount}>
              <Text style={styles.badgeCountText}>{stats.needsAttention.length}</Text>
            </View>
          </View>
          {stats.needsAttention.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.attentionCard}
              onPress={() => router.push('/(owner)/vendors')}
              activeOpacity={0.8}
            >
              <View style={styles.attentionBullet} />
              <View style={styles.attentionContent}>
                <Text style={styles.attentionTitle}>{item.title}</Text>
                <Text style={styles.attentionTime}>{item.time} • Booking #{item.bookingId}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Client Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Bookings</Text>
            <TouchableOpacity onPress={() => router.push('/(owner)/bookings')}>
              <Text style={styles.linkText}>View all</Text>
            </TouchableOpacity>
          </View>
          {mockBookings.slice(0, 4).map((b) => (
            <TouchableOpacity
              key={b.id}
              style={styles.bookingCard}
              onPress={() => router.push('/(owner)/bookings')}
              activeOpacity={0.85}
            >
              <View style={styles.bookingCardHeader}>
                <View>
                  <Text style={styles.bookingType}>{b.eventType.toUpperCase()}</Text>
                  <Text style={styles.bookingName}>{b.packageName}</Text>
                  <Text style={styles.bookingCustomer}>Client: {b.customerName}</Text>
                </View>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>{b.status}</Text>
                </View>
              </View>
              <View style={styles.bookingDivider} />
              <View style={styles.bookingCardFooter}>
                <Text style={styles.bookingDate}>{b.date}</Text>
                <Text style={styles.bookingPrice}>₹{(b.totalAmount / 100000).toFixed(2)}L</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Owner Bottom Nav */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(owner)/dashboard')}>
          <Text style={[styles.navText, styles.navTextActive]}>Overview</Text>
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
          <Text style={styles.navText}>More</Text>
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
  brand: {
    fontFamily: fonts.headingBold,
    fontSize: 20,
    letterSpacing: 4,
    color: colors.ink,
  },
  brandSub: {
    fontFamily: fonts.bodyRegular,
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.grey,
    marginTop: 2,
  },
  signOutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  signOutText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.inkSecondary,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  kpiGrid: {
    marginBottom: 24,
  },
  kpiCardLarge: {
    backgroundColor: colors.canvasPure,
    borderRadius: radius.md,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.hairline,
    ...shadows.subtle,
  },
  kpiLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.grey,
    marginBottom: 6,
  },
  kpiValueLarge: {
    fontFamily: fonts.headingRegular,
    fontSize: 34,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  kpiGrowth: {
    fontFamily: fonts.bodyRegular,
    fontSize: 12,
    color: colors.success,
    marginTop: 4,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.canvasPure,
    borderRadius: radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.hairline,
    ...shadows.subtle,
  },
  kpiValue: {
    fontFamily: fonts.headingRegular,
    fontSize: 26,
    color: colors.ink,
    marginTop: 4,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: fonts.headingRegular,
    fontSize: 20,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontFamily: fonts.bodyRegular,
    fontSize: 12,
    color: colors.grey,
  },
  badgeCount: {
    backgroundColor: colors.plum,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeCountText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    color: '#fff',
  },
  chartCard: {
    backgroundColor: colors.canvasPure,
    borderRadius: radius.md,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.hairline,
    ...shadows.subtle,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 20,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: 14,
    height: 90,
    backgroundColor: colors.canvasSubtle,
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginVertical: 6,
  },
  barFill: {
    width: '100%',
    backgroundColor: colors.plum,
    borderRadius: 7,
  },
  barValue: {
    fontFamily: fonts.bodyRegular,
    fontSize: 9,
    color: colors.grey,
  },
  barLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.inkSecondary,
  },
  attentionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.canvasPure,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  attentionBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
    marginTop: 6,
    marginRight: 12,
  },
  attentionContent: {
    flex: 1,
  },
  attentionTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.ink,
    lineHeight: 18,
  },
  attentionTime: {
    fontFamily: fonts.bodyRegular,
    fontSize: 11,
    color: colors.grey,
    marginTop: 4,
  },
  linkText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.plum,
  },
  bookingCard: {
    backgroundColor: colors.canvasPure,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.hairline,
    ...shadows.subtle,
  },
  bookingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookingType: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.grey,
  },
  bookingName: {
    fontFamily: fonts.headingRegular,
    fontSize: 16,
    color: colors.ink,
    marginTop: 2,
  },
  bookingCustomer: {
    fontFamily: fonts.bodyRegular,
    fontSize: 12,
    color: colors.inkSecondary,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.plumSubtle,
  },
  statusPillText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.plum,
    textTransform: 'capitalize',
  },
  bookingDivider: {
    height: 1,
    backgroundColor: colors.hairlineLight,
    marginVertical: 12,
  },
  bookingCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingDate: {
    fontFamily: fonts.bodyRegular,
    fontSize: 12,
    color: colors.grey,
  },
  bookingPrice: {
    fontFamily: fonts.headingBold,
    fontSize: 14,
    color: colors.ink,
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

import React, { useState } from 'react';
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
import { mockBookings } from '../../src/data/bookings';
import { colors, fonts, radius, shadows } from '../../src/theme';

const TABS = ['All', 'planning', 'preparation', 'ready', 'completed'] as const;

export default function OwnerBookings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('All');

  const filteredBookings = activeTab === 'All'
    ? mockBookings
    : mockBookings.filter((b) => b.status === activeTab);

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 16) }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>All Bookings</Text>
          <Text style={styles.headerSub}>Director Oversight • {mockBookings.length} total files</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Bookings List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 90 + insets.bottom }]}
      >
        {filteredBookings.map((b) => (
          <View key={b.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.cardType}>{b.eventType.toUpperCase()}</Text>
                <Text style={styles.cardTitle}>{b.packageName}</Text>
                <Text style={styles.cardCustomer}>Client: {b.customerName}</Text>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>{b.status}</Text>
              </View>
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>DATE</Text>
                <Text style={styles.detailValue}>{b.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>GUESTS</Text>
                <Text style={styles.detailValue}>{b.guestCount || '—'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>VENUE</Text>
                <Text style={styles.detailValue} numberOfLines={1}>{b.city || 'Mumbai'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.vendorNotice}>
                  {(b.assignedVendors?.length || 0)} vendor partners assigned
                </Text>
              </View>
              <Text style={styles.price}>
                ₹{(b.totalAmount / 100000).toFixed(2)}L
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Owner Bottom Nav */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(owner)/dashboard')}>
          <Text style={styles.navText}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(owner)/bookings')}>
          <Text style={[styles.navText, styles.navTextActive]}>Bookings</Text>
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
  tabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.canvasPure,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  tabActive: {
    backgroundColor: colors.plum,
    borderColor: colors.plum,
  },
  tabText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.inkSecondary,
  },
  tabTextActive: {
    color: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  card: {
    backgroundColor: colors.canvasPure,
    borderRadius: radius.md,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.hairline,
    ...shadows.subtle,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardType: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.grey,
  },
  cardTitle: {
    fontFamily: fonts.headingRegular,
    fontSize: 18,
    color: colors.ink,
    marginTop: 2,
  },
  cardCustomer: {
    fontFamily: fonts.bodyRegular,
    fontSize: 13,
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
  detailsRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 20,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.grey,
  },
  detailValue: {
    fontFamily: fonts.bodyRegular,
    fontSize: 13,
    color: colors.ink,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.hairlineLight,
    marginVertical: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vendorNotice: {
    fontFamily: fonts.bodyRegular,
    fontSize: 12,
    color: colors.grey,
  },
  price: {
    fontFamily: fonts.headingBold,
    fontSize: 15,
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

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
import { mockVendors } from '../../src/data/vendors';
import { colors, fonts, radius, shadows } from '../../src/theme';

const CATEGORIES = ['All', 'Decoration', 'Catering', 'Photography', 'Music', 'Venue', 'Makeup'] as const;

export default function OwnerVendors() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const filtered = selectedCat === 'All'
    ? mockVendors
    : mockVendors.filter((v) => v.category.toLowerCase() === selectedCat.toLowerCase());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return colors.success;
      case 'assigned':
        return colors.plum;
      case 'busy':
        return colors.gold;
      default:
        return colors.grey;
    }
  };

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 16) }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Vendor Partners</Text>
          <Text style={styles.headerSub}>Internal Roster • Direct Assignment Only</Text>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCat === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setSelectedCat(cat)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Vendors List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 90 + insets.bottom }]}
      >
        {filtered.map((v) => {
          const statusColor = getStatusColor(v.status);
          return (
            <View key={v.id} style={styles.vendorCard}>
              <View style={styles.cardHeader}>
                <View style={styles.headerInfo}>
                  <Text style={styles.categoryBadge}>{v.category.toUpperCase()}</Text>
                  <Text style={styles.vendorName}>{v.name}</Text>
                </View>
                <View style={styles.statusRow}>
                  <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                  <Text style={[styles.statusLabel, { color: statusColor }]}>{v.status}</Text>
                </View>
              </View>

              <View style={styles.metricsRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>RATING</Text>
                  <Text style={styles.metricVal}>★ {v.rating}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>COMPLETED</Text>
                  <Text style={styles.metricVal}>{v.completedEvents} events</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>PENDING PAY</Text>
                  <Text style={styles.metricVal}>
                    ₹{(v.paymentPending / 1000).toFixed(0)}k
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.contactRow}>
                <Text style={styles.contactText}>📞 {v.phone}</Text>
                <Text style={styles.contactText}>✉ {v.email}</Text>
              </View>

              <View style={styles.areasRow}>
                {v.areas.map((area, idx) => (
                  <View key={idx} style={styles.areaChip}>
                    <Text style={styles.areaChipText}>{area}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
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
          <Text style={[styles.navText, styles.navTextActive]}>Vendors</Text>
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
    paddingTop: 8,
  },
  vendorCard: {
    backgroundColor: colors.canvasPure,
    borderRadius: radius.md,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.hairline,
    ...shadows.subtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerInfo: {
    flex: 1,
  },
  categoryBadge: {
    fontFamily: fonts.bodyMedium,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.grey,
  },
  vendorName: {
    fontFamily: fonts.headingRegular,
    fontSize: 18,
    color: colors.ink,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    textTransform: 'capitalize',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 9,
    letterSpacing: 1.2,
    color: colors.grey,
  },
  metricVal: {
    fontFamily: fonts.headingBold,
    fontSize: 13,
    color: colors.ink,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.hairlineLight,
    marginVertical: 12,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  contactText: {
    fontFamily: fonts.bodyRegular,
    fontSize: 12,
    color: colors.inkSecondary,
  },
  areasRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  areaChip: {
    backgroundColor: colors.canvasSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  areaChipText: {
    fontFamily: fonts.bodyRegular,
    fontSize: 10,
    color: colors.grey,
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

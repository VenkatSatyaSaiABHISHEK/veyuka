import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, shadows } from '../../src/theme';
import { mockBookings } from '../../src/data/bookings';

const STATUS_CONFIG: Record<string, { label: string; dot: string; bg: string }> = {
  confirmed: { label: 'Confirmed', dot: colors.success, bg: colors.successBg },
  planning: { label: 'Planning', dot: colors.info, bg: colors.infoBg },
  preparation: { label: 'In Preparation', dot: colors.warning, bg: colors.warningBg },
  ready: { label: 'Event Ready', dot: colors.plum, bg: colors.plumSubtle },
  completed: { label: 'Completed', dot: colors.grey, bg: colors.canvasSubtle },
  cancelled: { label: 'Cancelled', dot: colors.error, bg: colors.errorBg },
};

const TABS = ['All', 'Active', 'Completed'];

function formatDate(ds: string) {
  return new Date(ds).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatCurrency(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

export default function CustomerBookings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState(0);

  const myBookings = mockBookings.filter((b) => b.customerId === 'cust-1');
  const filtered =
    tab === 0 ? myBookings :
    tab === 1 ? myBookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled') :
    myBookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Bookings</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((t, i) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === i && styles.tabActive]}
            onPress={() => setTab(i)}
          >
            <Text style={[styles.tabText, tab === i && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]} showsVerticalScrollIndicator={false}>
        {filtered.map((b, i) => {
          const sc = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.confirmed;
          return (
            <Animated.View key={b.id} entering={FadeInDown.delay(i * 60).duration(400)}>
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.88}
                onPress={() => router.push({ pathname: '/(customer)/booking-detail', params: { id: b.id } })}
              >
                {/* Status bar accent */}
                <View style={[styles.cardAccent, { backgroundColor: sc.dot }]} />
                <View style={styles.cardBody}>
                  <View style={styles.cardTop}>
                    <View style={styles.cardTopLeft}>
                      <Text style={styles.cardType}>{b.eventType}</Text>
                      <Text style={styles.cardId}>{b.id}</Text>
                    </View>
                    <View style={[styles.statusPill, { backgroundColor: sc.bg }]}>
                      <View style={[styles.dot, { backgroundColor: sc.dot }]} />
                      <Text style={[styles.statusText, { color: sc.dot }]}>{sc.label}</Text>
                    </View>
                  </View>

                  <Text style={styles.cardPkg}>{b.packageName}</Text>

                  <View style={styles.cardMeta}>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>DATE</Text>
                      <Text style={styles.metaValue}>{formatDate(b.date)}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>GUESTS</Text>
                      <Text style={styles.metaValue}>{b.guestCount}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>AMOUNT</Text>
                      <Text style={styles.metaValue}>{formatCurrency(b.totalAmount)}</Text>
                    </View>
                  </View>

                  {b.balanceDue > 0 && (
                    <View style={styles.balanceRow}>
                      <View style={styles.balanceLine} />
                      <Text style={styles.balanceText}>Balance due: {formatCurrency(b.balanceDue)}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.emptyBody}>Your bookings will appear here once confirmed.</Text>
          </View>
        )}
      </ScrollView>
    </View>
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
    backgroundColor: colors.canvas,
  },
  back: { fontFamily: fonts.headingRegular, fontSize: 22, color: colors.ink },
  title: { fontFamily: fonts.headingRegular, fontSize: 20, color: colors.ink, letterSpacing: -0.4 },

  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.canvasSubtle,
  },
  tabActive: { backgroundColor: colors.ink },
  tabText: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.grey },
  tabTextActive: { color: colors.white },

  scroll: { paddingHorizontal: 20 },

  card: {
    backgroundColor: colors.canvasPure,
    borderRadius: 16,
    marginBottom: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    ...shadows.card,
  },
  cardAccent: { width: 4 },
  cardBody: { flex: 1, padding: 16 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardTopLeft: {},
  cardType: { fontFamily: fonts.headingRegular, fontSize: 16, color: colors.ink, letterSpacing: -0.2 },
  cardId: { fontFamily: fonts.bodyRegular, fontSize: 11, color: colors.grey, marginTop: 1 },
  cardPkg: { fontFamily: fonts.bodyRegular, fontSize: 13, color: colors.inkSecondary, marginBottom: 12 },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 5,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: fonts.bodyMedium, fontSize: 11 },

  cardMeta: { flexDirection: 'row', gap: 20 },
  metaItem: {},
  metaLabel: { fontFamily: fonts.bodyMedium, fontSize: 9, letterSpacing: 1.5, color: colors.greyLight, marginBottom: 3 },
  metaValue: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.ink },

  balanceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 10 },
  balanceLine: { flex: 1, height: 1, backgroundColor: colors.hairline },
  balanceText: { fontFamily: fonts.bodyRegular, fontSize: 12, color: colors.warning },

  empty: { paddingTop: 80, alignItems: 'center' },
  emptyTitle: { fontFamily: fonts.headingRegular, fontSize: 24, color: colors.ink, marginBottom: 8 },
  emptyBody: { fontFamily: fonts.bodyRegular, fontSize: 14, color: colors.grey, textAlign: 'center' },
});

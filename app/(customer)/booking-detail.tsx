import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, shadows } from '../../src/theme';
import { mockBookings } from '../../src/data/bookings';
import { mockCategories } from '../../src/data/categories';

const STATUS_CONFIG: Record<string, { label: string; dot: string }> = {
  confirmed: { label: 'Confirmed', dot: colors.success },
  planning: { label: 'Planning', dot: colors.info },
  preparation: { label: 'In Preparation', dot: colors.warning },
  ready: { label: 'Event Ready', dot: colors.plum },
  completed: { label: 'Completed', dot: colors.grey },
  cancelled: { label: 'Cancelled', dot: colors.error },
};

function formatDate(ds: string) {
  return new Date(ds).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatCurrency(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

const TIMELINE_STEP_COLORS = {
  completed: colors.success,
  current: colors.plum,
  upcoming: colors.hairline,
};

export default function BookingDetail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const booking = mockBookings.find((b) => b.id === id) ?? mockBookings[0];
  const category = mockCategories.find((c) => c.title === booking.eventType) ?? mockCategories[0];
  const sc = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.confirmed;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32 }} showsVerticalScrollIndicator={false}>

        {/* ── HERO ── */}
        <View style={styles.hero}>
          <Image source={{ uri: category.image }} style={styles.heroImage} contentFit="cover" transition={300} />
          <LinearGradient
            colors={['rgba(10,8,14,0.35)', 'rgba(10,8,14,0.85)']}
            locations={[0, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          {/* Back */}
          <TouchableOpacity
            style={[styles.backBtn, { top: insets.top + 12 }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>

          <View style={styles.heroContent}>
            <View style={styles.statusRow}>
              <View style={[styles.dot, { backgroundColor: sc.dot }]} />
              <Text style={styles.heroStatus}>{sc.label}</Text>
            </View>
            <Text style={styles.heroType}>{booking.eventType}</Text>
            <Text style={styles.heroId}>{booking.id}</Text>
          </View>
        </View>

        {/* ── CONTENT ── */}
        <View style={styles.body}>

          {/* Package name */}
          <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.section}>
            <Text style={styles.packageName}>{booking.packageName}</Text>
            <View style={styles.hairline} />
          </Animated.View>

          {/* Key details */}
          <Animated.View entering={FadeInDown.delay(140).duration(400)} style={styles.section}>
            <Text style={styles.sectionLabel}>EVENT DETAILS</Text>
            <View style={styles.detailGrid}>
              <DetailItem label="Date" value={formatDate(booking.date)} />
              <DetailItem label="Time" value={booking.time} />
              <DetailItem label="Guests" value={`${booking.guestCount}`} />
              <DetailItem label="City" value={booking.city} />
            </View>
            <Text style={styles.addressText}>{booking.address}</Text>
          </Animated.View>

          {/* Payment */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={[styles.section, styles.paymentCard]}>
            <Text style={styles.sectionLabel}>PAYMENT SUMMARY</Text>
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>Total</Text>
              <Text style={styles.payValue}>{formatCurrency(booking.totalAmount)}</Text>
            </View>
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>Advance paid</Text>
              <Text style={[styles.payValue, { color: colors.success }]}>{formatCurrency(booking.advancePaid)}</Text>
            </View>
            {booking.balanceDue > 0 && (
              <View style={[styles.payRow, styles.payRowBorder]}>
                <Text style={[styles.payLabel, { color: colors.warning }]}>Balance due</Text>
                <Text style={[styles.payValue, { color: colors.warning }]}>{formatCurrency(booking.balanceDue)}</Text>
              </View>
            )}
          </Animated.View>

          {/* Timeline */}
          <Animated.View entering={FadeInDown.delay(260).duration(400)} style={styles.section}>
            <Text style={styles.sectionLabel}>PROGRESS</Text>
            {booking.timeline.map((step, i) => {
              const isLast = i === booking.timeline.length - 1;
              const dotColor = TIMELINE_STEP_COLORS[step.status as keyof typeof TIMELINE_STEP_COLORS] ?? colors.hairline;
              return (
                <View key={step.id} style={styles.timelineRow}>
                  <View style={styles.timelineLeft}>
                    <View style={[styles.timelineDot, { backgroundColor: dotColor, borderColor: dotColor }]} />
                    {!isLast && <View style={[styles.timelineLine, { backgroundColor: step.status === 'completed' ? colors.success : colors.hairline }]} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={[styles.timelineTitle, step.status === 'current' && styles.timelineTitleCurrent]}>
                      {step.title}
                    </Text>
                    <Text style={styles.timelineDesc}>{step.description}</Text>
                    {step.note && <Text style={styles.timelineNote}>{step.note}</Text>}
                    <Text style={styles.timelineDate}>{step.date}</Text>
                  </View>
                </View>
              );
            })}
          </Animated.View>

          {/* Special requests */}
          {booking.specialRequests && (
            <Animated.View entering={FadeInDown.delay(320).duration(400)} style={[styles.section, styles.noteCard]}>
              <Text style={styles.sectionLabel}>SPECIAL REQUESTS</Text>
              <Text style={styles.noteText}>{booking.specialRequests}</Text>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label.toUpperCase()}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },

  hero: { height: 280, justifyContent: 'flex-end' },
  heroImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  backBtn: {
    position: 'absolute',
    left: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: { fontFamily: fonts.headingRegular, fontSize: 20, color: '#fff' },
  heroContent: { padding: 24, paddingBottom: 28 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 8 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  heroStatus: { fontFamily: fonts.bodyMedium, fontSize: 12, color: 'rgba(255,255,255,0.8)', letterSpacing: 0.5 },
  heroType: { fontFamily: fonts.headingRegular, fontSize: 32, color: '#fff', letterSpacing: -0.8, marginBottom: 4 },
  heroId: { fontFamily: fonts.bodyRegular, fontSize: 12, color: 'rgba(255,255,255,0.6)' },

  body: { paddingHorizontal: 20, paddingTop: 4 },
  section: { marginTop: 24 },
  sectionLabel: { fontFamily: fonts.bodyMedium, fontSize: 10, letterSpacing: 2, color: colors.grey, marginBottom: 12 },
  packageName: { fontFamily: fonts.headingRegular, fontSize: 26, color: colors.ink, letterSpacing: -0.5, marginBottom: 20 },
  hairline: { height: 1, backgroundColor: colors.hairline },

  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 12 },
  detailItem: { minWidth: '44%' },
  detailLabel: { fontFamily: fonts.bodyMedium, fontSize: 9, letterSpacing: 1.5, color: colors.greyLight, marginBottom: 4 },
  detailValue: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.ink },
  addressText: { fontFamily: fonts.bodyRegular, fontSize: 13, color: colors.grey, lineHeight: 20 },

  paymentCard: {
    backgroundColor: colors.canvasPure,
    borderRadius: 14,
    padding: 16,
    ...shadows.subtle,
  },
  payRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  payRowBorder: { borderTopWidth: 1, borderTopColor: colors.hairline, marginTop: 4 },
  payLabel: { fontFamily: fonts.bodyRegular, fontSize: 14, color: colors.grey },
  payValue: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.ink },

  /* Timeline */
  timelineRow: { flexDirection: 'row', marginBottom: 4 },
  timelineLeft: { width: 32, alignItems: 'center' },
  timelineDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, marginTop: 3 },
  timelineLine: { flex: 1, width: 2, marginTop: 4, marginBottom: 0, minHeight: 28 },
  timelineContent: { flex: 1, paddingLeft: 10, paddingBottom: 22 },
  timelineTitle: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.inkSecondary, marginBottom: 3 },
  timelineTitleCurrent: { color: colors.plum },
  timelineDesc: { fontFamily: fonts.bodyRegular, fontSize: 13, color: colors.grey, lineHeight: 19 },
  timelineNote: {
    fontFamily: fonts.bodyRegular,
    fontSize: 12,
    color: colors.inkSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  timelineDate: { fontFamily: fonts.bodyRegular, fontSize: 11, color: colors.greyLight, marginTop: 4 },

  noteCard: {
    backgroundColor: colors.canvasSubtle,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.hairline,
  },
  noteText: { fontFamily: fonts.bodyRegular, fontSize: 14, color: colors.inkSecondary, lineHeight: 22 },
});

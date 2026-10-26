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

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function OwnerCalendar() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedDay, setSelectedDay] = useState<number>(15);

  // Simple representation of a 30-day month starting on Wednesday (offset 3)
  const offset = 3;
  const totalDays = 30;
  const calendarCells = Array.from({ length: 35 }, (_, i) => {
    const dayNum = i - offset + 1;
    return dayNum >= 1 && dayNum <= totalDays ? dayNum : null;
  });

  // Highlight days with events
  const eventDays = [5, 12, 15, 20, 24, 28];

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 16) }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Event Calendar</Text>
          <Text style={styles.headerSub}>November 2026 • 6 Productions Active</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 90 + insets.bottom }]}
      >
        {/* Month View Card */}
        <View style={styles.calendarCard}>
          <View style={styles.monthHeader}>
            <Text style={styles.monthName}>November 2026</Text>
            <Text style={styles.eventsCountNotice}>{eventDays.length} Booked Dates</Text>
          </View>

          {/* Days of week */}
          <View style={styles.weekRow}>
            {DAYS.map((d) => (
              <Text key={d} style={styles.weekDayText}>{d}</Text>
            ))}
          </View>

          {/* Days Grid */}
          <View style={styles.daysGrid}>
            {calendarCells.map((day, idx) => {
              if (!day) {
                return <View key={`empty-${idx}`} style={styles.dayCellEmpty} />;
              }
              const hasEvent = eventDays.includes(day);
              const isSelected = selectedDay === day;

              return (
                <TouchableOpacity
                  key={`day-${day}`}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                  ]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.dayTextSelected,
                      hasEvent && !isSelected && styles.dayTextHasEvent,
                    ]}
                  >
                    {day}
                  </Text>
                  {hasEvent && (
                    <View
                      style={[
                        styles.eventDot,
                        isSelected && styles.eventDotSelected,
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Date Schedule */}
        <View style={styles.scheduleSection}>
          <Text style={styles.scheduleTitle}>
            Events on Nov {selectedDay}, 2026
          </Text>

          {eventDays.includes(selectedDay) ? (
            mockBookings.slice(0, 2).map((b) => (
              <View key={b.id} style={styles.eventCard}>
                <View style={styles.eventTimeCol}>
                  <Text style={styles.eventTimeHour}>18:00</Text>
                  <Text style={styles.eventTimePeriod}>PM</Text>
                </View>
                <View style={styles.eventDivider} />
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTypeBadge}>{b.eventType.toUpperCase()}</Text>
                  <Text style={styles.eventHeading}>{b.packageName}</Text>
                  <Text style={styles.eventVenue}>{b.address || b.city || 'Taj Palace, Mumbai'}</Text>
                  <Text style={styles.eventClient}>Client: {b.customerName}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyDayNotice}>
              <Text style={styles.emptyDayText}>No events scheduled for this day.</Text>
              <Text style={styles.emptyDaySub}>Operations team available for new assignments.</Text>
            </View>
          )}
        </View>
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
          <Text style={[styles.navText, styles.navTextActive]}>Calendar</Text>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  calendarCard: {
    backgroundColor: colors.canvasPure,
    borderRadius: radius.md,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.hairline,
    ...shadows.subtle,
    marginBottom: 24,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthName: {
    fontFamily: fonts.headingRegular,
    fontSize: 18,
    color: colors.ink,
  },
  eventsCountNotice: {
    fontFamily: fonts.bodyRegular,
    fontSize: 12,
    color: colors.plum,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  weekDayText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.grey,
    width: 38,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: 38,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 3,
    borderRadius: radius.sm,
  },
  dayCellEmpty: {
    width: 38,
    height: 44,
    marginVertical: 3,
  },
  dayCellSelected: {
    backgroundColor: colors.plum,
  },
  dayText: {
    fontFamily: fonts.bodyRegular,
    fontSize: 13,
    color: colors.ink,
  },
  dayTextSelected: {
    color: '#fff',
    fontFamily: fonts.bodySemiBold,
  },
  dayTextHasEvent: {
    fontFamily: fonts.bodySemiBold,
    color: colors.ink,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.plum,
    marginTop: 3,
  },
  eventDotSelected: {
    backgroundColor: '#fff',
  },
  scheduleSection: {
    marginBottom: 20,
  },
  scheduleTitle: {
    fontFamily: fonts.headingRegular,
    fontSize: 18,
    color: colors.ink,
    marginBottom: 14,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: colors.canvasPure,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.hairline,
    ...shadows.subtle,
  },
  eventTimeCol: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  eventTimeHour: {
    fontFamily: fonts.headingBold,
    fontSize: 16,
    color: colors.ink,
  },
  eventTimePeriod: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    color: colors.grey,
  },
  eventDivider: {
    width: 1,
    backgroundColor: colors.hairlineLight,
    marginHorizontal: 14,
  },
  eventDetails: {
    flex: 1,
  },
  eventTypeBadge: {
    fontFamily: fonts.bodyMedium,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.plum,
    marginBottom: 2,
  },
  eventHeading: {
    fontFamily: fonts.headingRegular,
    fontSize: 16,
    color: colors.ink,
  },
  eventVenue: {
    fontFamily: fonts.bodyRegular,
    fontSize: 12,
    color: colors.grey,
    marginTop: 2,
  },
  eventClient: {
    fontFamily: fonts.bodyRegular,
    fontSize: 12,
    color: colors.inkSecondary,
    marginTop: 2,
  },
  emptyDayNotice: {
    backgroundColor: colors.canvasPure,
    borderRadius: radius.md,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  emptyDayText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.ink,
  },
  emptyDaySub: {
    fontFamily: fonts.bodyRegular,
    fontSize: 12,
    color: colors.grey,
    marginTop: 4,
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

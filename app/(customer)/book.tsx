import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, shadows } from '../../src/theme';
import { mockCategories } from '../../src/data/categories';

const STEPS = ['Event Type', 'Details', 'Review'];

export default function CustomerBook() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedCat = mockCategories.find(c => c.id === selectedCategory);

  const canProceed = step === 0 ? !!selectedCategory : step === 1 ? !!(guestCount && city && date) : true;

  function handleNext() {
    if (step < 2) setStep(s => s + 1);
    else {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <View style={[styles.root, styles.successRoot]}>
        <StatusBar style="dark" />
        <Animated.View entering={FadeIn.duration(600)} style={styles.successBox}>
          <Text style={styles.successCheck}>✓</Text>
          <Text style={styles.successTitle}>Request Received</Text>
          <Text style={styles.successBody}>
            Your {selectedCat?.title ?? 'event'} request has been submitted.{'\n'}
            A Veyuka director will contact you within 24 hours to confirm.
          </Text>
          <TouchableOpacity style={styles.doneBtn} onPress={() => router.replace('/(customer)/home')}>
            <Text style={styles.doneBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => step > 0 ? setStep(s => s - 1) : router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Plan My Event</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Step indicator */}
      <View style={styles.stepRow}>
        {STEPS.map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepDot, i <= step && styles.stepDotActive]} />
            <Text style={[styles.stepLabel, i === step && styles.stepLabelActive]}>{s}</Text>
            {i < STEPS.length - 1 && <View style={[styles.stepLine, i < step && styles.stepLineActive]} />}
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>

        {/* Step 0: Pick event type */}
        {step === 0 && (
          <Animated.View entering={FadeInDown.duration(350)}>
            <Text style={styles.stepHeading}>What are you celebrating?</Text>
            <Text style={styles.stepSub}>Select the type of event you'd like Veyuka to manage.</Text>
            <View style={styles.catGrid}>
              {mockCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catTile, selectedCategory === cat.id && styles.catTileSelected]}
                  onPress={() => setSelectedCategory(cat.id)}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri: cat.image }} style={styles.catTileImage} contentFit="cover" transition={200} />
                  <LinearGradient
                    colors={['transparent', 'rgba(10,8,14,0.82)']}
                    locations={[0.3, 1]}
                    style={StyleSheet.absoluteFill}
                    pointerEvents="none"
                  />
                  {selectedCategory === cat.id && (
                    <View style={styles.catCheck}><Text style={styles.catCheckText}>✓</Text></View>
                  )}
                  <Text style={styles.catTileTitle}>{cat.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <Animated.View entering={FadeInDown.duration(350)}>
            <Text style={styles.stepHeading}>{selectedCat?.title}</Text>
            <Text style={styles.stepSub}>Give us a few details so we can plan your perfect event.</Text>

            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>EVENT DATE</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 25 January 2027"
                placeholderTextColor={colors.greyLight}
                value={date}
                onChangeText={setDate}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>CITY</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Mumbai"
                placeholderTextColor={colors.greyLight}
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>APPROXIMATE GUEST COUNT</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 200"
                placeholderTextColor={colors.greyLight}
                keyboardType="number-pad"
                value={guestCount}
                onChangeText={setGuestCount}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>SPECIAL REQUESTS (OPTIONAL)</Text>
              <TextInput
                style={[styles.input, styles.inputMulti]}
                placeholder="Tell us about your dream vision..."
                placeholderTextColor={colors.greyLight}
                multiline
                numberOfLines={4}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </Animated.View>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <Animated.View entering={FadeInDown.duration(350)}>
            <Text style={styles.stepHeading}>Review & Submit</Text>
            <Text style={styles.stepSub}>Confirm your event request. Veyuka will take it from here.</Text>

            <View style={styles.reviewCard}>
              <Image source={{ uri: selectedCat?.image }} style={styles.reviewCardImage} contentFit="cover" transition={300} />
              <LinearGradient
                colors={['transparent', 'rgba(10,8,14,0.75)']}
                locations={[0.3, 1]}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <View style={styles.reviewCardOverlay}>
                <Text style={styles.reviewCardType}>{selectedCat?.title}</Text>
              </View>
            </View>

            <View style={styles.reviewItems}>
              <ReviewRow label="Event type" value={selectedCat?.title ?? '—'} />
              <ReviewRow label="Date" value={date || '—'} />
              <ReviewRow label="City" value={city || '—'} />
              <ReviewRow label="Guests" value={guestCount || '—'} />
              {notes ? <ReviewRow label="Notes" value={notes} /> : null}
            </View>

            <View style={styles.veyukaNote}>
              <Text style={styles.veyukaNoteText}>
                Veyuka handles all vendor selection and coordination internally. You will never need to contact or compare any vendors yourself.
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* CTA */}
      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[styles.ctaBtn, !canProceed && styles.ctaBtnDisabled]}
          onPress={handleNext}
          disabled={!canProceed}
          activeOpacity={0.82}
        >
          <Text style={styles.ctaBtnText}>{step === 2 ? 'Submit Request' : 'Continue'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label.toUpperCase()}</Text>
      <Text style={styles.reviewValue}>{value}</Text>
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
  },
  back: { fontFamily: fonts.headingRegular, fontSize: 22, color: colors.ink },
  title: { fontFamily: fonts.headingRegular, fontSize: 18, color: colors.ink },

  stepRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 0,
  },
  stepItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.hairline },
  stepDotActive: { backgroundColor: colors.plum },
  stepLabel: { fontFamily: fonts.bodyRegular, fontSize: 11, color: colors.grey, marginLeft: 5 },
  stepLabelActive: { color: colors.plum, fontFamily: fonts.bodyMedium },
  stepLine: { flex: 1, height: 1, backgroundColor: colors.hairline, marginHorizontal: 4 },
  stepLineActive: { backgroundColor: colors.plum },

  scroll: { paddingHorizontal: 20 },
  stepHeading: { fontFamily: fonts.headingRegular, fontSize: 28, color: colors.ink, letterSpacing: -0.6, marginBottom: 8 },
  stepSub: { fontFamily: fonts.bodyRegular, fontSize: 14, color: colors.grey, lineHeight: 21, marginBottom: 24 },

  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  catTile: {
    width: '47%',
    height: 110,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: colors.hairline,
  },
  catTileSelected: { borderWidth: 2.5, borderColor: colors.plum },
  catTileImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  catTileTitle: { fontFamily: fonts.headingRegular, fontSize: 15, color: '#fff', padding: 10 },
  catCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.plum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catCheckText: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: '#fff' },

  formSection: { marginBottom: 20 },
  fieldLabel: { fontFamily: fonts.bodyMedium, fontSize: 10, letterSpacing: 2, color: colors.grey, marginBottom: 8 },
  input: {
    backgroundColor: colors.canvasPure,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: fonts.bodyRegular,
    fontSize: 15,
    color: colors.ink,
  },
  inputMulti: { height: 110, paddingTop: 14, textAlignVertical: 'top' },

  reviewCard: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    justifyContent: 'flex-end',
    backgroundColor: colors.hairline,
  },
  reviewCardImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  reviewCardOverlay: { padding: 16 },
  reviewCardType: { fontFamily: fonts.headingRegular, fontSize: 24, color: '#fff', letterSpacing: -0.4 },

  reviewItems: {
    backgroundColor: colors.canvasPure,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.hairline,
    marginBottom: 16,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairlineLight,
  },
  reviewLabel: { fontFamily: fonts.bodyMedium, fontSize: 10, letterSpacing: 1.5, color: colors.grey },
  reviewValue: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.ink, maxWidth: '60%', textAlign: 'right' },

  veyukaNote: {
    backgroundColor: colors.plumSubtle,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: colors.plum,
  },
  veyukaNoteText: { fontFamily: fonts.bodyRegular, fontSize: 13, color: colors.inkSecondary, lineHeight: 20 },

  ctaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: colors.canvas,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  ctaBtn: { backgroundColor: colors.plum, borderRadius: 10, paddingVertical: 17, alignItems: 'center' },
  ctaBtnDisabled: { opacity: 0.4 },
  ctaBtnText: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.white, letterSpacing: 0.2 },

  successRoot: { alignItems: 'center', justifyContent: 'center', padding: 32 },
  successBox: { alignItems: 'center', maxWidth: 340 },
  successCheck: { fontSize: 56, color: colors.plum, marginBottom: 20, fontFamily: fonts.headingRegular },
  successTitle: { fontFamily: fonts.headingRegular, fontSize: 32, color: colors.ink, letterSpacing: -0.8, marginBottom: 12, textAlign: 'center' },
  successBody: { fontFamily: fonts.bodyRegular, fontSize: 15, color: colors.grey, lineHeight: 24, textAlign: 'center', marginBottom: 32 },
  doneBtn: { backgroundColor: colors.plum, paddingVertical: 16, paddingHorizontal: 40, borderRadius: 10 },
  doneBtnText: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.white },
});

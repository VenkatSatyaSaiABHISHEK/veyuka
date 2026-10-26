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
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/useAuthStore';
import { colors, fonts, shadows } from '../../src/theme';

const FAQ = [
  {
    q: 'Can I choose my own vendors?',
    a: 'Veyuka manages all vendor relationships internally. You deal only with us — we handle the rest.',
  },
  {
    q: 'How do I track my event progress?',
    a: 'Your booking detail page shows a live progress timeline updated by your event director.',
  },
  {
    q: 'What if I want to change something after booking?',
    a: 'Send us a message here and your dedicated event director will review and confirm all changes.',
  },
  {
    q: 'When is the balance payment due?',
    a: '70% of the balance is due 21 days before the event. Final 30% is cleared on event day.',
  },
];

export default function CustomerSupport() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Support</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>

        {/* Greeting */}
        <Animated.View entering={FadeInDown.delay(60).duration(400)} style={styles.section}>
          <Text style={styles.heading}>How can we help?</Text>
          <Text style={styles.subtext}>Your dedicated Veyuka director is always a message away.</Text>
        </Animated.View>

        {/* Contact card */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={[styles.section]}>
          <View style={styles.contactCard}>
            <View style={styles.contactRow}>
              <View style={styles.contactDot} />
              <View>
                <Text style={styles.contactName}>Tanya Singhal</Text>
                <Text style={styles.contactRole}>Your Event Director</Text>
              </View>
            </View>
            <Text style={styles.contactPhone}>+91 98200 00011</Text>
          </View>
        </Animated.View>

        {/* Message box */}
        <Animated.View entering={FadeInDown.delay(160).duration(400)} style={styles.section}>
          <Text style={styles.sectionLabel}>SEND A MESSAGE</Text>
          {sent ? (
            <View style={styles.sentBox}>
              <Text style={styles.sentTitle}>Message sent</Text>
              <Text style={styles.sentBody}>Your director will respond within 2–4 hours.</Text>
              <TouchableOpacity onPress={() => { setSent(false); setMessage(''); }}>
                <Text style={styles.sentLink}>Send another</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TextInput
                style={styles.msgInput}
                placeholder="Describe what you need help with…"
                placeholderTextColor={colors.greyLight}
                multiline
                numberOfLines={5}
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity
                style={[styles.sendBtn, !message.trim() && styles.sendBtnDisabled]}
                onPress={() => setSent(true)}
                disabled={!message.trim()}
                activeOpacity={0.82}
              >
                <Text style={styles.sendBtnText}>Send Message</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>

        {/* FAQ */}
        <Animated.View entering={FadeInDown.delay(220).duration(400)} style={styles.section}>
          <Text style={styles.sectionLabel}>FREQUENTLY ASKED</Text>
          {FAQ.map((f, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.faqRow, i < FAQ.length - 1 && styles.faqRowBorder]}
              onPress={() => setExpandedFaq(expandedFaq === i ? null : i)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQ}>{f.q}</Text>
                <Text style={styles.faqChevron}>{expandedFaq === i ? '−' : '+'}</Text>
              </View>
              {expandedFaq === i && <Text style={styles.faqA}>{f.a}</Text>}
            </TouchableOpacity>
          ))}
        </Animated.View>
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
  },
  back: { fontFamily: fonts.headingRegular, fontSize: 22, color: colors.ink },
  title: { fontFamily: fonts.headingRegular, fontSize: 18, color: colors.ink },

  scroll: { paddingHorizontal: 20 },
  section: { marginTop: 20 },
  sectionLabel: { fontFamily: fonts.bodyMedium, fontSize: 10, letterSpacing: 2, color: colors.grey, marginBottom: 12 },
  heading: { fontFamily: fonts.headingRegular, fontSize: 30, color: colors.ink, letterSpacing: -0.6, marginBottom: 8 },
  subtext: { fontFamily: fonts.bodyRegular, fontSize: 15, color: colors.grey, lineHeight: 23 },

  contactCard: {
    backgroundColor: colors.canvasPure,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.hairline,
    ...shadows.subtle,
  },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  contactDot: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.plumSubtle },
  contactName: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.ink },
  contactRole: { fontFamily: fonts.bodyRegular, fontSize: 12, color: colors.grey },
  contactPhone: { fontFamily: fonts.headingRegular, fontSize: 18, color: colors.plum, letterSpacing: -0.3 },

  msgInput: {
    backgroundColor: colors.canvasPure,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingHorizontal: 16,
    paddingTop: 14,
    fontFamily: fonts.bodyRegular,
    fontSize: 15,
    color: colors.ink,
    height: 130,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  sendBtn: {
    backgroundColor: colors.plum,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendBtnText: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.white },

  sentBox: {
    backgroundColor: colors.plumSubtle,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: colors.plum,
  },
  sentTitle: { fontFamily: fonts.headingRegular, fontSize: 22, color: colors.plum, marginBottom: 8 },
  sentBody: { fontFamily: fonts.bodyRegular, fontSize: 14, color: colors.inkSecondary, marginBottom: 16, textAlign: 'center' },
  sentLink: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.plum, textDecorationLine: 'underline' },

  faqRow: { paddingVertical: 16 },
  faqRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.hairlineLight },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  faqQ: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.ink, flex: 1, marginRight: 16, lineHeight: 20 },
  faqChevron: { fontFamily: fonts.headingRegular, fontSize: 20, color: colors.grey },
  faqA: { fontFamily: fonts.bodyRegular, fontSize: 13, color: colors.grey, lineHeight: 20, marginTop: 8 },
});

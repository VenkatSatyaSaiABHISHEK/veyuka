import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { colors, fonts } from '../../src/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const PHOTO_H = Math.round(SCREEN_H * 0.58);

// Cinematic hero photo — full bleed event photography
const HERO_PHOTO =
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=90';

export default function GuestLandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Fade-in animation values
  const headerOpacity = useSharedValue(0);
  const heroOpacity = useSharedValue(0);
  const photoOpacity = useSharedValue(0);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: (1 - headerOpacity.value) * -12 }],
  }));
  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: (1 - heroOpacity.value) * 18 }],
  }));
  const photoStyle = useAnimatedStyle(() => ({
    opacity: photoOpacity.value,
  }));

  useEffect(() => {
    const ease = Easing.out(Easing.cubic);
    headerOpacity.value = withTiming(1, { duration: 600, easing: ease });
    heroOpacity.value = withDelay(180, withTiming(1, { duration: 700, easing: ease }));
    photoOpacity.value = withDelay(380, withTiming(1, { duration: 800, easing: ease }));
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={Platform.OS === 'ios'}
      >
        {/* ─── HEADER ─── */}
        <Animated.View style={[styles.header, { paddingTop: insets.top + 8 }, headerStyle]}>
          <Text style={styles.wordmark}>VEYUKA</Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.signIn}>Sign in</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ─── HERO ─── */}
        <Animated.View style={[styles.heroBlock, heroStyle]}>
          {/* Soft ambient gradient mesh behind text */}
          <LinearGradient
            colors={[
              'rgba(244, 226, 222, 0.38)',
              'rgba(232, 224, 245, 0.28)',
              'rgba(251, 250, 248, 0)',
            ]}
            locations={[0, 0.55, 1]}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          <Text style={styles.headlineMain}>Your event.</Text>
          <Text style={styles.headlineItalic}>Our care.</Text>
          <Text style={styles.subtext}>
            Tell us what you're celebrating — Veyuka handles every detail, from venue to the very last bloom.
          </Text>

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.82}
          >
            <Text style={styles.ctaText}>Plan my event</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ─── PHOTO ─── */}
        <Animated.View style={[styles.photoWrapper, photoStyle]}>
          {/* Gradient placeholder shown while image loads */}
          <LinearGradient
            colors={['#E8DEFF', '#F4E2DE', '#F7F5F2']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Image
            source={{ uri: HERO_PHOTO }}
            style={styles.photo}
            contentFit="cover"
            transition={400}
          />
          {/* Dark gradient overlay for text readability */}
          <LinearGradient
            colors={['transparent', 'rgba(10, 8, 14, 0.42)', 'rgba(10, 8, 14, 0.85)']}
            locations={[0.3, 0.68, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View style={styles.photoTextBlock}>
            <Text style={styles.photoLabel}>FULLY MANAGED</Text>
            <Text style={styles.photoCaption}>
              One conversation.{'\n'}Every detail arranged.
            </Text>
          </View>
        </Animated.View>

        {/* ─── FOOTER NOTE ─── */}
        <View style={styles.footerNote}>
          <View style={styles.footerLine} />
          <Text style={styles.footerText}>
            Weddings · Engagements · Birthdays · Corporate · Cultural · Private Celebrations
          </Text>
          <View style={styles.footerLine} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scroll: {
    flexGrow: 1,
    backgroundColor: colors.canvas,
    paddingBottom: 56,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 12,
    backgroundColor: colors.canvas,
  },
  wordmark: {
    fontFamily: fonts.headingBold,
    fontSize: 20,
    letterSpacing: 5,
    color: colors.ink,
  },
  signIn: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.inkSecondary,
    letterSpacing: 0.1,
  },

  /* Hero */
  heroBlock: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    overflow: 'hidden',
  },
  headlineMain: {
    fontFamily: fonts.headingRegular,
    fontSize: 56,
    lineHeight: 62,
    letterSpacing: -1.8,
    color: colors.ink,
  },
  headlineItalic: {
    fontFamily: fonts.headingItalic,
    fontSize: 56,
    lineHeight: 64,
    letterSpacing: -0.8,
    color: colors.ink,
    marginBottom: 20,
  },
  subtext: {
    fontFamily: fonts.bodyRegular,
    fontSize: 16,
    lineHeight: 25,
    color: colors.grey,
    maxWidth: 320,
    marginBottom: 32,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.plum,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  ctaText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    letterSpacing: 0.3,
    color: colors.white,
  },

  /* Photo */
  photoWrapper: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    height: PHOTO_H,
    backgroundColor: '#E8DEFF',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoTextBlock: {
    position: 'absolute',
    bottom: 32,
    left: 28,
    right: 28,
  },
  photoLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 2.4,
    color: 'rgba(255,255,255,0.68)',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  photoCaption: {
    fontFamily: fonts.headingRegular,
    fontSize: 30,
    lineHeight: 37,
    letterSpacing: -0.5,
    color: '#FFFFFF',
  },

  /* Footer */
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 36,
    gap: 12,
  },
  footerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.hairline,
  },
  footerText: {
    fontFamily: fonts.bodyRegular,
    fontSize: 11,
    color: colors.greyLight,
    textAlign: 'center',
    letterSpacing: 0.2,
    flex: 3,
  },
});

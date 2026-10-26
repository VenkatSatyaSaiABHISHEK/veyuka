import { TextStyle } from 'react-native';
import { colors } from './colors';

export const fonts = {
  // Serif Display: Playfair Display
  headingRegular: 'PlayfairDisplay_400Regular',
  headingMedium: 'PlayfairDisplay_600SemiBold',
  headingBold: 'PlayfairDisplay_700Bold',
  headingBlack: 'PlayfairDisplay_900Black',
  headingItalic: 'PlayfairDisplay_400Regular_Italic',

  // Sans Body: Inter
  bodyRegular: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
};

export const typography: Record<string, TextStyle> = {
  // Hero Display: 54-64pt, tight line height, editorial presence
  hero: {
    fontFamily: fonts.headingRegular,
    fontSize: 54,
    lineHeight: 58,
    letterSpacing: -1.6,
    color: colors.ink,
  },
  heroBold: {
    fontFamily: fonts.headingBold,
    fontSize: 54,
    lineHeight: 58,
    letterSpacing: -1.6,
    color: colors.ink,
  },
  heroItalic: {
    fontFamily: fonts.headingItalic,
    fontSize: 54,
    lineHeight: 58,
    letterSpacing: -0.8,
    color: colors.ink,
  },

  // Section Display Titles
  h1: {
    fontFamily: fonts.headingRegular,
    fontSize: 40,
    lineHeight: 46,
    letterSpacing: -1.0,
    color: colors.ink,
  },
  h1Bold: {
    fontFamily: fonts.headingBold,
    fontSize: 40,
    lineHeight: 46,
    letterSpacing: -1.0,
    color: colors.ink,
  },
  h2: {
    fontFamily: fonts.headingMedium,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.6,
    color: colors.ink,
  },
  h3: {
    fontFamily: fonts.headingMedium,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
    color: colors.ink,
  },

  // Large Conversational & Greeting Heading
  conversationHeader: {
    fontFamily: fonts.headingRegular,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.8,
    color: colors.ink,
  },

  // Numeral (antique gold accents)
  numeralLarge: {
    fontFamily: fonts.headingRegular,
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -1.0,
    color: colors.gold,
  },
  numeralMedium: {
    fontFamily: fonts.headingRegular,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.5,
    color: colors.gold,
  },
  numeralSmall: {
    fontFamily: fonts.headingRegular,
    fontSize: 18,
    lineHeight: 22,
    color: colors.gold,
  },

  // Body & Paragraphs
  bodyLarge: {
    fontFamily: fonts.bodyRegular,
    fontSize: 17,
    lineHeight: 26,
    color: colors.grey,
  },
  body: {
    fontFamily: fonts.bodyRegular,
    fontSize: 15,
    lineHeight: 23,
    color: colors.grey,
  },
  bodyMedium: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 23,
    color: colors.ink,
  },
  bodyBold: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    lineHeight: 23,
    color: colors.ink,
  },

  // Captions & Secondary Text
  caption: {
    fontFamily: fonts.bodyRegular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.grey,
  },
  captionMedium: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.ink,
  },

  // Primary Button (Text only, Inter Medium)
  button: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: colors.white,
  },

  // Secondary Underlined Link
  link: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18,
    color: colors.ink,
    textDecorationLine: 'underline',
  },

  // Subtle Label / Tag
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.grey,
  },

  // Editorial Title
  title: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.ink,
  },
};

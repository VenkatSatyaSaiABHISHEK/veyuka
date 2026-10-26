import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../src/theme';

export default function CustomerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.deepPlum },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="home" options={{ animation: 'fade' }} />
      <Stack.Screen name="bookings" options={{ animation: 'fade' }} />
      <Stack.Screen name="support" options={{ animation: 'fade' }} />
      <Stack.Screen name="profile" options={{ animation: 'fade' }} />
      <Stack.Screen name="book" options={{ animation: 'slide_from_bottom', presentation: 'card' }} />
      <Stack.Screen name="booking-detail" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}

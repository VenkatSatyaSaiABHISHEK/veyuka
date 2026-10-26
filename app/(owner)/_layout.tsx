import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../src/theme';

export default function OwnerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.canvas },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="dashboard" options={{ animation: 'fade' }} />
      <Stack.Screen name="bookings" options={{ animation: 'fade' }} />
      <Stack.Screen name="calendar" options={{ animation: 'fade' }} />
      <Stack.Screen name="vendors" options={{ animation: 'fade' }} />
      <Stack.Screen name="more" options={{ animation: 'fade' }} />
    </Stack>
  );
}

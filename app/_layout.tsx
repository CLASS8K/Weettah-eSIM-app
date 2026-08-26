import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { EsimProvider } from '../lib/esimStore';
import { colors } from '../theme/colors';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <EsimProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="destination/[id]" options={{ title: 'Destination' }} />
          <Stack.Screen name="plan/[id]" options={{ title: 'Plan details' }} />
          <Stack.Screen name="checkout/[id]" options={{ title: 'Checkout', presentation: 'modal' }} />
          <Stack.Screen name="esim/[id]" options={{ title: 'Your eSIM' }} />
        </Stack>
      </EsimProvider>
    </SafeAreaProvider>
  );
}

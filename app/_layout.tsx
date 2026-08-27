import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { EsimProvider } from '../lib/esimStore';
import { OnboardingProvider, useOnboarding } from '../lib/onboarding';
import { ThemeProvider, useTheme } from '../theme/ThemeContext';

function Gate() {
  const { colors, scheme } = useTheme();
  const { completed } = useOnboarding();

  if (completed === null) return null;

  return (
    <>
      <StatusBar style={scheme === 'light' ? 'dark' : 'light'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="destination/[id]" options={{ title: 'Destination' }} />
        <Stack.Screen name="plan/[id]" options={{ title: 'Plan details' }} />
        <Stack.Screen name="checkout/[id]" options={{ title: 'Checkout', presentation: 'modal' }} />
        <Stack.Screen name="esim/[id]" options={{ title: 'Your eSIM' }} />
      </Stack>
      {!completed && <Redirect href="/onboarding" />}
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <OnboardingProvider>
          <EsimProvider>
            <Gate />
          </EsimProvider>
        </OnboardingProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

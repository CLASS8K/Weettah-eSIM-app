import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { getDestination, getPlan } from '../../lib/data';
import { useEsims } from '../../lib/esimStore';
import { ColorScheme, radius, spacing } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';

const DEPARTURE_OPTIONS = [
  { label: 'In 3 days', days: 3 },
  { label: 'In 1 week', days: 7 },
  { label: 'In 2 weeks', days: 14 },
  { label: 'In 1 month', days: 30 },
];

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { purchaseEsim } = useEsims();
  const [processing, setProcessing] = useState(false);
  const [departureDays, setDepartureDays] = useState<number | null>(null);

  const plan = getPlan(id);
  const destination = plan ? getDestination(plan.destinationId) : undefined;

  if (!plan || !destination) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Plan not found.</Text>
      </View>
    );
  }

  const handlePay = () => {
    setProcessing(true);
    // Simulated payment processing — replace with a real payment provider integration.
    setTimeout(() => {
      const departureDate = departureDays != null ? new Date(Date.now() + departureDays * 24 * 60 * 60 * 1000) : undefined;
      const esim = purchaseEsim(plan.id, departureDate);
      setProcessing(false);
      router.replace(`/esim/${esim.id}`);
    }, 900);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Checkout' }} />

      <View style={styles.row}>
        <Text style={styles.label}>Destination</Text>
        <Text style={styles.value}>
          {destination.flag} {destination.name}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Data</Text>
        <Text style={styles.value}>{plan.dataAmountGb} GB</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Validity</Text>
        <Text style={styles.value}>{plan.validityDays} days</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>${plan.priceUsd.toFixed(2)}</Text>
      </View>

      <View style={styles.paymentCard}>
        <Text style={styles.paymentLabel}>Payment method</Text>
        <Text style={styles.paymentValue}>💳 •••• 4242 (demo card)</Text>
      </View>

      <Text style={styles.sectionLabel}>When do you depart?</Text>
      <Text style={styles.sectionHint}>
        Optional — we'll send a reminder 24 hours before so your eSIM is ready the moment you land.
      </Text>
      <View style={styles.departureRow}>
        {DEPARTURE_OPTIONS.map((option) => {
          const selected = departureDays === option.days;
          return (
            <Pressable
              key={option.days}
              onPress={() => setDepartureDays(selected ? null : option.days)}
              style={[styles.departureChip, selected && styles.departureChipSelected]}
            >
              <Text style={[styles.departureChipText, selected && styles.departureChipTextSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.spacer} />

      <PrimaryButton label={processing ? 'Processing…' : `Pay $${plan.priceUsd.toFixed(2)}`} onPress={handlePay} loading={processing} />
      <Text style={styles.disclaimer}>This is a demo checkout — no real payment is processed.</Text>
    </ScrollView>
  );
}

function getStyles(colors: ColorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
      flexGrow: 1,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
    },
    label: {
      color: colors.textMuted,
      fontSize: 14,
    },
    value: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.sm,
    },
    totalLabel: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
    },
    totalValue: {
      color: colors.primary,
      fontSize: 20,
      fontWeight: '800',
    },
    paymentCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      marginTop: spacing.lg,
    },
    paymentLabel: {
      color: colors.textMuted,
      fontSize: 12,
      marginBottom: 4,
    },
    paymentValue: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '600',
    },
    sectionLabel: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '700',
      marginTop: spacing.lg,
      marginBottom: 2,
    },
    sectionHint: {
      color: colors.textMuted,
      fontSize: 12,
      lineHeight: 16,
      marginBottom: spacing.sm,
    },
    departureRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    departureChip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.xl,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    departureChipSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    departureChipText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: '600',
    },
    departureChipTextSelected: {
      color: colors.onPrimary,
    },
    spacer: {
      flex: 1,
      minHeight: spacing.xl,
    },
    disclaimer: {
      color: colors.textMuted,
      fontSize: 12,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
    notFound: {
      color: colors.textMuted,
      padding: spacing.lg,
    },
  });
}

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { getDestination, getPlan } from '../../lib/data';
import { useEsims } from '../../lib/esimStore';
import { colors, radius, spacing } from '../../theme/colors';

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { purchaseEsim } = useEsims();
  const [processing, setProcessing] = useState(false);

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
      const esim = purchaseEsim(plan.id);
      setProcessing(false);
      router.replace(`/esim/${esim.id}`);
    }, 900);
  };

  return (
    <View style={styles.container}>
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

      <View style={styles.spacer} />

      <PrimaryButton label={processing ? 'Processing…' : `Pay $${plan.priceUsd.toFixed(2)}`} onPress={handlePay} loading={processing} />
      <Text style={styles.disclaimer}>This is a demo checkout — no real payment is processed.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg,
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

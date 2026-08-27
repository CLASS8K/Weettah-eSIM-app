import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { getDestination, getPlan } from '../../lib/data';
import { ColorScheme, radius, spacing } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';

const FEATURES = [
  'Instant delivery — install in minutes',
  'No physical SIM swap needed',
  'Keep your home number active for calls & texts',
  'Top up anytime from the app',
];

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const plan = getPlan(id);
  const destination = plan ? getDestination(plan.destinationId) : undefined;

  if (!plan || !destination) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Plan not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: `${destination.name} eSIM` }} />

      <View style={styles.summaryCard}>
        <Text style={styles.flag}>{destination.flag}</Text>
        <Text style={styles.destinationName}>{destination.name}</Text>
        <Text style={styles.dataAmount}>{plan.dataAmountGb} GB</Text>
        <Text style={styles.meta}>
          Valid {plan.validityDays} days · {plan.networkType}
        </Text>
        <Text style={styles.price}>${plan.priceUsd.toFixed(2)}</Text>
      </View>

      <Text style={styles.sectionLabel}>What's included</Text>
      <View style={styles.features}>
        {FEATURES.map((feature) => (
          <View key={feature} style={styles.featureRow}>
            <Text style={styles.featureBullet}>✓</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Network coverage</Text>
      <Text style={styles.coverage}>{destination.coverage.join(' · ')}</Text>

      <View style={styles.spacer} />

      <PrimaryButton label={`Buy for $${plan.priceUsd.toFixed(2)}`} onPress={() => router.push(`/checkout/${plan.id}`)} />
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
    },
    summaryCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    flag: {
      fontSize: 40,
    },
    destinationName: {
      color: colors.textMuted,
      fontSize: 15,
      marginTop: spacing.xs,
    },
    dataAmount: {
      color: colors.text,
      fontSize: 36,
      fontWeight: '800',
      marginTop: spacing.sm,
    },
    meta: {
      color: colors.textMuted,
      fontSize: 14,
      marginTop: 4,
    },
    price: {
      color: colors.primary,
      fontSize: 24,
      fontWeight: '800',
      marginTop: spacing.md,
    },
    sectionLabel: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: spacing.sm,
    },
    features: {
      marginBottom: spacing.lg,
    },
    featureRow: {
      flexDirection: 'row',
      marginBottom: spacing.sm,
    },
    featureBullet: {
      color: colors.primary,
      fontWeight: '800',
      marginRight: spacing.sm,
    },
    featureText: {
      color: colors.text,
      fontSize: 14,
      flex: 1,
    },
    coverage: {
      color: colors.textMuted,
      fontSize: 14,
      marginBottom: spacing.lg,
    },
    spacer: {
      height: spacing.md,
    },
    notFound: {
      color: colors.textMuted,
      padding: spacing.lg,
    },
  });
}

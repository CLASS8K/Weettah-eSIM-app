import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { PrimaryButton } from '../../components/PrimaryButton';
import { StatusPill } from '../../components/StatusPill';
import { getDestination, getPlan } from '../../lib/data';
import { useEsims } from '../../lib/esimStore';
import { colors, radius, spacing } from '../../theme/colors';

export default function EsimDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { esims, activateEsim } = useEsims();

  const esim = esims.find((e) => e.id === id);
  const plan = esim ? getPlan(esim.planId) : undefined;
  const destination = esim ? getDestination(esim.destinationId) : undefined;

  if (!esim || !plan || !destination) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>eSIM not found.</Text>
      </View>
    );
  }

  const remainingGb = Math.max(plan.dataAmountGb - esim.dataUsedGb, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: `${destination.name} eSIM` }} />

      <View style={styles.headerCard}>
        <Text style={styles.flag}>{destination.flag}</Text>
        <Text style={styles.name}>{destination.name}</Text>
        <StatusPill status={esim.status} />
      </View>

      {esim.status === 'pending' ? (
        <View style={styles.qrCard}>
          <Text style={styles.qrTitle}>Scan to install</Text>
          <Text style={styles.qrSubtitle}>
            Open Settings → Cellular → Add eSIM on your phone and scan this code, or tap the button below to
            simulate installing it on this device.
          </Text>
          <View style={styles.qrWrapper}>
            <QRCode value={esim.activationCode} size={200} backgroundColor={colors.surfaceLight} color={colors.textDark} />
          </View>
          <Text style={styles.activationCode}>{esim.activationCode}</Text>
          <PrimaryButton label="Simulate install" onPress={() => activateEsim(esim.id)} />
        </View>
      ) : (
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Data remaining</Text>
            <Text style={styles.statValue}>
              {remainingGb.toFixed(1)} / {plan.dataAmountGb} GB
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Validity</Text>
            <Text style={styles.statValue}>{plan.validityDays} days</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Network</Text>
            <Text style={styles.statValue}>{plan.networkType}</Text>
          </View>
        </View>
      )}

      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>eSIM details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>ICCID</Text>
          <Text style={styles.detailValue}>{esim.iccid}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Purchased</Text>
          <Text style={styles.detailValue}>{new Date(esim.purchasedAt).toLocaleDateString()}</Text>
        </View>
      </View>

      <PrimaryButton label="Back to My eSIMs" variant="outline" onPress={() => router.replace('/(tabs)/my-esims')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  headerCard: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  flag: {
    fontSize: 40,
  },
  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  qrCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  qrTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  qrSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  qrWrapper: {
    backgroundColor: colors.surfaceLight,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  activationCode: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  statValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  detailsTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  detailValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  notFound: {
    color: colors.textMuted,
    padding: spacing.lg,
  },
});

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { getDestination, getPlan } from '../../lib/data';
import { getSimulatedDataUsedGb, PurchasedEsim, useEsims } from '../../lib/esimStore';
import { ColorScheme, radius, spacing } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';

const RING_SIZE = 84;
const RING_STROKE = 8;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function UsageRing({ percentage, colors }: { percentage: number; colors: ColorScheme }) {
  const offset = RING_CIRCUMFERENCE - (Math.min(Math.max(percentage, 0), 100) / 100) * RING_CIRCUMFERENCE;
  return (
    <Svg width={RING_SIZE} height={RING_SIZE}>
      <Circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_RADIUS}
        stroke={colors.border}
        strokeWidth={RING_STROKE}
        fill="none"
      />
      <Circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_RADIUS}
        stroke={colors.primary}
        strokeWidth={RING_STROKE}
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={offset}
        strokeLinecap="round"
        fill="none"
        transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
      />
    </Svg>
  );
}

function historySummary(esim: PurchasedEsim): string {
  const plan = getPlan(esim.planId);
  if (!plan) return '';
  if (esim.status === 'pending') return 'Not installed yet';
  const used = getSimulatedDataUsedGb(esim, plan);
  return `${used.toFixed(1)} / ${plan.dataAmountGb} GB used`;
}

export default function UsageScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { esims } = useEsims();

  const current = esims.find((e) => e.status === 'active');
  const currentPlan = current ? getPlan(current.planId) : undefined;
  const currentDestination = current ? getDestination(current.destinationId) : undefined;

  const usedGb = current && currentPlan ? getSimulatedDataUsedGb(current, currentPlan) : 0;
  const remainingGb = currentPlan ? Math.max(currentPlan.dataAmountGb - usedGb, 0) : 0;
  const elapsedDays =
    current?.activatedAt != null ? (Date.now() - new Date(current.activatedAt).getTime()) / (1000 * 60 * 60 * 24) : 0;
  const daysRemaining = currentPlan ? Math.max(Math.round(currentPlan.validityDays - elapsedDays), 0) : 0;
  const avgPerDay = usedGb / Math.max(elapsedDays, 1);
  const percentage = currentPlan ? (usedGb / currentPlan.dataAmountGb) * 100 : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Usage</Text>
      <Text style={styles.subtitle}>Your travel network status</Text>

      {current && currentPlan && currentDestination ? (
        <>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <UsageRing percentage={percentage} colors={colors} />
              <View style={styles.summaryTextCol}>
                <Text style={styles.summaryDestination}>
                  {currentDestination.flag} {currentDestination.name}
                </Text>
                <Text style={styles.summaryUsed}>{usedGb.toFixed(1)} GB used</Text>
                <Text style={styles.summaryMeta}>
                  of {currentPlan.dataAmountGb} GB · {Math.round(percentage)}%
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statGrid}>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{daysRemaining}</Text>
              <Text style={styles.statLabel}>Days remaining</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{remainingGb.toFixed(1)} GB</Text>
              <Text style={styles.statLabel}>Data remaining</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{(avgPerDay * 1000).toFixed(0)} MB</Text>
              <Text style={styles.statLabel}>Avg per day</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{currentPlan.networkType}</Text>
              <Text style={styles.statLabel}>Network</Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No active eSIM yet. Activate one to see live usage here.</Text>
        </View>
      )}

      <Text style={styles.sectionLabel}>Trip history</Text>
      <View style={styles.history}>
        {esims.length === 0 ? (
          <Text style={styles.emptyText}>No trips yet.</Text>
        ) : (
          esims.map((esim) => {
            const destination = getDestination(esim.destinationId);
            if (!destination) return null;
            return (
              <View key={esim.id} style={styles.historyRow}>
                <Text style={styles.historyFlag}>{destination.flag}</Text>
                <View style={styles.historyTextCol}>
                  <Text style={styles.historyName}>{destination.name}</Text>
                  <Text style={styles.historyDate}>{new Date(esim.purchasedAt).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.historyUsage}>{historySummary(esim)}</Text>
              </View>
            );
          })
        )}
      </View>
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
    title: {
      color: colors.text,
      fontSize: 28,
      fontWeight: '800',
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 14,
      marginTop: 2,
      marginBottom: spacing.lg,
    },
    summaryCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
    },
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    summaryTextCol: {
      flex: 1,
    },
    summaryDestination: {
      color: colors.textMuted,
      fontSize: 13,
      marginBottom: 4,
    },
    summaryUsed: {
      color: colors.text,
      fontSize: 24,
      fontWeight: '800',
    },
    summaryMeta: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 2,
    },
    statGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    statCard: {
      width: '48%',
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
    },
    statValue: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '800',
      marginBottom: 2,
    },
    statLabel: {
      color: colors.textMuted,
      fontSize: 12,
    },
    emptyCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.xl,
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    emptyText: {
      color: colors.textMuted,
      fontSize: 14,
      textAlign: 'center',
    },
    sectionLabel: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: spacing.sm,
    },
    history: {
      gap: spacing.sm,
    },
    historyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      gap: spacing.sm,
    },
    historyFlag: {
      fontSize: 22,
    },
    historyTextCol: {
      flex: 1,
    },
    historyName: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '700',
    },
    historyDate: {
      color: colors.textMuted,
      fontSize: 11,
      marginTop: 1,
    },
    historyUsage: {
      color: colors.textMuted,
      fontSize: 12,
    },
  });
}

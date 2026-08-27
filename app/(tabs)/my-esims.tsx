import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusPill } from '../../components/StatusPill';
import { getDestination, getPlan } from '../../lib/data';
import { PurchasedEsim, useEsims } from '../../lib/esimStore';
import { ColorScheme, radius, spacing } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';

function EsimRow({ esim, colors }: { esim: PurchasedEsim; colors: ColorScheme }) {
  const router = useRouter();
  const styles = getStyles(colors);
  const plan = getPlan(esim.planId);
  const destination = getDestination(esim.destinationId);
  if (!plan || !destination) return null;

  return (
    <Pressable
      onPress={() => router.push(`/esim/${esim.id}`)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Text style={styles.flag}>{destination.flag}</Text>
      <View style={styles.info}>
        <Text style={styles.name}>{destination.name}</Text>
        <Text style={styles.meta}>
          {plan.dataAmountGb} GB · {plan.validityDays} days
        </Text>
        <StatusPill status={esim.status} />
      </View>
    </Pressable>
  );
}

export default function MyEsimsScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { esims, loading } = useEsims();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FlatList
        data={esims}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Text style={styles.title}>My eSIMs</Text>}
        renderItem={({ item }) => <EsimRow esim={item} colors={colors} />}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No eSIMs yet</Text>
              <Text style={styles.emptySubtitle}>
                Buy a plan for your next trip and it'll show up here, ready to install.
              </Text>
              <Pressable onPress={() => router.push('/(tabs)')} style={styles.emptyButton}>
                <Text style={styles.emptyButtonText}>Explore destinations</Text>
              </Pressable>
            </View>
          ) : null
        }
      />
    </View>
  );
}

function getStyles(colors: ColorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    listContent: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
      flexGrow: 1,
    },
    title: {
      color: colors.text,
      fontSize: 28,
      fontWeight: '800',
      marginBottom: spacing.lg,
    },
    row: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    pressed: {
      opacity: 0.75,
    },
    flag: {
      fontSize: 28,
      marginRight: spacing.md,
    },
    info: {
      flex: 1,
      gap: 6,
    },
    name: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
    },
    meta: {
      color: colors.textMuted,
      fontSize: 13,
    },
    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: spacing.xl * 2,
    },
    emptyTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
      marginBottom: spacing.xs,
    },
    emptySubtitle: {
      color: colors.textMuted,
      fontSize: 14,
      textAlign: 'center',
      marginBottom: spacing.lg,
      paddingHorizontal: spacing.lg,
    },
    emptyButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: radius.lg,
    },
    emptyButtonText: {
      color: colors.onPrimary,
      fontWeight: '700',
    },
  });
}

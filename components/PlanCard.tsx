import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Plan } from '../lib/data';
import { ColorScheme, radius, spacing } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

export function PlanCard({ plan, selected, onPress }: { plan: Plan; selected?: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, selected && styles.cardSelected, pressed && styles.pressed]}
    >
      <View>
        <Text style={styles.data}>{plan.dataAmountGb} GB</Text>
        <Text style={styles.meta}>
          {plan.validityDays} days · {plan.networkType}
        </Text>
      </View>
      <Text style={[styles.price, selected && styles.priceSelected]}>${plan.priceUsd.toFixed(2)}</Text>
    </Pressable>
  );
}

function getStyles(colors: ColorScheme) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    cardSelected: {
      borderColor: colors.primary,
    },
    pressed: {
      opacity: 0.8,
    },
    data: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
    },
    meta: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 2,
    },
    price: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
    },
    priceSelected: {
      color: colors.primary,
    },
  });
}
